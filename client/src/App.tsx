import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import ChatPage from './pages/ChatPage.tsx';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
};

export default App;