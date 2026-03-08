import optimismShapesReality from './content/optimism-shapes-reality.md?raw'
import sapiens from './content/sapiens.md?raw'
import the48LawsOfPower from './content/the-48-laws-of-power.md?raw'
import noise from './content/noise.md?raw'
import poorCharliesAlmanack from './content/poor-charlies-almanack.md?raw'
import privateEquity from './content/private-equity.md?raw'
import samAltmanBlog from './content/sam-altman-blog.md?raw'
import theArtOfShowingUp from './content/the-art-of-showing-up.md?raw'
import theRichestManInBabylon from './content/the-richest-man-in-babylon.md?raw'
import theThreeBodyProblem from './content/the-three-body-problem.md?raw'
import theVisualMba from './content/the-visual-mba.md?raw'
import thinkingFastAndSlow from './content/thinking-fast-and-slow.md?raw'
import youAndYourResearch from './content/you-and-your-research.md?raw'
import zeroToOne from './content/zero-to-one.md?raw'

export type ShelfItem = {
  slug: string
  title: string
  subtitle: string
  coverClass: string
  coverImage?: string
  icon?: string
  meta?: string
  tag?: string
  description?: string
  summary: string
  published: string
  format: string
  pages: string
  status: string
  abstract: string
  notes: string[]
  markdown: string
  sourceUrl: string
}

export const shelfItems: ShelfItem[] = [
  {
    slug: 'private-equity',
    title: 'Private Equity',
    subtitle: 'Carrie Sun',
    coverClass: 'cover-light',
    meta: '2024',
    description: 'Memoir',
    summary:
      'A finance memoir about ambition, proximity to power, and the cost of optimizing your life for elite institutions.',
    published: 'February 2024',
    format: 'Memoir',
    pages: '352 pages',
    status: 'On shelf',
    abstract:
      'Carrie Sun writes from inside the prestige machine, tracing what private equity looked like from the assistant desk and what that world asks people to trade for belonging.',
    notes: ['Ambition', 'Status games', 'Work and identity'],
    markdown: privateEquity,
    sourceUrl: 'https://www.penguinrandomhouse.com/books/738728/private-equity-by-carrie-sun/',
  },
  {
    slug: 'zero-to-one',
    title: 'Zero to One',
    subtitle: 'Peter Thiel and Blake Masters',
    coverClass: 'cover-dark',
    meta: '2014',
    description: 'Startups',
    icon: 'rocket_launch',
    summary:
      'A compact argument for building non-obvious businesses that create new categories instead of competing inside crowded ones.',
    published: 'September 2014',
    format: 'Business',
    pages: '224 pages',
    status: 'On shelf',
    abstract:
      'The book distills Peter Thiel’s startup worldview into a set of sharp heuristics around monopoly, distribution, defensibility, and contrarian thinking.',
    notes: ['Contrarian bets', 'Monopoly', 'Distribution'],
    markdown: zeroToOne,
    sourceUrl:
      'https://www.penguinrandomhouse.com/books/215400/zero-to-one-by-peter-thiel-with-blake-masters/',
  },
  {
    slug: 'sam-altman-blog',
    title: 'Sam Altman Blog',
    subtitle: 'Sam Altman',
    coverClass: 'cover-minimal',
    meta: 'ONGOING',
    description: 'Essays',
    tag: 'Startups, agency, AI.',
    summary:
      'A living archive of essays on startups, leverage, execution, personal growth, and long-term technological change.',
    published: 'Ongoing',
    format: 'Blog',
    pages: 'Living archive',
    status: 'Live',
    abstract:
      'The blog is less one thesis than a recurring operating system: compound effort, learn fast, maintain high agency, and position yourself close to important waves.',
    notes: ['Agency', 'Compounding', 'Technology waves'],
    markdown: samAltmanBlog,
    sourceUrl: 'https://blog.samaltman.com/',
  },
  {
    slug: 'poor-charlies-almanack',
    title: "Poor Charlie's Almanack",
    subtitle: 'Charles T. Munger',
    coverClass: 'cover-accent',
    meta: '2023',
    description: 'Mental Models',
    summary:
      'A dense collection of Charlie Munger speeches and frameworks on multidisciplinary thinking, investing, incentives, and judgment.',
    published: 'December 2023',
    format: 'Collected speeches',
    pages: '512 pages',
    status: 'On shelf',
    abstract:
      'This edition gathers Munger’s talks into a single volume that rewards slow reading: psychology, incentives, probabilistic thinking, and the compounding value of good judgment.',
    notes: ['Mental models', 'Incentives', 'Judgment'],
    markdown: poorCharliesAlmanack,
    sourceUrl: 'https://www.stripe.press/poor-charlies-almanack',
  },
  {
    slug: 'the-art-of-showing-up',
    title: 'The Art of Showing Up',
    subtitle: 'Steve Huynh',
    coverClass: 'cover-quote',
    meta: '2025',
    description: 'Substack',
    icon: 'article',
    summary:
      'An essay about attention, presence, and why actually showing up to the moment changes both the quality of work and the quality of life.',
    published: 'July 23, 2025',
    format: 'Essay',
    pages: 'Substack post',
    status: 'Live',
    abstract:
      'Published in A Life Engineered, the essay argues that fractured attention quietly stretches work, while presence shortens distance between intention and action.',
    notes: ['Presence', 'Attention', 'Consistency'],
    markdown: theArtOfShowingUp,
    sourceUrl: 'https://alifeengineered.substack.com/p/the-art-of-showing-up',
  },
  {
    slug: 'the-visual-mba',
    title: 'The Visual MBA',
    subtitle: 'Jason Barron',
    coverClass: 'cover-quote',
    meta: '2019',
    description: 'Business',
    icon: 'insights',
    summary:
      'An illustrated business primer that compresses core MBA concepts into diagrams, frameworks, and memorable one-page explanations.',
    published: 'May 2019',
    format: 'Illustrated guide',
    pages: '208 pages',
    status: 'On shelf',
    abstract:
      'Instead of arguing one worldview, it maps the language of business itself: accounting, strategy, operations, finance, marketing, and decision-making in visual shorthand.',
    notes: ['Frameworks', 'Strategy', 'Operations'],
    markdown: theVisualMba,
    sourceUrl: 'https://www.penguin.co.uk/books/1115935/the-visual-mba-by-barron-jason/9780241386682',
  },
  {
    slug: 'you-and-your-research',
    title: 'You and Your Research',
    subtitle: 'Richard Hamming via Sam Altman',
    coverClass: 'cover-minimal',
    meta: '1986 / 2013',
    description: 'Talk',
    tag: 'Preparation, courage, significance.',
    summary:
      'A famous talk on doing important work, taking your ambitions seriously, and building the habits that make luck less random.',
    published: 'March 1986 talk, shared on Sam Altman Blog',
    format: 'Talk transcript',
    pages: 'Blog post',
    status: 'Live',
    abstract:
      'Richard Hamming’s talk, reposted by Sam Altman, is a blunt argument for courage, prepared minds, and doing work that matters instead of waiting for significance to happen by chance.',
    notes: ['Prepared mind', 'Courage', 'Great work'],
    markdown: youAndYourResearch,
    sourceUrl: 'https://blog.samaltman.com/you-and-your-research',
  },
  {
    slug: 'optimism-shapes-reality',
    title: 'Optimism Shapes Reality',
    subtitle: 'Alexandr Wang',
    coverClass: 'cover-accent',
    meta: '2022',
    description: 'Substack',
    summary:
      'A short startup memo on urgency, optimistic scoping, and how timelines are partly shaped by the expectations wrapped around them.',
    published: 'May 30, 2022',
    format: 'Essay',
    pages: 'Substack post',
    status: 'Live',
    abstract:
      'The essay argues that scope is not a neutral estimate. In practice, expected timelines shape behavior, which means optimism can materially change how fast a team moves.',
    notes: ['Urgency', 'Scoping', 'Execution tempo'],
    markdown: optimismShapesReality,
    sourceUrl: 'https://alexw.substack.com/p/optimism-shapes-reality',
  },
  {
    slug: 'the-three-body-problem',
    title: 'The Three-Body Problem',
    subtitle: 'Cixin Liu',
    coverClass: 'cover-light',
    meta: '2016',
    description: 'Science Fiction',
    summary:
      'A large-scale sci-fi novel about physics, civilization, cosmic contact, and the unsettling consequences of seeing humanity from a wider frame.',
    published: 'January 2016',
    format: 'Novel',
    pages: '416 pages',
    status: 'On shelf',
    abstract:
      'The novel connects personal grief, scientific discovery, and civilizational strategy, then keeps widening the lens until even familiar moral intuitions feel provisional.',
    notes: ['Cosmic scale', 'Civilization', 'Science'],
    markdown: theThreeBodyProblem,
    sourceUrl:
      'https://us.macmillan.com/books/9780765382030/the-three-body-problem/',
  },
  {
    slug: 'sapiens',
    title: 'Sapiens',
    subtitle: 'Yuval Noah Harari',
    coverClass: 'cover-light',
    meta: '2014',
    description: 'History',
    summary:
      'A sweeping history of humankind that connects cognition, myth, empire, capitalism, and biology into one long explanation of how our species became dominant.',
    published: '2014 English edition',
    format: 'History',
    pages: '464 pages',
    status: 'On shelf',
    abstract:
      'Harari reframes familiar history through species-level lenses, asking how shared fictions, institutions, and failures shaped the world humans now inhabit.',
    notes: ['Species history', 'Myth', 'Failure and adaptation'],
    markdown: sapiens,
    sourceUrl: 'https://www.harperacademic.com/book/9780062316097/sapiens',
  },
  {
    slug: 'thinking-fast-and-slow',
    title: 'Thinking, Fast and Slow',
    subtitle: 'Daniel Kahneman',
    coverClass: 'cover-dark',
    meta: '2011',
    description: 'Psychology',
    icon: 'psychology',
    summary:
      'The canonical map of intuitive versus deliberate thought, and the biases that quietly shape judgment under uncertainty.',
    published: 'October 2011',
    format: 'Psychology',
    pages: '512 pages',
    status: 'On shelf',
    abstract:
      'Kahneman organizes decades of behavioral science into a workable model of human judgment, then uses it to explain why confident decisions can still be systematically wrong.',
    notes: ['Biases', 'Decision making', 'System 1 and 2'],
    markdown: thinkingFastAndSlow,
    sourceUrl:
      'https://www.penguinrandomhouse.com/books/164655/thinking-fast-and-slow-by-daniel-kahneman/',
  },
  {
    slug: 'noise',
    title: 'Noise',
    subtitle: 'Daniel Kahneman, Olivier Sibony, and Cass R. Sunstein',
    coverClass: 'cover-minimal',
    meta: '2021',
    description: 'Judgment',
    tag: 'The variability behind decisions.',
    summary:
      'A study of unwanted variability in professional judgment and how inconsistent decisions can hide in plain sight inside capable systems.',
    published: 'May 2021',
    format: 'Behavioral science',
    pages: '464 pages',
    status: 'On shelf',
    abstract:
      'Where bias is systematic error, noise is scatter. The book makes the case that organizations often under-measure the randomness in their own judgments, even when consequences are serious.',
    notes: ['Variability', 'Decision hygiene', 'Organizations'],
    markdown: noise,
    sourceUrl:
      'https://www.hachettebookgroup.com/titles/daniel-kahneman/noise/9780316451406/',
  },
  {
    slug: 'the-richest-man-in-babylon',
    title: 'The Richest Man in Babylon',
    subtitle: 'George S. Clason',
    coverClass: 'cover-accent',
    meta: '1926',
    description: 'Money',
    summary:
      'A classic personal-finance parable collection built around saving, patience, debt avoidance, and the slow discipline of wealth building.',
    published: '1926',
    format: 'Finance classic',
    pages: '160 pages',
    status: 'On shelf',
    abstract:
      'The ideas are simple on purpose: pay yourself first, control spending, make money multiply, and avoid decisions that feel sophisticated but violate basic prudence.',
    notes: ['Saving', 'Discipline', 'Wealth building'],
    markdown: theRichestManInBabylon,
    sourceUrl:
      'https://www.penguinrandomhouse.com/books/757926/the-richest-man-in-babylon-by-george-s-clason/',
  },
  {
    slug: 'the-48-laws-of-power',
    title: 'The 48 Laws of Power',
    subtitle: 'Robert Greene',
    coverClass: 'cover-quote',
    meta: '1998',
    description: 'Power',
    icon: 'gavel',
    summary:
      'A provocative manual on status, strategy, manipulation, reputation, and the social mechanics of power.',
    published: 'September 1998',
    format: 'Strategy',
    pages: '480 pages',
    status: 'On shelf',
    abstract:
      'Greene treats power as a language with recurring patterns, then illustrates those patterns through historical examples that are often useful, cynical, and intentionally uncomfortable.',
    notes: ['Status', 'Strategy', 'Reputation'],
    markdown: the48LawsOfPower,
    sourceUrl:
      'https://www.penguinrandomhouse.com/books/188389/the-48-laws-of-power-by-robert-greene/',
  },
]

export const shelfItemsBySlug = new Map(
  shelfItems.map((item) => [item.slug, item] as const),
)
