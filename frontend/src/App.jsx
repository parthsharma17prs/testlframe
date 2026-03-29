import {Routes, Route, Navigate} from 'react-router-dom';
import InterviewRoom from './pages/InterviewRoom';
import QuizAttempt from './pages/QuizAttempt';
import QuizSummary from './pages/QuizSummary';
import TestHub from './pages/TestHub';

function App()
{
  return (
    <Routes>
      <Route path="/tests" element={<TestHub />} />
      <Route path="/interview/:interviewId" element={<InterviewRoom />} />
      <Route path="/quiz/:quizId/attempt" element={<QuizAttempt />} />
      <Route path="/quiz/:quizId/summary/:attemptId" element={<QuizSummary />} />
      <Route path="*" element={<Navigate to="/tests" replace />} />
    </Routes>
  );
}

export default App;
