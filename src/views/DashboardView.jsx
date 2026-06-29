import { unique } from "../utils/helpers.js";
import { PageHeader } from "../components/PageHeader.jsx";

export function DashboardView({ activeSetName, questions, progress }) {
  const categories = unique(questions.map((q) => q.category));

  return (
    <section className="view active">
      <PageHeader
        activeSetName={activeSetName}
        title="Progress Dashboard"
        lead="Track how many questions you've touched in each category."
      />

      {!categories.length ? (
        <div className="panel">This study set has no questions yet.</div>
      ) : (
        <div className="card-grid">
          {categories.map((category) => {
            const categoryQuestions = questions.filter((q) => q.category === category);
            const answered = categoryQuestions.filter(
              (q) => q.id in progress.answered
            ).length;
            const percent = categoryQuestions.length
              ? Math.round((answered / categoryQuestions.length) * 100)
              : 0;

            return (
              <div key={category} className="card">
                <h3>{category}</h3>
                <div className="bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <p>{answered} / {categoryQuestions.length} questions touched</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
