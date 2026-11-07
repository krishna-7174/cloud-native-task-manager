function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="brand-row">
          <span className="brand-mark">CN</span>
          <span className="eyebrow">PRODUCTIVITY DASHBOARD</span>
        </div>

        <h1>Cloud Native Task Manager</h1>

        <p>
          Keep your work organised, focused, and moving forward.
        </p>
      </div>

      <div className="header-glow" aria-hidden="true" />
    </header>
  );
}

export default Header;