import {useEffect, useMemo, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {getQuizzes} from '../services/api';

function TestHub()
{
  const navigate=useNavigate();
  const [searchParams]=useSearchParams();
  const [quizzes, setQuizzes]=useState([]);
  const [candidateName, setCandidateName]=useState(searchParams.get('name')||'Student');
  const [loading, setLoading]=useState(true);
  const [startError, setStartError]=useState('');
  const [selectedQuiz, setSelectedQuiz]=useState(null);

  useEffect(() =>
  {
    const loadQuizzes=async () =>
    {
      setLoading(true);
      try
      {
        const response=await getQuizzes();
        setQuizzes(response.data||[]);
        setStartError('');
      } catch (error)
      {
        setStartError(`Unable to load tests from server: ${error?.message||'unknown error'}`);
        setQuizzes([]);
      } finally
      {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  const startSecureTest=async () =>
  {
    const quiz=selectedQuiz;
    if (!quiz) return;

    try
    {
      setStartError('');

      // Prompt for camera permission before the test begins.
      const stream=await navigator.mediaDevices.getUserMedia({video: true, audio: false});
      stream.getTracks().forEach((track) => track.stop());

      if (!document.fullscreenElement)
      {
        await document.documentElement.requestFullscreen();
      }
    } catch (error)
    {
      setStartError(`Camera/fullscreen permission required: ${error?.message||'permission denied'}`);
      return;
    }

    setSelectedQuiz(null);
    navigate(`/quiz/${quiz.id}/attempt?name=${encodeURIComponent(candidateName||'Student')}`);
  };

  const subjectCount=useMemo(() => new Set(quizzes.map((item) => item.subject)).size, [quizzes]);

  return (
    <div className="quiz-shell">
      <header className="quiz-hub-header panel-card">
        <div>
          <h1>All Subject Tests</h1>
          <p>Select any subject below. Disclaimer and permissions are required before test starts.</p>
          <p className="security-notice">Tab switch or window blur will auto-submit the test with current score.</p>
        </div>
        <div className="candidate-card">
          <label htmlFor="candidate-name">Candidate Name</label>
          <input
            id="candidate-name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Enter your name"
          />
          <div className="hub-stats">Subjects: {subjectCount} · Tests: {quizzes.length}</div>
        </div>
      </header>

      {loading? <p>Loading available tests...</p>:null}
      {startError? <p className="danger-text">{startError}</p>:null}

      <section className="subject-grid">
        {quizzes.map((quiz) => (
          <article className="subject-card panel-card" key={quiz.id}>
            <div className="subject-tag">{quiz.subject}</div>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <div className="subject-meta">
              <span>{quiz.questionCount} questions</span>
              <span>{quiz.durationMinutes} mins</span>
            </div>
            <button className="btn-primary" onClick={() => setSelectedQuiz(quiz)}>Take Test</button>
          </article>
        ))}
      </section>

      {selectedQuiz? (
        <div className="take-test-modal-backdrop">
          <div className="take-test-modal panel-card">
            <h2>Test Disclaimer & Permissions</h2>
            <p><strong>{selectedQuiz.title}</strong></p>
            <ul>
              <li>Fullscreen mode is mandatory during the test.</li>
              <li>Camera permission is mandatory for proctoring.</li>
              <li>Tab switch, blur, or fullscreen exit will auto-submit test.</li>
            </ul>
            {startError? <p className="danger-text">{startError}</p>:null}
            <div className="modal-actions">
              <button onClick={() => setSelectedQuiz(null)}>Cancel</button>
              <button className="btn-primary" onClick={startSecureTest}>Allow & Start Test</button>
            </div>
          </div>
        </div>
      ):null}
    </div>
  );
}

export default TestHub;
