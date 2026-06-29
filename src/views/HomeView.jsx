import { StatCard } from "../components/StatCard.jsx";
import { PageHeader } from "../components/PageHeader.jsx";

const QUICK_LINKS = [
  { id: "practice", icon: "📝", title: "Practice Tests", desc: "Scenario-based national-level questions." },
  { id: "study", icon: "📚", title: "Study Guide", desc: "Deep dives into every domain." },
  { id: "flashcards", icon: "🃏", title: "Flashcards", desc: "Tagged cards with spaced review." },
  { id: "formulas", icon: "🧮", title: "Formula Sheet", desc: "Every banking ratio you must know." },
];

export function HomeView({ activeSetName, questionsCount, studyCount, accuracy, bookmarkCount, onNavigate }) {
  return (
    <section className="view active">
      <PageHeader
        activeSetName={activeSetName}
        title="National Leadership Conference Prep"
        lead="An offline, expandable platform engineered for finalists."
      />

      <div className="card-grid">
        <StatCard label="Questions" value={questionsCount} />
        <StatCard label="Study Sections" value={studyCount} />
        <StatCard label="Accuracy" value={`${accuracy}%`} />
        <StatCard label="Bookmarks" value={bookmarkCount} />
      </div>

      <div className="card-grid">
        {QUICK_LINKS.map((link) => (
          <button
            key={link.id}
            type="button"
            className="card clickable"
            onClick={() => onNavigate(link.id)}
          >
            <h3>{link.icon} {link.title}</h3>
            <p>{link.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
