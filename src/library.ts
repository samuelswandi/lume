import architecturalIntegrity from './content/architectural-integrity.md?raw'
import digitalPermanence from './content/digital-permanence.md?raw'
import foundationsOfScale from './content/foundations-of-scale.md?raw'
import moralCanvas from './content/the-moral-canvas.md?raw'
import thoughtsOnMinimal from './content/thoughts-on-minimal.md?raw'

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
}

export const shelfItems: ShelfItem[] = [
  {
    slug: 'foundations-of-scale',
    title: 'Foundations of Scale',
    subtitle: 'Systemic Thinking',
    coverClass: 'cover-light',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJcxLbXdv5yYT5pxdy9jomSgvmh7vHuAvgmdqAtY7hn2iBEzBnTzvtzEWkf8EU-a-2OnPLW0N6-ESogfNiso8MR7UkxSX8qD3dfpW20wtyFuFu_z1ZdZGGGEI0rfdn2LR0rjrLRuuxfwRTYUbdJ2zho6fvgPxYwjJcW-SD4Lr-egvuJ47MVbr1m-UlEWafQeOaRBloFeOPNxqSL71jvf85SZKdSj9pm1LVAN-IYpYrnDZ6lF3LNWwFdkgyqLCL6Kfd8vf-UbSDreYq',
    meta: 'Vol. 2023',
    description: 'Design Systems',
    summary:
      'A comprehensive guide to building scalable, resilient user interface frameworks.',
    published: 'October 2023',
    format: 'Digital Hardcover',
    pages: '342 Digital Units',
    status: 'Available in Archive',
    abstract:
      'Maps system primitives, governance rules, and the constraints required to keep a product language coherent at scale.',
    notes: ['Token taxonomies', 'Pattern drift control', 'Cross-team interface contracts'],
    markdown: foundationsOfScale,
  },
  {
    slug: 'architectural-integrity',
    title: 'Architectural Integrity',
    subtitle: 'Logical Flows',
    coverClass: 'cover-dark',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBw_KRDrDQpJTlq3Ds7-zBaAx7oi0BtvTNYo738yXoytEofzVa6fb5pMkmzCEbgCojMeUurUupsSMSMl6vqOEGKJOeYfDsbQ80yTryhKja7vLPgNAdziB-bh7tfoWRbbZ8cNfcVUcJ1xLnOhaXJgAj3HcmF4ny4y75nwyrKnzHtnvIAjvXlTVz4ZSopsSXr-ADSNSXfrmbAdcy2ds4G7uqYNiHYPQDiLdjMC4ms4ZqntzaM0HmUw-ehgBEBqTNvklcaBIE6maONIMRP',
    meta: 'Edition 02',
    description: 'Structural Logic',
    icon: 'architecture',
    summary:
      'A field manual for designing systems whose structure remains legible under growth and change.',
    published: 'May 2024',
    format: 'Studio Ledger',
    pages: '288 Grid Studies',
    status: 'Circulating in Studio',
    abstract:
      'Examines how information architecture, service boundaries, and product narratives reinforce one another in durable systems.',
    notes: ['Route orchestration', 'Decision trees', 'Structural affordances'],
    markdown: architecturalIntegrity,
  },
  {
    slug: 'digital-permanence',
    title: 'Digital Permanence',
    subtitle: 'Future Archives',
    coverClass: 'cover-minimal',
    meta: 'P-440',
    description: 'Archival Theory',
    tag: 'The permanence of bits.',
    summary:
      'A meditation on storage, retrieval, and the uneasy promise that digital artifacts can outlive their original context.',
    published: 'January 2022',
    format: 'Archive Paper',
    pages: '197 Records',
    status: 'Preserved',
    abstract:
      'Looks at metadata, migration, and legibility as the actual substance of long-term digital preservation.',
    notes: ['File lineage', 'Metadata durability', 'Context retention'],
    markdown: digitalPermanence,
  },
  {
    slug: 'the-moral-canvas',
    title: 'The Moral Canvas',
    subtitle: 'Responsible UX',
    coverClass: 'cover-accent',
    meta: 'Human Centered',
    description: 'Interface Ethics',
    summary:
      'Essays on persuasion, defaults, and the obligation to make interfaces legible to the people they affect.',
    published: 'August 2024',
    format: 'Ethics Folio',
    pages: '164 Briefings',
    status: 'Open for Review',
    abstract:
      'Frames interface design as a moral medium where nudges, omissions, and defaults carry political weight.',
    notes: ['Consent patterns', 'Default power', 'Trust calibration'],
    markdown: moralCanvas,
  },
  {
    slug: 'thoughts-on-minimal',
    title: 'Thoughts on Minimal',
    subtitle: '2021-2024',
    coverClass: 'cover-quote',
    meta: 'Curated Work',
    description: 'Selected Essays',
    icon: 'format_quote',
    summary:
      'A collected set of short reflections on reduction, restraint, and the difference between silence and emptiness.',
    published: 'December 2024',
    format: 'Essay Collection',
    pages: '91 Notes',
    status: 'Available in Reading Room',
    abstract:
      'Traces how minimal form can create either calm or ambiguity depending on the precision of what remains.',
    notes: ['Editorial reduction', 'Signal density', 'Quiet interaction design'],
    markdown: thoughtsOnMinimal,
  },
]

export const shelfItemsBySlug = new Map(
  shelfItems.map((item) => [item.slug, item] as const),
)
