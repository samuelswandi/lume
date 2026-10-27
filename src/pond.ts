// An ASCII koi pond drawn on a canvas behind the page.
// `Pond` simulates the fish; `PondRenderer` rasterizes them into monospace cells.

type RGB = [number, number, number]
type Variety = 'kohaku' | 'sanke' | 'tancho'

const TAU = Math.PI * 2
const NODES = 16
const STEP = 1 / 60

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v)
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo)
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const pack = (c: RGB) => ((c[0] | 0) << 16) | ((c[1] | 0) << 8) | (c[2] | 0)

function smooth(lo: number, hi: number, x: number) {
  const t = clamp((x - lo) / (hi - lo), 0, 1)
  return t * t * (3 - 2 * t)
}

function angleDiff(from: number, to: number) {
  let d = (to - from) % TAU
  if (d > Math.PI) d -= TAU
  if (d < -Math.PI) d += TAU
  return d
}

function hash(a: number, b: number, c: number) {
  let h = Math.imul(a | 0, 0x165667b1) ^ Math.imul(b | 0, 0x27d4eb2f) ^ Math.imul(c | 0, 0x55fdc781)
  h = Math.imul(h ^ (h >>> 13), 0x4bf19f61)
  return ((h ^ (h >>> 16)) >>> 0) / 0x100000000
}

function valueNoise(x: number, y: number, seed: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = smooth(0, 1, x - ix)
  const fy = smooth(0, 1, y - iy)
  const a = hash(ix, iy, seed)
  const b = hash(ix + 1, iy, seed)
  const c = hash(ix, iy + 1, seed)
  const d = hash(ix + 1, iy + 1, seed)
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
}

// ---------------------------------------------------------------- simulation

interface Pellet { x: number; y: number; vx: number; vy: number; born: number; landAt: number; landed: boolean }
interface Ripple { x: number; y: number; born: number; strength: number }
interface Bite { x: number; y: number; born: number }
interface Box { left: number; top: number; right: number; bottom: number }

interface Koi {
  id: number
  variety: Variety
  length: number
  nodes: Float32Array
  heading: number
  speed: number
  phase: number
  wander: number
  turn: number
  curiosity: number
  depth: number
  depthTarget: number
  nextDepth: number
  beat: number
  rush: number
  burstUntil: number
  nextBurst: number
  nextRipple: number
  finPhase: number
  food: Pellet | null
}

const VARIETIES: [Variety, number][] = [['kohaku', 3], ['sanke', 2], ['tancho', 1]]

function pickVariety(): Variety {
  let roll = Math.random() * VARIETIES.reduce((sum, [, w]) => sum + w, 0)
  for (const [variety, weight] of VARIETIES) {
    roll -= weight
    if (roll <= 0) return variety
  }
  return 'kohaku'
}

const rippleLife = (r: Ripple) => 2.2 + 1.6 * r.strength

class World {
  width = 0
  height = 0
  time = 0
  koi: Koi[] = []
  pellets: Pellet[] = []
  ripples: Ripple[] = []
  bites: Bite[] = []
  pointer = { x: 0, y: 0, speed: 0, active: false }

  resize(width: number, height: number) {
    const first = this.width === 0
    this.width = width
    this.height = height
    if (first) this.seed()
  }

  private seed() {
    const { width, height } = this
    const base = clamp(0.5 * Math.min(width, height), 150, 380)
    const large = clamp(Math.round((width * height) / 260000), 3, 6)
    const small = width >= 1024 ? 2 : 0
    for (let i = 0; i < large + small; i++) {
      const isSmall = i >= large
      const length = base * (isSmall ? rand(0.32, 0.45) : rand(0.6, 1))
      const heading = rand(0, TAU)
      const hx = rand(0.1 * width, 0.9 * width)
      const hy = rand(0.1 * height, 0.9 * height)
      const nodes = new Float32Array(NODES * 2)
      const seg = length / (NODES - 1)
      for (let n = 0; n < NODES; n++) {
        nodes[2 * n] = hx - Math.cos(heading) * seg * n
        nodes[2 * n + 1] = hy - Math.sin(heading) * seg * n
      }
      this.koi.push({
        id: i + 1,
        variety: pickVariety(),
        length,
        nodes,
        heading,
        speed: 20,
        phase: rand(0, TAU),
        wander: 0,
        turn: 0,
        curiosity: rand(0.35, 1),
        depth: rand(0.5, isSmall ? 0.72 : 1),
        depthTarget: rand(0.5, 1),
        nextDepth: rand(6, 18),
        beat: 0,
        rush: 0,
        burstUntil: 0,
        nextBurst: rand(0, 3),
        nextRipple: rand(0, 2),
        finPhase: rand(0, TAU),
        food: null,
      })
    }
  }

  feed(x: number, y: number) {
    this.ripples.push({ x, y, born: this.time, strength: 0.35 })
    const count = Math.min(5 + Math.floor(Math.random() * 3), 24 - this.pellets.length)
    for (let i = 0; i < count; i++) {
      const angle = rand(0, TAU)
      const radius = 34 * Math.sqrt(Math.random())
      const drift = rand(2, 6)
      this.pellets.push({
        x: x + Math.cos(angle) * radius * 1.3,
        y: y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * drift,
        vy: Math.sin(angle) * drift,
        born: this.time,
        landAt: rand(0.15, 0.45),
        landed: false,
      })
    }
  }

  step(dt: number) {
    this.time += dt
    this.pointer.speed *= Math.exp(-8 * dt)
    for (const koi of this.koi) this.stepKoi(koi, dt)

    const t = this.time
    this.pellets = this.pellets.filter((p) => t - p.born < 14)
    for (const p of this.pellets) {
      if (!p.landed) {
        if (t - p.born < p.landAt) continue
        p.landed = true
        this.ripples.push({ x: p.x, y: p.y, born: t, strength: 0.1 })
        for (const koi of this.koi) {
          if (Math.hypot(koi.nodes[0] - p.x, koi.nodes[1] - p.y) < 650) koi.rush = 1
        }
        continue
      }
      const drag = Math.exp(-0.2 * dt)
      p.vx *= drag
      p.vy *= drag
      p.x += p.vx * dt
      p.y += p.vy * dt
    }
    this.ripples = this.ripples.filter((r) => t - r.born < rippleLife(r))
    this.bites = this.bites.filter((b) => t - b.born < 0.45)
  }

  private nearestPellet(x: number, y: number, range: number) {
    let best: Pellet | null = null
    let bestDist = range * range
    for (const p of this.pellets) {
      if (!p.landed) continue
      const d = (p.x - x) ** 2 + (p.y - y) ** 2
      if (d < bestDist) {
        bestDist = d
        best = p
      }
    }
    return best
  }

  private pickFood(koi: Koi, x: number, y: number, range: number) {
    if (koi.food && !this.pellets.includes(koi.food)) koi.food = null
    const nearest = this.nearestPellet(x, y, range)
    if (!koi.food) return (koi.food = nearest)
    const current = Math.hypot(koi.food.x - x, koi.food.y - y)
    if (current > 1.3 * range) koi.food = nearest
    else if (nearest && Math.hypot(nearest.x - x, nearest.y - y) < 0.5 * current) koi.food = nearest
    return koi.food
  }

  private stepKoi(koi: Koi, dt: number) {
    const { width, height, pointer, time } = this
    const L = koi.length
    const n = koi.nodes
    const hx = n[0]
    const hy = n[1]

    koi.wander = clamp(koi.wander + (Math.random() - 0.5) * dt * 2.4, -0.9, 0.9)
    let dx = Math.cos(koi.heading) + 0.6 * Math.cos(koi.heading + koi.wander)
    let dy = Math.sin(koi.heading) + 0.6 * Math.sin(koi.heading + koi.wander)

    const food = this.pickFood(koi, hx, hy, Math.max(1.6 * L + 220, koi.rush > 0 ? 650 : 0))
    let chasing = false
    let curious = false
    let closeness = 0

    if (food) {
      const fx = food.x - hx
      const fy = food.y - hy
      const dist = Math.hypot(fx, fy) || 1
      dx += (fx / dist) * 3
      dy += (fy / dist) * 3
      chasing = true
      closeness = clamp(1 - dist / (1.2 * L), 0, 1)
    } else if (pointer.active) {
      const px = pointer.x - hx
      const py = pointer.y - hy
      const dist = Math.hypot(px, py) || 1
      if (dist < 300) {
        // Drift toward the pointer, then circle it once close.
        const pull = koi.curiosity * (1 - dist / 300) * 2.2
        const toward = clamp(dist / (0.6 * L), 0, 1)
        dx += ((px / dist) * toward - (py / dist) * (1 - toward)) * pull
        dy += ((py / dist) * toward + (px / dist) * (1 - toward)) * pull
        curious = true
      }
    }

    for (const other of this.koi) {
      if (other === koi) continue
      if (Math.abs(other.nodes[0] - hx) > 2 * L || Math.abs(other.nodes[1] - hy) > 2 * L) continue
      const personalSpace = (L + other.length) * (food ? 0.12 : 0.28)
      for (let i = 0; i < NODES; i += 3) {
        const ox = hx - other.nodes[2 * i]
        const oy = hy - other.nodes[2 * i + 1]
        const dist = Math.hypot(ox, oy)
        if (dist < personalSpace && dist > 0.001) {
          const push = (1 - dist / personalSpace) * 2.4
          dx += (ox / dist) * push
          dy += (oy / dist) * push
        }
      }
    }

    // Turn back toward the middle near the edges of the water.
    const overshoot = Math.max(-hx, hx - width, -hy, hy - height)
    if (overshoot > -0.25 * L) {
      const strength = 3.5 * clamp((overshoot + 0.25 * L) / (0.5 * L), 0, 1)
      const cx = width / 2 - hx
      const cy = height / 2 - hy
      const dist = Math.hypot(cx, cy) || 1
      dx += (cx / dist) * strength
      dy += (cy / dist) * strength
    }

    const targetHeading = Math.atan2(dy, dx)
    const turnRate = chasing ? 1.9 + closeness : curious ? 1.2 : 0.7
    const maxTurn = (1 + 0.6 * koi.rush) * Math.min(turnRate, (koi.speed / L) * 4) * dt
    const turn = clamp(angleDiff(koi.heading, targetHeading), -maxTurn, maxTurn)
    koi.heading += turn
    koi.turn += (turn / dt - koi.turn) * Math.min(1, 3 * dt)

    if (time > koi.nextBurst && time > koi.burstUntil) {
      koi.burstUntil = time + rand(0.7, 1.6)
      koi.nextBurst = koi.burstUntil + rand(1.2, 4)
    }
    const bursting = chasing || time < koi.burstUntil
    koi.beat += ((bursting ? 1 : 0) - koi.beat) * Math.min(1, 3 * dt)
    if (koi.beat > 0.6 && koi.depth > 0.65 && time > koi.nextRipple) {
      this.ripples.push({ x: n[2 * (NODES - 2)], y: n[2 * (NODES - 2) + 1], born: time, strength: 0.25 + 0.2 * koi.depth })
      koi.nextRipple = time + rand(0.8, 1.6) / koi.beat
    }
    koi.rush = Math.max(0, koi.rush - 0.7 * dt)

    const cruise = 12 + 0.05 * L
    const target = (1 + 0.8 * koi.rush) * (chasing ? cruise * (1.9 + closeness) : bursting ? cruise * (curious ? 1.6 : 1.35) : 0.45 * cruise)
    koi.speed += (target - koi.speed) * Math.min(1, dt * (bursting ? 1.6 + 3 * koi.rush : 0.35))
    koi.phase += dt * (0.6 + koi.beat * (2.2 + koi.speed / 11))
    koi.finPhase += 2.4 * dt

    if (time > koi.nextDepth) {
      koi.depthTarget = rand(0.5, 1)
      koi.nextDepth = time + rand(8, 20)
    }
    koi.depth += ((chasing ? 1 : koi.depthTarget) - koi.depth) * Math.min(1, dt * (chasing ? 0.8 : 0.15))

    n[0] += Math.cos(koi.heading) * koi.speed * dt
    n[1] += Math.sin(koi.heading) * koi.speed * dt

    // Each segment follows the one ahead, with a limited bend per joint.
    const seg = L / (NODES - 1)
    let prevAngle = koi.heading + Math.PI
    for (let i = 1; i < NODES; i++) {
      const px = n[(i - 1) * 2]
      const py = n[(i - 1) * 2 + 1]
      let angle = Math.atan2(n[2 * i + 1] - py, n[2 * i] - px)
      angle = prevAngle + clamp(angleDiff(prevAngle, angle), -0.16, 0.16)
      n[2 * i] = px + Math.cos(angle) * seg
      n[2 * i + 1] = py + Math.sin(angle) * seg
      prevAngle = angle
    }

    const reach = 0.08 * L + 6
    const before = this.pellets.length
    this.pellets = this.pellets.filter((p) => !p.landed || (p.x - n[0]) ** 2 + (p.y - n[1]) ** 2 > reach * reach)
    if (this.pellets.length < before) {
      this.ripples.push({ x: n[0], y: n[1], born: time, strength: 0.6 })
      this.bites.push({ x: n[0], y: n[1], born: time })
    }
  }
}

// ------------------------------------------------------------------ rendering

interface Marking { s: number; v: number; rs: number; rv: number }
interface Markings { red: Marking[]; black: Marking[] }

const PALETTE = {
  bg: [245, 244, 241] as RGB,
  white: [118, 114, 108] as RGB,
  red: [204, 62, 28] as RGB,
  black: [36, 33, 40] as RGB,
  fin: [140, 134, 128] as RGB,
  eye: [24, 22, 26] as RGB,
  water: [38, 37, 35] as RGB,
  shadow: [60, 58, 56] as RGB,
  pellet: [176, 108, 40] as RGB,
  shadowAlpha: 0.2,
  alpha: 0.9,
  depthFloor: 0.55,
  ink: 0.45,
  redRamp: [[138, 24, 22], [184, 38, 24], [222, 62, 28], [238, 100, 38], [244, 140, 66], [248, 176, 116]] as RGB[],
}

const SHADES = 't%SX8@#'
const SUBSAMPLES = [0.25, 0.25, 0.75, 0.25, 0.25, 0.75, 0.75, 0.75]
const DIM_FLOOR = 0.12

const enum Part { None, Body, Tail, Eye }

const rampAt = (ramp: RGB[], t: number): RGB => {
  const x = clamp(t, 0, 1) * (ramp.length - 1)
  const i = Math.min(ramp.length - 2, Math.floor(x))
  return mix(ramp[i], ramp[i + 1], x - i)
}

// Half-width of the fish as a fraction of its length, by position from head (0) to tail (1).
function bodyHalfWidth(s: number) {
  if (s < 0.12) return 0.11 * Math.pow(Math.sin(((s / 0.12) * Math.PI) / 2), 0.55)
  if (s < 0.3) return 0.11 + 0.025 * smooth(0.12, 0.3, s)
  return 0.033 + 0.102 * (1 - smooth(0.3, 0.74, s))
}

// Half-width of the tail fan, which opens up past the end of the body.
function tailHalfWidth(s: number, flare: number) {
  return (0.03 + 0.15 * Math.pow(smooth(0.7, 1, s), 0.8)) * flare
}

function directionGlyph(dx: number, dy: number) {
  const len = Math.hypot(dx, dy) || 1
  if (Math.abs(dy) < 0.38 * len) return '-'
  if (Math.abs(dx) < 0.38 * len) return '|'
  return dx * dy > 0 ? '\\' : '/'
}

function makeMarkings(koi: Koi): Markings {
  const r = (i: number) => hash(koi.id, i, 41)
  if (koi.variety === 'tancho') return { red: [{ s: 0.11, v: 0, rs: 0.05, rv: 0.055 }], black: [] }
  const red: Marking[] = []
  if (r(0) < 0.75) red.push({ s: 0.1, v: (r(1) - 0.5) * 0.03, rs: 0.055 + 0.03 * r(2), rv: 0.11 })
  const patches = 2 + Math.floor(2 * r(3))
  const span = 0.42 / patches
  for (let i = 0; i < patches; i++) {
    red.push({
      s: 0.25 + span * (i + 0.5) + (r(10 + i) - 0.5) * span * 0.3,
      v: (r(20 + i) - 0.5) * 0.05,
      rs: span * (0.32 + 0.12 * r(30 + i)),
      rv: 0.09 + 0.05 * r(40 + i),
    })
  }
  const black: Marking[] = []
  if (koi.variety === 'sanke') {
    const spots = 4 + Math.floor(3 * r(50))
    for (let i = 0; i < spots; i++) {
      black.push({ s: 0.24 + 0.44 * r(60 + i), v: (r(70 + i) - 0.5) * 0.16, rs: 0.022, rv: 0.026 })
    }
  }
  return { red, black }
}

const inPatch = (m: Marking, s: number, v: number, wobble: number) =>
  ((s - m.s) / m.rs) ** 2 + ((v - m.v) / m.rv) ** 2 < 1 + wobble

class PondRenderer {
  private ctx: CanvasRenderingContext2D
  private dpr = 1
  private cw = 8
  private ch = 10
  private cols = 0
  private rows = 0
  private styles = new Map<number, string>()
  private markings = new Map<number, Markings>()

  private energy = new Float32Array(0)
  private energyTmp = new Float32Array(0)
  private glyph = new Uint16Array(0)
  private glyphColor = new Uint32Array(0)
  private glyphAlpha = new Float32Array(0)
  private tile = new Uint32Array(0)
  private tileAlpha = new Float32Array(0)
  private shadow = new Uint8Array(0)
  private dim = new Float32Array(0)

  // Scratch state for the fish currently being rasterized.
  private spine = new Float32Array(NODES * 2)
  private arc = new Float32Array(NODES)
  private arcTotal = 1
  private flareLeft = 1
  private flareRight = 1
  private hit = { part: Part.None as Part, s: 0, v: 0, across: 1, dist: 0, seg: 0, tx: 1, ty: 0 }

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('2D canvas unavailable')
    this.ctx = ctx
  }

  resize(width: number, height: number, dpr: number) {
    this.dpr = dpr
    this.cw = clamp(Math.round(width / 125), 8, 12)
    this.ch = this.cw + 2
    this.cols = Math.ceil(width / this.cw)
    this.rows = Math.ceil(height / this.ch)
    this.ctx.canvas.width = Math.round(width * dpr)
    this.ctx.canvas.height = Math.round(height * dpr)
    const cells = this.cols * this.rows
    this.energy = new Float32Array(cells)
    this.energyTmp = new Float32Array(cells)
    this.glyph = new Uint16Array(cells)
    this.glyphColor = new Uint32Array(cells)
    this.glyphAlpha = new Float32Array(cells)
    this.tile = new Uint32Array(cells)
    this.tileAlpha = new Float32Array(cells)
    this.shadow = new Uint8Array(cells)
    this.dim = new Float32Array(cells).fill(1)
  }

  // Fade the pond near page content so text stays readable.
  setDimBoxes(boxes: Box[]) {
    const { cols, rows, cw, ch, dim } = this
    dim.fill(1)
    const reach = 2.5 * cw
    for (const box of boxes) {
      const c0 = Math.max(0, Math.floor((box.left - reach) / cw))
      const c1 = Math.min(cols - 1, Math.floor((box.right + reach) / cw))
      const r0 = Math.max(0, Math.floor((box.top - reach) / ch))
      const r1 = Math.min(rows - 1, Math.floor((box.bottom + reach) / ch))
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const x = c * cw + cw / 2
          const y = r * ch + ch / 2
          const dist = Math.hypot(Math.max(box.left - x, 0, x - box.right), Math.max(box.top - y, 0, y - box.bottom))
          const i = r * cols + c
          dim[i] = Math.min(dim[i], DIM_FLOOR + (1 - DIM_FLOOR) * smooth(0, reach, dist))
        }
      }
    }
  }

  render(world: World, dt: number) {
    const { ctx, dpr, cols } = this
    if (cols === 0) return
    this.glyph.fill(0)
    this.tileAlpha.fill(0)
    this.shadow.fill(0)
    for (const koi of [...world.koi].sort((a, b) => a.depth - b.depth)) this.rasterizeKoi(koi, world.time)
    this.depositWake(world)
    this.diffuse(dt)

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.font = `600 ${Math.round(0.72 * this.ch)}px ui-monospace, SFMono-Regular, Menlo, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    this.drawShadows()
    this.drawWake()
    this.drawRipples(world)
    this.drawPellets(world)
    this.drawCells()
    this.drawBites(world)
    ctx.globalAlpha = 1
  }

  private style(color: number) {
    let s = this.styles.get(color)
    if (!s) {
      s = `rgb(${color >>> 16},${(color >>> 8) & 255},${color & 255})`
      this.styles.set(color, s)
    }
    return s
  }

  private glyphAt(index: number, char: string, color: RGB, alpha: number) {
    const { ctx, cw, ch, cols } = this
    ctx.globalAlpha = alpha
    ctx.fillStyle = this.style(pack(color))
    ctx.fillText(char, (index % cols) * cw + cw / 2, Math.floor(index / cols) * ch + ch / 2)
  }

  private cellIndex(x: number, y: number) {
    const c = Math.floor(x / this.cw)
    const r = Math.floor(y / this.ch)
    return c < 0 || r < 0 || c >= this.cols || r >= this.rows ? -1 : r * this.cols + c
  }

  private skin(koi: Koi, s: number, v: number, L: number): RGB {
    if (s > 0.74) return PALETTE.white
    const m = this.markings.get(koi.id) ?? makeMarkings(koi)
    this.markings.set(koi.id, m)
    const nv = v / L
    const wobble = (valueNoise(14 * s + koi.id, 30 * nv, koi.id + 3) - 0.5) * 0.6
    for (const p of m.black) if (inPatch(p, s, nv, wobble)) return PALETTE.black
    for (const p of m.red) if (inPatch(p, s, nv, wobble)) return PALETTE.red
    return PALETTE.white
  }

  // Nearest point on the spine to (x, y); fills this.hit with where the point lies on the fish.
  private probe(x: number, y: number, L: number, segFrom = 0, segTo = NODES - 2): boolean {
    const { spine, arc, hit } = this
    let best = Infinity
    let s = 0
    let side = 1
    let overshoot = 0
    let underrun = 0
    let across = 0
    for (let i = segFrom; i <= segTo; i++) {
      const ax = spine[2 * i]
      const ay = spine[2 * i + 1]
      const sx = spine[2 * i + 2] - ax
      const sy = spine[2 * i + 3] - ay
      const len2 = sx * sx + sy * sy || 1
      const t = ((x - ax) * sx + (y - ay) * sy) / len2
      const tc = clamp(t, 0, 1)
      const d2 = (x - ax - sx * tc) ** 2 + (y - ay - sy * tc) ** 2
      if (d2 < best) {
        const len = Math.sqrt(len2)
        best = d2
        s = (arc[i] + tc * len) / this.arcTotal
        const cross = sx * (y - ay) - sy * (x - ax)
        side = cross >= 0 ? 1 : -1
        across = Math.abs(cross) / len
        overshoot = i === NODES - 2 ? Math.max(0, t - 1) * len : 0
        underrun = i === 0 ? Math.max(0, -t) * len : 0
        hit.seg = i
        hit.tx = sx / len
        hit.ty = sy / len
      }
    }
    const dist = Math.sqrt(best)
    hit.s = s
    hit.v = dist * side
    hit.dist = dist
    hit.part = Part.None
    hit.across = 1

    const width = bodyHalfWidth(s) * L
    if (s <= 0.74 && dist <= width && underrun === 0) {
      const a = dist / width
      hit.across = a
      hit.part = s > 0.055 && s < 0.1 && a > 0.5 && a < 0.85 ? Part.Eye : Part.Body
      return true
    }
    if (s > 0.68 && overshoot === 0) {
      const flare = side > 0 ? this.flareLeft : this.flareRight
      const fan = tailHalfWidth(s, flare) * L
      if (across <= fan && s <= 0.86 + (across / fan) * 0.14) {
        hit.part = Part.Tail
        hit.across = across / fan
        return true
      }
    }
    return false
  }

  private rasterizeKoi(koi: Koi, time: number) {
    const { spine, arc, cw, ch, cols, rows } = this
    const L = koi.length
    const n = koi.nodes
    const amp = 0.2 + 1.1 * koi.beat

    // Bend the body into a swimming wave, strongest toward the tail.
    for (let i = 0; i < NODES; i++) {
      const a = i / (NODES - 1)
      const prev = Math.max(0, i - 1)
      const next = Math.min(NODES - 1, i + 1)
      let tx = n[2 * prev] - n[2 * next]
      let ty = n[2 * prev + 1] - n[2 * next + 1]
      const len = Math.hypot(tx, ty) || 1
      tx /= len
      ty /= len
      const offset = 0.04 * L * (0.05 + 0.95 * Math.pow(a, 2.2)) * amp * Math.sin(koi.phase - 4.6 * a)
      spine[2 * i] = n[2 * i] - ty * offset
      spine[2 * i + 1] = n[2 * i + 1] + tx * offset
    }
    arc[0] = 0
    for (let i = 1; i < NODES; i++) arc[i] = arc[i - 1] + Math.hypot(spine[2 * i] - spine[2 * i - 2], spine[2 * i + 1] - spine[2 * i - 1])
    this.arcTotal = arc[NODES - 1] || 1

    const sway = 0.18 * (1 - koi.beat) * Math.sin(koi.finPhase)
    const lean = clamp(0.6 * koi.turn, -0.35, 0.35)
    const spread = 1 - 0.25 * koi.beat
    this.flareLeft = spread + sway - lean
    this.flareRight = spread - sway + lean

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (let i = 0; i < NODES; i++) {
      minX = Math.min(minX, spine[2 * i])
      maxX = Math.max(maxX, spine[2 * i])
      minY = Math.min(minY, spine[2 * i + 1])
      maxY = Math.max(maxY, spine[2 * i + 1])
    }
    const pad = 0.26 * L
    const c0 = Math.max(0, Math.floor((minX - pad) / cw))
    const c1 = Math.min(cols - 1, Math.floor((maxX + pad) / cw))
    const r0 = Math.max(0, Math.floor((minY - pad) / ch))
    const r1 = Math.min(rows - 1, Math.floor((maxY + pad) / ch))
    if (c0 > c1 || r0 > r1) return

    const diag = Math.hypot(cw, ch)
    const shadowDx = Math.round((0.07 * L * koi.depth) / cw) + 1
    const shadowDy = Math.round((0.05 * L * koi.depth) / ch) + 1
    const alpha = PALETTE.alpha * (PALETTE.depthFloor + (1 - PALETTE.depthFloor) * koi.depth)
    const { hit } = this

    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const x = c * cw
        const y = r * ch
        const centerIn = this.probe(x + cw / 2, y + ch / 2, L)
        // Cells far from the body can be skipped, and so can the rest of the row segment.
        if (!centerIn && hit.dist > 0.25 * L + diag) {
          c += Math.max(0, Math.floor((hit.dist - 0.25 * L - diag) / cw))
          continue
        }

        const part = hit.part
        const s = hit.s
        const v = hit.v
        const across = hit.across
        const tx = hit.tx
        const ty = hit.ty
        const segLo = Math.max(0, hit.seg - 2)
        const segHi = Math.min(NODES - 2, hit.seg + 2)
        let coverage = centerIn ? 1 : 0
        let cx = 0
        let cy = 0
        for (let k = 0; k < SUBSAMPLES.length; k += 2) {
          if (this.probe(x + SUBSAMPLES[k] * cw, y + SUBSAMPLES[k + 1] * ch, L, segLo, segHi)) {
            cx += (SUBSAMPLES[k] - 0.5) * cw
            cy += (SUBSAMPLES[k + 1] - 0.5) * ch
            coverage++
          }
        }
        if (coverage === 0) continue

        const index = r * cols + c
        const side = v >= 0 ? 1 : -1
        const hash32 = (0xffffffff * hash(Math.round(90 * s), Math.round(v / (0.8 * cw)), koi.id)) >>> 0
        const solid = centerIn && coverage >= 3
        let char = ' '
        let color = PALETTE.fin
        let glyphA = alpha
        let tile: RGB | null = null
        let tileA = 0

        if (part === Part.Tail) {
          tile = mix(PALETTE.bg, PALETTE.fin, 0.55)
          tileA = 0.45 * alpha * (coverage / 5)
          if (hash32 % 2 === 0) {
            char = '.'
            glyphA *= 0.6 * (coverage / 5)
          }
        } else if (part === Part.Eye && solid) {
          tile = mix(PALETTE.bg, PALETTE.eye, 0.85)
          tileA = alpha
          char = 'o'
          color = mix(PALETTE.bg, PALETTE.white, 0.9)
        } else {
          const skin = this.skin(koi, s, v, L)
          const light = side * (0.6 * ty - 0.8 * tx) * across
          const shade = clamp(0.22 + 0.5 * Math.sqrt(1 - across * across) + 0.18 * light, 0, 1)
          if (skin === PALETTE.red) {
            const grain = (valueNoise(9 * s + koi.id, (v / L) * 18, koi.id + 21) - 0.5) * 0.25
            const glint = Math.max(0, Math.sin(11 * s - 1.8 * time + koi.id) - 0.7) / 0.3
            tile = rampAt(PALETTE.redRamp, 0.15 + 0.8 * shade + (hash(koi.id, 5, 17) - 0.5) * 0.3 + grain + 0.35 * glint)
          } else {
            tile = mix(PALETTE.bg, skin, 0.78 + (0.55 - 0.78) * shade)
          }
          if (solid) {
            const sx = c + shadowDx
            const sy = r + shadowDy
            if (sx < cols && sy < rows) this.shadow[sy * cols + sx] = 1
            char = SHADES[clamp(Math.round((1 - shade) * 4) + ((hash32 >>> 4) % 3), 0, SHADES.length - 1)]
            color = mix([0, 0, 0], tile, 1 - PALETTE.ink)
            if (skin === PALETTE.white) glyphA *= 0.6
            // A few scales catch the light and fade for a moment.
            const tick = Math.floor(1.4 * time + (hash32 % 997) / 97)
            if (hash(hash32, tick, 7) < 0.03) tile = mix(tile, PALETTE.bg, 0.45)
            tileA = alpha
          } else {
            tileA = alpha * (coverage / 5) * 0.55
            if (Math.hypot(cx, cy) > 0.2 * cw && hash32 % 3 === 0) {
              char = '.'
              color = mix([0, 0, 0], tile, 1 - PALETTE.ink)
            }
          }
        }

        if (char !== ' ' || tileA !== 0) {
          this.tile[index] = tile ? pack(tile) : 0
          this.tileAlpha[index] = tileA
          this.glyph[index] = char.charCodeAt(0)
          this.glyphColor[index] = pack(color)
          this.glyphAlpha[index] = glyphA
        }
      }
    }
  }

  private drawCells() {
    const { ctx, cw, ch, cols, glyph, glyphColor, glyphAlpha, tile, tileAlpha, dim } = this
    for (let i = 0; i < glyph.length; i++) {
      const code = glyph[i]
      if (!code && !tileAlpha[i]) continue
      const x = (i % cols) * cw
      const y = Math.floor(i / cols) * ch
      if (tileAlpha[i] > 0) {
        ctx.globalAlpha = tileAlpha[i] * dim[i]
        ctx.fillStyle = this.style(tile[i])
        ctx.fillRect(x + 1, y + 1, cw - 1, ch - 1)
      }
      if (code && code !== 32) {
        ctx.globalAlpha = glyphAlpha[i] * dim[i]
        ctx.fillStyle = this.style(glyphColor[i])
        ctx.fillText(String.fromCharCode(code), x + cw / 2, y + ch / 2 + 1)
      }
    }
  }

  private depositWake(world: World) {
    const { energy } = this
    for (const koi of world.koi) {
      for (let i = NODES - 4; i < NODES; i++) {
        const idx = this.cellIndex(koi.nodes[2 * i], koi.nodes[2 * i + 1])
        if (idx >= 0) energy[idx] = Math.min(1.5, energy[idx] + 0.035 + 0.0012 * koi.speed)
      }
    }
    if (world.pointer.active) {
      const idx = this.cellIndex(world.pointer.x, world.pointer.y)
      if (idx >= 0) energy[idx] = Math.min(1.5, energy[idx] + 0.12)
    }
  }

  private diffuse(dt: number) {
    const { cols, rows, energy, energyTmp } = this
    const decay = Math.exp(-1.1 * dt)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        const left = c > 0 ? energy[i - 1] : energy[i]
        const right = c < cols - 1 ? energy[i + 1] : energy[i]
        const up = r > 0 ? energy[i - cols] : energy[i]
        const down = r < rows - 1 ? energy[i + cols] : energy[i]
        energyTmp[i] = (4 * energy[i] + left + right + up + down) * 0.125 * decay
      }
    }
    this.energy = energyTmp
    this.energyTmp = energy
  }

  private drawShadows() {
    const { shadow, glyph, dim } = this
    for (let i = 0; i < shadow.length; i++) {
      if (shadow[i] && !glyph[i]) this.glyphAt(i, ':', PALETTE.shadow, PALETTE.shadowAlpha * dim[i])
    }
  }

  private drawWake() {
    const { energy, glyph, shadow, dim } = this
    for (let i = 0; i < energy.length; i++) {
      const e = energy[i]
      if (e < 0.22 || glyph[i] || shadow[i]) continue
      this.glyphAt(i, e > 0.5 ? '-' : '.', PALETTE.water, 0.35 * Math.min(1, (e - 0.22) * 1.4) * dim[i])
    }
  }

  private drawRipples(world: World) {
    const { cw, ch, cols, rows, glyph, dim } = this
    for (const ripple of world.ripples) {
      const age = world.time - ripple.born
      const fade = Math.pow(1 - age / rippleLife(ripple), 1.5) * ripple.strength
      for (let ring = 0; ring < 2; ring++) {
        const radius = 52 * Math.max(0, age - 0.45 * ring) * (0.7 + 0.5 * ripple.strength)
        if (radius < 2) continue
        const thickness = 0.6 * cw
        const c0 = Math.max(0, Math.floor((ripple.x - radius - cw) / cw))
        const c1 = Math.min(cols - 1, Math.floor((ripple.x + radius + cw) / cw))
        const r0 = Math.max(0, Math.floor((ripple.y - radius - ch) / ch))
        const r1 = Math.min(rows - 1, Math.floor((ripple.y + radius + ch) / ch))
        const alpha = fade * (ring === 0 ? 0.55 : 0.3)
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const i = r * cols + c
            if (glyph[i]) continue
            const px = c * cw + cw / 2 - ripple.x
            const py = r * ch + ch / 2 - ripple.y
            if (Math.abs(Math.hypot(px, py) - radius) > thickness) continue
            this.glyphAt(i, ring === 1 ? '.' : directionGlyph(-py, px), PALETTE.water, alpha * dim[i])
          }
        }
      }
    }
  }

  private drawPellets(world: World) {
    const { glyph, ch, dim } = this
    for (const p of world.pellets) {
      const age = world.time - p.born
      if (!p.landed) {
        const t = age / p.landAt
        const i = this.cellIndex(p.x, p.y - (1 - t) * ch * 1.5)
        if (i < 0 || glyph[i]) continue
        this.glyphAt(i, t < 0.5 ? "'" : '.', PALETTE.pellet, PALETTE.alpha * (0.5 + 0.4 * t) * dim[i])
        continue
      }
      const i = this.cellIndex(p.x, p.y)
      if (i < 0 || glyph[i]) continue
      const sink = smooth(9, 14, age)
      const shimmer = 0.8 + 0.2 * Math.sin(3 * age + p.x)
      this.glyphAt(i, sink > 0.55 ? '.' : 'o', PALETTE.pellet, PALETTE.alpha * shimmer * (1 - 0.85 * sink) * dim[i])
    }
  }

  private drawBites(world: World) {
    for (const bite of world.bites) {
      const i = this.cellIndex(bite.x, bite.y)
      if (i < 0) continue
      const t = (world.time - bite.born) / 0.45
      this.glyphAt(i, t < 0.35 ? '*' : t < 0.7 ? '+' : '.', PALETTE.pellet, Math.min(1, 1.6 * PALETTE.alpha) * (1 - t * t) * this.dim[i])
    }
  }
}

// ----------------------------------------------------------------- controller

const IGNORE_CLICK = "a, button, input, textarea, select, label, summary, [role='button']"

export class Pond {
  private world = new World()
  private renderer: PondRenderer
  private raf = 0
  private last = 0
  private acc = 0
  private frames = 0
  private lastPointerTime = 0
  private disposed = false
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  private resizeObserver: ResizeObserver

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new PondRenderer(canvas)
    this.resizeObserver = new ResizeObserver(this.resize)
    this.resizeObserver.observe(canvas)
    this.reducedMotion.addEventListener('change', this.schedule)
    window.addEventListener('pointermove', this.onPointerMove, { passive: true })
    window.addEventListener('click', this.onClick)
    window.addEventListener('scroll', this.measure, { passive: true })
    window.addEventListener('hashchange', this.onRouteChange)
    window.addEventListener('blur', this.onPointerLeave)
    document.documentElement.addEventListener('pointerleave', this.onPointerLeave)
    this.resize()
    this.schedule()
  }

  destroy() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.resizeObserver.disconnect()
    this.reducedMotion.removeEventListener('change', this.schedule)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('click', this.onClick)
    window.removeEventListener('scroll', this.measure)
    window.removeEventListener('hashchange', this.onRouteChange)
    window.removeEventListener('blur', this.onPointerLeave)
    document.documentElement.removeEventListener('pointerleave', this.onPointerLeave)
  }

  private schedule = () => {
    cancelAnimationFrame(this.raf)
    if (this.disposed) return
    if (this.reducedMotion.matches) {
      this.drawStill()
      return
    }
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  private frame = (now: number) => {
    const dt = Math.min(0.1, (now - this.last) / 1000)
    this.last = now
    this.acc += dt
    let steps = 0
    while (this.acc >= STEP && steps < 4) {
      this.world.step(STEP)
      this.acc -= STEP
      steps++
    }
    if (steps === 4) this.acc = 0
    if (++this.frames % 6 === 0) this.measure()
    this.renderer.render(this.world, dt)
    this.raf = requestAnimationFrame(this.frame)
  }

  private drawStill() {
    if (this.world.time < 4) for (let i = 0; i < 240; i++) this.world.step(STEP)
    this.measure()
    this.renderer.render(this.world, STEP)
  }

  private resize = () => {
    const rect = this.canvas.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) return
    this.renderer.resize(rect.width, rect.height, Math.min(window.devicePixelRatio || 1, 2))
    this.world.resize(rect.width, rect.height)
    this.measure()
    if (this.reducedMotion.matches) this.drawStill()
  }

  // The canvas is fixed to the viewport, so element rects are already in canvas space.
  // Boxes follow each line of text rather than the whole block, so gaps stay visible.
  private measure = () => {
    const boxes: Box[] = []
    const range = document.createRange()
    const viewHeight = window.innerHeight
    for (const el of document.querySelectorAll('[data-pond-dim]')) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.textContent?.trim()) continue
        range.selectNodeContents(node)
        for (const r of range.getClientRects()) {
          if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < viewHeight) {
            boxes.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom })
          }
        }
      }
    }
    this.renderer.setDimBoxes(boxes)
  }

  private onRouteChange = () => requestAnimationFrame(this.measure)

  private onPointerMove = (e: PointerEvent) => {
    const pointer = this.world.pointer
    const dt = Math.max(1, e.timeStamp - this.lastPointerTime) / 1000
    const speed = Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y) / dt
    pointer.speed += (Math.min(speed, 5000) - pointer.speed) * 0.5
    this.lastPointerTime = e.timeStamp
    pointer.x = e.clientX
    pointer.y = e.clientY
    pointer.active = e.pointerType !== 'touch'
  }

  private onPointerLeave = () => {
    this.world.pointer.active = false
    this.world.pointer.speed = 0
  }

  private onClick = (e: MouseEvent) => {
    if (this.reducedMotion.matches || window.getSelection()?.toString()) return
    if (e.composedPath().some((el) => el instanceof Element && el.matches(IGNORE_CLICK))) return
    this.world.feed(e.clientX, e.clientY)
  }
}
