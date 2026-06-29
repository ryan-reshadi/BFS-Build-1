import { useState } from "react";
import { QuestionBlock } from "../components/QuestionBlock.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { shuffle, unique } from "../utils/helpers.js";

export function PracticeView({ activeSetName, questions, progress, saveProgress, onStudyLink }) {
  const categories = unique(questions.map((q) => q.category));

  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [count, setCount] = useState("10");
  const [quiz, setQuiz] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScored, setQuizScored] = useState(false);
  const [inTest, setInTest] = useState(false);

  function startTest() {
    let pool = questions.filter((q) =>
      (category === "all" || q.category === category) &&
      (difficulty === "all" || q.difficulty === difficulty)
    );
    pool = shuffle(pool);
    const selected = count === "all" ? pool : pool.slice(0, Number(count));
    setQuiz(selected);
    setQuizAnswers({});
    setQuizScored(false);
    setInTest(true);
  }

  function answerQuestion(questionId, choiceIndex) {
    if (quizScored) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }));
  }

  function toggleBookmark(questionId) {
    saveProgress((prev) => {
      const bookmarks = prev.bookmarks.includes(questionId)
        ? prev.bookmarks.filter((id) => id !== questionId)
        : [...prev.bookmarks, questionId];
      return { ...prev, bookmarks };
    });
  }

  function scoreTest() {
    if (quizScored) return;
    setQuizScored(true);

    saveProgress((prev) => {
      const next = {
        ...prev,
        testsTaken: prev.testsTaken + 1,
        totalAnswered: prev.totalAnswered,
        totalCorrect: prev.totalCorrect,
        answered: { ...prev.answered },
        incorrect: [...prev.incorrect],
      };

      quiz.forEach((question) => {
        if (!(question.id in quizAnswers)) return;
        const isCorrect = quizAnswers[question.id] === question.answer;
        next.totalAnswered += 1;
        next.answered[question.id] = isCorrect;

        if (isCorrect) {
          next.totalCorrect += 1;
          next.incorrect = next.incorrect.filter((id) => id !== question.id);
        } else if (!next.incorrect.includes(question.id)) {
          next.incorrect.push(question.id);
        }
      });

      return next;
    });
  }

  function newTest() {
    setInTest(false);
    setQuiz([]);
    setQuizAnswers({});
    setQuizScored(false);
  }

  const answeredCount = Object.keys(quizAnswers).length;
  const correctCount = quiz.filter((q) => quizAnswers[q.id] === q.answer).length;

  return (
    <section className="view active">
      <PageHeader activeSetName={activeSetName} title="Practice Tests" />

      {!inTest && (
        <div className="panel setup-panel">
          <h3>Build Your Test</h3>
          <div className="form-grid">
            <label>
              Category
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Difficulty
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="all">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
            <label>
              Number of Questions
              <select value={count} onChange={(e) => setCount(e.target.value)}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="all">All</option>
              </select>
            </label>
          </div>
          <button type="button" className="btn primary" onClick={startTest}>
            Start Test
          </button>
        </div>
      )}

      {inTest && (
        <div className="quiz-area">
          {!quiz.length ? (
            <>
              <div className="panel">No questions matched those filters.</div>
              <button type="button" className="btn" onClick={newTest}>Back to setup</button>
            </>
          ) : (
            <>
              {quizScored && (
                <div className="result-banner">
                  {correctCount} / {quiz.length} correct ({answeredCount} answered)
                </div>
              )}

              {quiz.map((question, index) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  index={index}
                  chosen={quizAnswers[question.id]}
                  scored={quizScored}
                  isBookmarked={progress.bookmarks.includes(question.id)}
                  onAnswer={answerQuestion}
                  onBookmark={toggleBookmark}
                  onStudyLink={onStudyLink}
                />
              ))}

              <div className="panel action-panel">
                <button type="button" className="btn primary" onClick={scoreTest} disabled={quizScored}>
                  Score Test
                </button>
                <button type="button" className="btn" onClick={newTest}>
                  New Test
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
