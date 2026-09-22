import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import './App.css'
import { shelfItems, shelfItemsBySlug } from './library'

const readingOrder = [
  'private-equity', 'zero-to-one', 'sapiens', 'thinking-fast-and-slow',
  'poor-charlies-almanack', 'the-three-body-problem',
  'the-visual-mba', 'you-and-your-research', 'optimism-shapes-reality',
  'noise', 'the-richest-man-in-babylon', 'the-48-laws-of-power', 'the-art-of-showing-up',
]

function BookCover({ item }: { item: (typeof shelfItems)[number] }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`library-cover ${item.coverClass}`} aria-hidden="true">
      {item.coverImage && !failed ? (
        <img src={item.coverImage} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <>
          <span className="book-category">{item.description}</span>
          <div className="book-title">{item.title}</div>
          <span className="book-author">{item.subtitle}</span>
        </>
      )}
    </div>
  )
}

function HomePage() {
  useEffect(() => {
    document.title = 'Samuel Swandi'
  }, [])

  return (
    <main className="home-layout">
      <header className="profile">
        <div className="profile-main">
        <h1>samuel swandi</h1>
        <p>product engineer</p>
        <nav className="profile-links" aria-label="Social links">
          <a href="https://linkedin.com/in/samuelswandi" target="_blank" rel="noreferrer">linkedin <span aria-hidden="true">↗</span></a>
          <a href="https://github.com/samuelswandi" target="_blank" rel="noreferrer">github <span aria-hidden="true">↗</span></a>
          <a href="https://instagram.com/samuelswandi" target="_blank" rel="noreferrer">instagram <span aria-hidden="true">↗</span></a>
        </nav>
        </div>
        <p className="profile-note">A calmer internet<br />for a more curious you.</p>
      </header>

      <section className="library" aria-labelledby="library-heading">
        <div className="library-topline">
          <span>the reading index</span>
          <span>books build a quieter mind.</span>
        </div>
        <header className="library-heading">
          <h2 id="library-heading">library</h2>
          <p>same books<br />a brighter you</p>
        </header>
        <div className="reading-index">
          {readingOrder.map((slug, index) => {
            const item = shelfItemsBySlug.get(slug)!
            return (
              <Link className="index-row" key={slug} to={`/sources/${slug}`} aria-label={`Open ${item.title}`}>
                <span className="index-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <span className="index-author">{item.subtitle}</span>
                <span className="index-arrow" aria-hidden="true">→</span>
                <div className="index-preview"><BookCover item={item} /></div>
              </Link>
            )
          })}
        </div>
        <p className="library-endnote">read more. think deeper.</p>
      </section>
    </main>
  )
}

function SourcePage() {
  const { slug } = useParams()
  const item = slug ? shelfItemsBySlug.get(slug) : undefined

  useEffect(() => {
    document.title = item ? `${item.title} | Samuel Swandi` : 'Samuel Swandi'
  }, [item])

  if (!item) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="reading-page">
      <Link className="back-link" to="/">← Back to library</Link>
      <article className="markdown-body">
        <h1>{item.title}</h1>
        <ReactMarkdown
          components={{
            a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
          }}
        >
          {item.markdown}
        </ReactMarkdown>
      </article>
    </main>
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
