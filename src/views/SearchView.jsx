import { useState } from "react";
import { TagList } from "../components/TagList.jsx";
import { PageHeader } from "../components/PageHeader.jsx";

export function SearchView({ activeSetName, questions, progress, saveProgress, onStudyLink }) {
  const [term, setTerm] = useState("");

  const results = term.trim()
    ? questions.filter((q) => {
        const haystack = [
          q.question,
          q.scenario,
          q.explanation,
          q.category,
          q.subcategory,
          ...(q.tags || []),
          ...(q.concepts || []),
        ].join(" ").toLowerCase();
        return haystack.includes(term.trim().toLowerCase());
      }).slice(0, 25)
    : [];

  function quickBookmark(questionId) {
    saveProgress((prev) => {
      const isBookmarked = prev.bookmarks.includes(questionId);
      const bookmarks = isBookmarked
        ? prev.bookmarks.filter((id) => id !== questionId)
        : [...prev.bookmarks, questionId];
      return { ...prev, bookmarks };
    });
  }

  return (
    <section className="view active">
      <PageHeader activeSetName={activeSetName} title="Search" />

      <div className="search-box">
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search questions, tags, concepts..."
          aria-label="Search questions"
        />
      </div>

      <div className="search-results">
        {!term.trim() && (
          <p className="muted">Type to search across questions, tags, and concepts.</p>
        )}

        {term.trim() && !results.length && (
          <div className="panel">No matches.</div>
        )}

        {results.map((question) => (
          <div key={question.id} className="question-block">
            <div className="meta-row">
              <span className="badge">#{question.id}</span>
              <span className="badge">{question.category}</span>
            </div>
            <h3>{question.question}</h3>
            <p>{question.explanation}</p>
            <div className="inline-actions">
              {question.studyGuideReference && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => onStudyLink(question.studyGuideReference)}
                >
                  Open study section
                </button>
              )}
              <button
                type="button"
                className="btn"
                onClick={() => quickBookmark(question.id)}
              >
                {progress.bookmarks.includes(question.id) ? "Bookmarked" : "Bookmark"}
              </button>
            </div>
            <TagList tags={question.tags} />
          </div>
        ))}
      </div>
    </section>
  );
}
