import { TagList } from "../components/TagList.jsx";
import { PageHeader } from "../components/PageHeader.jsx";

export function ReviewView({ activeSetName, questions, progress }) {
  const items = progress.incorrect
    .map((id) => questions.find((q) => q.id === id))
    .filter(Boolean);

  return (
    <section className="view active">
      <PageHeader
        activeSetName={activeSetName}
        title="Review Incorrect Questions"
        lead="Questions you missed on practice tests in this study set."
      />

      {items.length === 0 ? (
        <div className="panel">No missed questions yet.</div>
      ) : (
        items.map((question) => (
          <div key={question.id} className="question-block">
            <div className="meta-row">
              <span className="badge">#{question.id}</span>
              <span className="badge">{question.category}</span>
            </div>
            <h3>{question.question}</h3>
            <p>{question.explanation}</p>
            <TagList tags={question.tags} />
          </div>
        ))
      )}
    </section>
  );
}
