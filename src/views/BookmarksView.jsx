import { TagList } from "../components/TagList.jsx";
import { PageHeader } from "../components/PageHeader.jsx";

export function BookmarksView({ activeSetName, questions, progress }) {
  const items = progress.bookmarks
    .map((id) => questions.find((q) => q.id === id))
    .filter(Boolean);

  return (
    <section className="view active">
      <PageHeader
        activeSetName={activeSetName}
        title="Bookmarks"
        lead="Questions you've saved for later review in this study set."
      />

      {items.length === 0 ? (
        <div className="panel">No bookmarks yet.</div>
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
