import { Login } from './components/Login'
import { Tasks } from './components/Tasks'
import 'bootstrap/dist/css/bootstrap.min.css';

import { LoginProvider } from './components/LoginProvider';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <LoginProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/" element={<Navigate replace to="/app/login" />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </Router>
    </LoginProvider>
  );
};

export default App
