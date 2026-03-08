import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import './App.css'
import { shelfItems, shelfItemsBySlug, type ShelfItem } from './library'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>Created by Samuel Swandi</p>
      <nav aria-label="Footer links">
        <a href="https://linkedin.com/in/samuelswandi" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="https://github.com/samuelswandi" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </footer>
  )
}

function renderShelfCover(item: ShelfItem) {
  return (
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
}

function HomePage() {
  const shelfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Lume'
  }, [])

  const scrollShelf = (direction: 'left' | 'right') => {
    const shelf = shelfRef.current
    if (!shelf) return

    const cardWidth = 280
    const delta = direction === 'left' ? -cardWidth : cardWidth
    shelf.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <div className="page-shell page-shell-mobile">
      <main className="page-main page-main-mobile">
        <section className="hero">
          <h1>Lume</h1>
          <p>
            A collection of enlightening sources I&apos;ve encountered in my
            life, from books and posts to readings that shaped how I think.
          </p>
        </section>

        <section className="shelf-section">
          <div className="section-heading">
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
            {shelfItems.map((item) => (
              <article className="shelf-card" key={item.slug}>
                <Link
                  className="shelf-hit"
                  to={`/sources/${item.slug}`}
                  aria-label={`Open ${item.title}`}
                >
                  {renderShelfCover(item)}

                  <div className="card-copy">
                    <p>{item.title}</p>
                    <span>{item.subtitle}</span>
                    <strong>Open source page</strong>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function SourcePage() {
  const { slug } = useParams()
  const item = slug ? shelfItemsBySlug.get(slug) : undefined

  useEffect(() => {
    document.title = item ? `${item.title} | Lume` : 'Lume'
  }, [item])

  if (!item) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="page-shell">
      <main className="page-main page-main-full detail-main">
        <Link className="back-link" to="/">
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
          Back to shelf
        </Link>

        <article className="detail-page">
          <header className="detail-hero">
            <div className="detail-cover">{renderShelfCover(item)}</div>

            <div className="detail-copy">
              <span className="detail-kicker">{item.description}</span>
              <h1>{item.title}</h1>
              <p className="detail-summary">{item.summary}</p>
              <p className="detail-abstract">{item.abstract}</p>

              <dl className="detail-metadata">
                <div>
                  <dt>Published</dt>
                  <dd>{item.published}</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>{item.format}</dd>
                </div>
                <div>
                  <dt>Length</dt>
                  <dd>{item.pages}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{item.status}</dd>
                </div>
              </dl>

              <div className="detail-notes" aria-label="Key themes">
                {item.notes.map((note) => (
                  <span key={note}>{note}</span>
                ))}
              </div>
            </div>
          </header>

          <section className="markdown-card">
            <ReactMarkdown
              components={{
                a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
              }}
            >
              {item.markdown}
            </ReactMarkdown>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sources/:slug" element={<SourcePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
