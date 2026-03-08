import { useEffect, useRef, useState } from 'react'
import './App.css'

type ShelfItem = {
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
  badge: string
  abstract: string
  notes: string[]
  viewerPages: Array<{
    label: string
    heading: string
    body: string
  }>
}

const shelfItems: ShelfItem[] = [
  {
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
    badge: 'Now Viewing',
    abstract:
      'Maps system primitives, governance rules, and the constraints required to keep a product language coherent at scale.',
    notes: ['Token taxonomies', 'Pattern drift control', 'Cross-team interface contracts'],
    viewerPages: [
      {
        label: 'Chapter 01',
        heading: 'System primitives precede aesthetics.',
        body:
          'Before any visual language becomes memorable, it needs mechanical consistency. Buttons, inputs, and containers define operational trust long before a brand earns admiration.',
      },
      {
        label: 'Chapter 02',
        heading: 'Scale is an editorial problem.',
        body:
          'A design system is not a warehouse of reusable parts. It is a continuously edited publication where additions require argument, curation, and a willingness to remove weak patterns.',
      },
      {
        label: 'Chapter 03',
        heading: 'Governance becomes visible in the seams.',
        body:
          'The quality of a system shows up when teams compose novel flows under pressure. If the seams look intentional, the system is doing real work rather than merely offering components.',
      },
    ],
  },
  {
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
    badge: 'Selected Volume',
    abstract:
      'Examines how information architecture, service boundaries, and product narratives reinforce one another in durable systems.',
    notes: ['Route orchestration', 'Decision trees', 'Structural affordances'],
    viewerPages: [
      {
        label: 'Section A',
        heading: 'Every interface inherits its structure.',
        body:
          'Users encounter architecture through sequence, not diagrams. The order of information, the friction in transitions, and the placement of exits quietly reveal the quality of the underlying system.',
      },
      {
        label: 'Section B',
        heading: 'Integrity is measured in reroutes.',
        body:
          'When conditions change, strong architectures bend through explicit pathways. Weak ones rely on exceptions, local fixes, and hidden detours that accumulate into confusion.',
      },
      {
        label: 'Section C',
        heading: 'Clarity compounds across layers.',
        body:
          'A precise hierarchy in navigation supports cleaner service contracts and better content choices. Structural clarity is rarely isolated to a single part of the stack.',
      },
    ],
  },
  {
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
    badge: 'Archive Entry',
    abstract:
      'Looks at metadata, migration, and legibility as the actual substance of long-term digital preservation.',
    notes: ['File lineage', 'Metadata durability', 'Context retention'],
    viewerPages: [
      {
        label: 'Record 01',
        heading: 'Preservation fails when context goes missing.',
        body:
          'Files rarely disappear all at once. More often, meaning degrades first: naming conventions decay, dependencies vanish, and the reasons a thing mattered become unrecoverable.',
      },
      {
        label: 'Record 02',
        heading: 'Archives are active systems.',
        body:
          'To preserve a digital object is to continue interpreting it. Formats must be migrated, references re-resolved, and descriptive layers rewritten for new eras of access.',
      },
      {
        label: 'Record 03',
        heading: 'Permanence depends on stewardship.',
        body:
          'Longevity is less about immortal media and more about recurring care. Durable archives budget for future readers they will never meet.',
      },
    ],
  },
  {
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
    badge: 'Field Notes',
    abstract:
      'Frames interface design as a moral medium where nudges, omissions, and defaults carry political weight.',
    notes: ['Consent patterns', 'Default power', 'Trust calibration'],
    viewerPages: [
      {
        label: 'Essay 01',
        heading: 'Convenience is not neutral.',
        body:
          'Interfaces often hide their politics inside friction. The fastest path is usually the one the system prefers, not necessarily the one the person would choose under clear conditions.',
      },
      {
        label: 'Essay 02',
        heading: 'Ethics becomes visible through defaults.',
        body:
          'A product reveals its values when a user does nothing. Defaults decide who carries effort, who receives access, and which outcomes are treated as standard.',
      },
      {
        label: 'Essay 03',
        heading: 'Transparency must survive stress.',
        body:
          'Clear language in a polished onboarding flow is easy. The harder test is whether clarity remains intact during failure states, billing changes, and irreversible decisions.',
      },
    ],
  },
  {
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
    badge: 'Collected Writings',
    abstract:
      'Traces how minimal form can create either calm or ambiguity depending on the precision of what remains.',
    notes: ['Editorial reduction', 'Signal density', 'Quiet interaction design'],
    viewerPages: [
      {
        label: 'Note 01',
        heading: 'Minimalism is selective emphasis.',
        body:
          'Removing elements does not automatically create clarity. It only sharpens what remains, which means weak structure becomes more obvious, not less.',
      },
      {
        label: 'Note 02',
        heading: 'Silence requires framing.',
        body:
          'A sparse interface feels intentional when the surviving elements establish hierarchy and pace. Without that framing, absence reads as omission rather than discipline.',
      },
      {
        label: 'Note 03',
        heading: 'Restraint is a service to attention.',
        body:
          'The best minimal systems reduce interpretive overhead. They do not merely look clean; they let the user spend attention on meaning instead of navigation.',
      },
    ],
  },
]

function App() {
  const shelfRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerPage, setViewerPage] = useState(0)

  const selectedBook = shelfItems[selectedIndex]

  useEffect(() => {
    setViewerPage(0)
  }, [selectedIndex])

  useEffect(() => {
    if (!viewerOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setViewerOpen(false)
      }

      if (event.key === 'ArrowRight') {
        setViewerPage((current) =>
          Math.min(current + 1, selectedBook.viewerPages.length - 1),
        )
      }

      if (event.key === 'ArrowLeft') {
        setViewerPage((current) => Math.max(current - 1, 0))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [viewerOpen, selectedBook.viewerPages.length])

  useEffect(() => {
    document.body.style.overflow = viewerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [viewerOpen])

  const scrollShelf = (direction: 'left' | 'right') => {
    const shelf = shelfRef.current
    if (!shelf) return

    const cardWidth = 320
    const delta = direction === 'left' ? -cardWidth : cardWidth
    shelf.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const selectBook = (index: number, openViewer = false) => {
    setSelectedIndex(index)
    if (openViewer) {
      setViewerOpen(true)
    }
  }

  const moveSelection = (direction: 'previous' | 'next') => {
    setSelectedIndex((current) =>
      direction === 'previous'
        ? (current - 1 + shelfItems.length) % shelfItems.length
        : (current + 1) % shelfItems.length,
    )
  }

  const renderBookCover = (item: ShelfItem) => (
    <div className={`book-cover ${item.coverClass}`}>
      {item.coverImage ? <img src={item.coverImage} alt="" aria-hidden="true" /> : null}

      {item.coverClass === 'cover-light' ? (
        <div className="cover-content cover-centered">
          <div className="cover-rule" />
          <p className="cover-title">{item.description}</p>
          <p className="cover-meta">{item.meta}</p>
        </div>
      ) : null}

      {item.coverClass === 'cover-dark' ? (
        <div className="cover-content cover-centered">
          <span className="material-symbols-outlined cover-icon">{item.icon}</span>
          <p className="cover-title">{item.description}</p>
          <p className="cover-meta">{item.meta}</p>
        </div>
      ) : null}

      {item.coverClass === 'cover-minimal' ? (
        <div className="cover-content cover-minimal-layout">
          <div className="cover-minimal-head">
            <span className="cover-orbit" />
            <span className="cover-code">{item.meta}</span>
          </div>
          <div>
            <p className="cover-title large">{item.description}</p>
            <p className="cover-tag">{item.tag}</p>
          </div>
        </div>
      ) : null}

      {item.coverClass === 'cover-accent' ? (
        <div className="cover-content cover-centered">
          <p className="cover-title accent">{item.description}</p>
          <div className="cover-divider" />
          <p className="cover-meta">{item.meta}</p>
        </div>
      ) : null}

      {item.coverClass === 'cover-quote' ? (
        <div className="cover-content cover-quote-layout">
          <span className="material-symbols-outlined cover-quote-icon">{item.icon}</span>
          <div>
            <p className="cover-title">{item.description}</p>
            <p className="cover-meta">{item.meta}</p>
          </div>
        </div>
      ) : null}
    </div>
  )

  return (
    <div className="page-shell">
      <main className="page-main">
        <section className="hero">
          <h1>
            Samuel<span>.</span>
          </h1>
          <p>
            Digital Architect &amp; Curator of Ideas. Exploring the intersection
            of structural logic and interface ethics.
          </p>
        </section>

        <section className="shelf-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Collection 01</span>
              <h2>The Library Shelf</h2>
            </div>

            <div className="shelf-controls" aria-label="Shelf navigation">
              <button type="button" onClick={() => scrollShelf('left')} aria-label="Scroll left">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button
                type="button"
                onClick={() => scrollShelf('right')}
                aria-label="Scroll right"
                className="is-active"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="shelf-track" ref={shelfRef}>
            {shelfItems.map((item, index) => (
              <article
                className={`shelf-card${index === selectedIndex ? ' is-selected' : ''}`}
                key={item.title}
              >
                <button
                  type="button"
                  className="shelf-hit"
                  onClick={() => selectBook(index)}
                  aria-pressed={index === selectedIndex}
                >
                  {renderBookCover(item)}

                  <div className="card-copy">
                    <p>{item.title}</p>
                    <span>{item.subtitle}</span>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="feature-panel">
          <div className="feature-cover-wrap">
            <div className="feature-cover">{renderBookCover(selectedBook)}</div>
            <button
              type="button"
              className="viewer-launch"
              onClick={() => setViewerOpen(true)}
            >
              <span className="material-symbols-outlined">menu_book</span>
              Open viewer
            </button>
          </div>

          <div className="feature-copy">
            <div className="feature-intro">
              <span>{selectedBook.badge}</span>
              <h3>{selectedBook.title}</h3>
              <p>{selectedBook.summary}</p>
            </div>

            <div className="feature-metadata">
              <div>
                <label>Published</label>
                <p>{selectedBook.published}</p>
              </div>
              <div>
                <label>Format</label>
                <p>{selectedBook.format}</p>
              </div>
              <div>
                <label>Pages</label>
                <p>{selectedBook.pages}</p>
              </div>
              <div>
                <label>Status</label>
                <p className="status-row">
                  <span className="status-dot" />
                  {selectedBook.status}
                </p>
              </div>
            </div>

            <div className="feature-abstract">
              <label>Abstract</label>
              <p>{selectedBook.abstract}</p>
            </div>

            <div className="feature-notes">
              {selectedBook.notes.map((note) => (
                <span key={note}>{note}</span>
              ))}
            </div>

            <div className="feature-actions">
              <button type="button" className="primary-button" onClick={() => setViewerOpen(true)}>
                Read Volume
              </button>
              <button type="button" className="secondary-button" onClick={() => moveSelection('next')}>
                Next Book
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2024 Samuel Design. All rights reserved.</p>

        <nav aria-label="Footer links">
          <a href="#" aria-label="Website link">
            <span className="material-symbols-outlined">link</span>
          </a>
          <a href="#" aria-label="Share">
            <span className="material-symbols-outlined">share</span>
          </a>
          <a href="#" aria-label="Email">
            <span className="material-symbols-outlined">mail</span>
          </a>
        </nav>
      </footer>

      {viewerOpen ? (
        <div
          className="viewer-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setViewerOpen(false)
            }
          }}
        >
          <section
            className="viewer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="viewer-title"
          >
            <div className="viewer-toolbar">
              <div>
                <span className="viewer-kicker">{selectedBook.badge}</span>
                <h4 id="viewer-title">{selectedBook.title}</h4>
              </div>

              <div className="viewer-toolbar-actions">
                <button type="button" className="viewer-icon-button" onClick={() => moveSelection('previous')}>
                  <span className="material-symbols-outlined">navigate_before</span>
                </button>
                <button type="button" className="viewer-icon-button" onClick={() => moveSelection('next')}>
                  <span className="material-symbols-outlined">navigate_next</span>
                </button>
                <button type="button" className="viewer-icon-button" onClick={() => setViewerOpen(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="viewer-layout">
              <aside className="viewer-sidebar">
                <div className="viewer-sidebar-cover">{renderBookCover(selectedBook)}</div>
                <p>{selectedBook.abstract}</p>
                <div className="viewer-sidebar-tags">
                  {selectedBook.notes.map((note) => (
                    <span key={note}>{note}</span>
                  ))}
                </div>
              </aside>

              <div className="viewer-reader">
                <div className="viewer-page">
                  <span>{selectedBook.viewerPages[viewerPage].label}</span>
                  <h5>{selectedBook.viewerPages[viewerPage].heading}</h5>
                  <p>{selectedBook.viewerPages[viewerPage].body}</p>
                </div>

                <div className="viewer-pagination">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setViewerPage((current) => Math.max(current - 1, 0))}
                    disabled={viewerPage === 0}
                  >
                    Previous page
                  </button>
                  <div className="viewer-dots" aria-label="Viewer pages">
                    {selectedBook.viewerPages.map((page, index) => (
                      <button
                        type="button"
                        key={page.label}
                        className={`viewer-dot${index === viewerPage ? ' is-active' : ''}`}
                        onClick={() => setViewerPage(index)}
                        aria-label={`Go to ${page.label}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      setViewerPage((current) =>
                        Math.min(current + 1, selectedBook.viewerPages.length - 1),
                      )
                    }
                    disabled={viewerPage === selectedBook.viewerPages.length - 1}
                  >
                    Next page
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

export default App
