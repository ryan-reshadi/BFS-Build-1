export function ActiveSetBar({ activeSet, onManageSets }) {
  return (
    <div className="active-set-bar" role="status" aria-live="polite">
      <div className="active-set-info">
        <span className="active-set-label">Current study set</span>
        <strong className="active-set-name">{activeSet.name}</strong>
        {activeSet.isBuiltIn && <span className="badge built-in-badge">Built-in</span>}
      </div>
      <div className="active-set-meta muted">
        {activeSet.questions.length} questions · {activeSet.studyGuide.length} sections · {activeSet.flashcards.length} cards
      </div>
      <button type="button" className="btn btn-sm" onClick={onManageSets}>
        Manage sets
      </button>
    </div>
  );
}
