import { unique } from "../utils/helpers.js";
import { PageHeader } from "../components/PageHeader.jsx";

export function FormulasView({ activeSetName, questions, progress, saveProgress }) {
  const formulas = unique(questions.map((q) => q.formulaUsed).filter(Boolean));

  function updateRating(formula, rating) {
    saveProgress((prev) => ({
      ...prev,
      formulaKnowledge: { ...prev.formulaKnowledge, [formula]: rating },
    }));
  }

  if (!formulas.length) {
    return (
      <section className="view active">
        <PageHeader activeSetName={activeSetName} title="Formula Sheet" />
        <div className="panel">No formulas found in this study set.</div>
      </section>
    );
  }

  return (
    <section className="view active">
      <PageHeader
        activeSetName={activeSetName}
        title="Formula Sheet"
        lead="Rate your confidence for each formula (0–10)."
      />

      <div className="card-grid">
        {formulas.map((formula) => {
          const rating = Number(progress.formulaKnowledge[formula] || 0);
          return (
            <div key={formula} className="card formula-card">
              <h3>Formula</h3>
              <p className="formula">{formula}</p>
              <label className="formula-rating">
                <span>Knowledge rating</span>
                <strong>{rating} / 10</strong>
              </label>
              <input
                className="formula-slider"
                type="range"
                min="0"
                max="10"
                step="1"
                value={rating}
                onChange={(e) => updateRating(formula, Number(e.target.value))}
                aria-label={`Knowledge rating for ${formula}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
