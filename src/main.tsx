import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main>
      <header><span>TWO / FIVE</span><span>HOTEL COMPANY</span></header>
      <section aria-labelledby="title">
        <p className="eyebrow">2nd Battalion · 5th Marines</p>
        <h1 id="title">A history told through<br />place, time, and evidence.</h1>
        <p className="intro">Following Hotel Company’s story through original records,
          connected events, and the places where they happened.</p>
        <p className="status">In development · Initial focus: 1965–1966</p>
      </section>
      <footer>
        <p>Archival research begins with the originals.</p>
        <a href="https://www.vietnam.ttu.edu/virtualarchive/">Explore Texas Tech’s Virtual Vietnam Archive ↗</a>
        <p className="rights">© 2026 Brent Tyler. Original project code: all rights reserved.
          Archival materials retain their applicable source rights.</p>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
