import './App.css'

function App() {
  return (
    <div className="library">
      <header className="header">
        <h1>Sam's Library</h1>
        <p className="subtitle">readings · thoughts · videos</p>
      </header>

      <main className="content">
        <section className="section">
          <h2>📚 Readings</h2>
          <p className="placeholder">Your favorite articles and books will live here.</p>
        </section>

        <section className="section">
          <h2>💭 Thoughts</h2>
          <p className="placeholder">A space for your ideas and reflections.</p>
        </section>

        <section className="section">
          <h2>🎬 Videos</h2>
          <p className="placeholder">Videos that inspired you, collected in one place.</p>
        </section>
      </main>

      <footer className="footer">
        <p>Built with curiosity</p>
      </footer>
    </div>
  )
}

export default App
