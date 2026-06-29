import { useEffect, useState } from "react";
import { getStudyGuideByCategory } from "../utils/studyGuide.js";
import { PageHeader } from "../components/PageHeader.jsx";

export function StudyView({ activeSetName, studyGuide, initialSectionId, onSectionConsumed }) {
  const grouped = getStudyGuideByCategory(studyGuide);
  const [activeId, setActiveId] = useState(studyGuide[0]?.id ?? "");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (initialSectionId) {
      const exists = studyGuide.some((s) => s.id === initialSectionId);
      if (exists) {
        setActiveId(initialSectionId);
        onSectionConsumed?.();
      }
    }
  }, [initialSectionId, studyGuide, onSectionConsumed]);

  useEffect(() => {
    if (!studyGuide.some((s) => s.id === activeId)) {
      setActiveId(studyGuide[0]?.id ?? "");
    }
  }, [studyGuide, activeId]);

  const section = studyGuide.find((s) => s.id === activeId);

  function selectSection(id) {
    setActiveId(id);
    setSidebarOpen(false);
  }

  return (
    <section className="view active">
      <PageHeader
        activeSetName={activeSetName}
        title="Study Guide"
        actions={
          <button
            type="button"
            className="btn sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? "Hide sections" : "Browse sections"}
          </button>
        }
      />

      {!studyGuide.length ? (
        <div className="panel">This study set has no study guide sections.</div>
      ) : (
        <div className="layout-split">
          <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="Study guide sections">
            {Object.keys(grouped).map((category) => (
              <div key={category} className="sidebar-group">
                <h4>{category}</h4>
                {grouped[category].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={activeId === item.id ? "active" : ""}
                    onClick={() => selectSection(item.id)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            ))}
          </aside>

          <article className="content-pane study-content">
            {section ? (
              <div dangerouslySetInnerHTML={{ __html: section.html }} />
            ) : (
              <div className="panel">Select a section to begin studying.</div>
            )}
          </article>
        </div>
      )}
    </section>
  );
}
