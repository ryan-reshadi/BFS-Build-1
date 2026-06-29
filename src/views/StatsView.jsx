import { StatCard } from "../components/StatCard.jsx";
import { PageHeader } from "../components/PageHeader.jsx";

export function StatsView({ activeSetName, progress, resetProgress }) {
  const answered = progress.totalAnswered;
  const accuracy = answered
    ? Math.round((progress.totalCorrect / answered) * 100)
    : 0;
  const formulaRatings = Object.values(progress.formulaKnowledge).map(Number);
  const formulaAverage = formulaRatings.length
    ? (formulaRatings.reduce((sum, r) => sum + r, 0) / formulaRatings.length).toFixed(1)
    : "0.0";

  function handleReset() {
    if (!confirm(`Reset all progress for "${activeSetName}"?`)) return;
    resetProgress();
  }

  return (
    <section className="view active">
      <PageHeader
        activeSetName={activeSetName}
        title="Statistics"
        lead="Metrics for the currently selected study set."
      />

      <div className="card-grid">
        <StatCard label="Tests Taken" value={progress.testsTaken} />
        <StatCard label="Answers Submitted" value={answered} />
        <StatCard label="Correct Answers" value={progress.totalCorrect} />
        <StatCard label="Lifetime Accuracy" value={`${accuracy}%`} />
        <StatCard label="Known Flashcards" value={progress.flashKnown.length} />
        <StatCard label="Flashcards To Review" value={progress.flashReview.length} />
        <StatCard label="Avg Formula Rating" value={`${formulaAverage} / 10`} />
      </div>

      <button type="button" className="btn bad reset-btn" onClick={handleReset}>
        Reset Progress for This Set
      </button>
    </section>
  );
}
