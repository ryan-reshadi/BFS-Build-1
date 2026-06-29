import { TagList } from "./TagList.jsx";

export function QuestionBlock({
  question,
  index,
  chosen,
  scored,
  isBookmarked,
  onAnswer,
  onBookmark,
  onStudyLink,
  showExplanation = true,
  showBookmark = true,
}) {
  const answered = typeof chosen !== "undefined";

  return (
    <div className="question-block">
      {showBookmark && (
        <button
          type="button"
          className="bookmark-btn"
          title="Bookmark question"
          onClick={() => onBookmark?.(question.id)}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
        >
          {isBookmarked ? "★" : "＋"}
        </button>
      )}

      <div className="meta-row">
        {index != null && <span className="badge">#{index + 1}</span>}
        <span className="badge">{question.category}</span>
        <span className={`badge diff-${question.difficulty}`}>{question.difficulty}</span>
      </div>

      {question.scenario && <div className="scenario">{question.scenario}</div>}

      <h3>{question.question}</h3>

      {question.choices?.map((choice, choiceIndex) => {
        let className = "choice";
        if (!scored && answered && choiceIndex === chosen) className += " selected";
        if (scored && choiceIndex === question.answer) className += " correct";
        if (scored && answered && choiceIndex === chosen && choiceIndex !== question.answer) className += " wrong";

        return (
          <button
            key={choiceIndex}
            type="button"
            className={className}
            disabled={scored}
            onClick={() => onAnswer?.(question.id, choiceIndex)}
          >
            {choice}
          </button>
        );
      })}

      {scored && showExplanation && (
        <div className="explanation">
          <h4>{chosen === question.answer ? "Correct" : "Answer"}</h4>
          <p>{question.explanation}</p>
          {question.whyEachWrong?.[String(chosen)] && (
            <p><strong>Why yours is off:</strong> {question.whyEachWrong[String(chosen)]}</p>
          )}
          {question.commonTrap && (
            <p><strong>Trap:</strong> {question.commonTrap}</p>
          )}
          {question.studyGuideReference && (
            <button
              type="button"
              className="btn"
              onClick={() => onStudyLink?.(question.studyGuideReference)}
            >
              Open study section
            </button>
          )}
        </div>
      )}

      <TagList tags={question.tags} />
    </div>
  );
}
