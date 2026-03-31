import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import ChatBot from './components/ChatBot';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/transaction/:id" element={<DetailsPage />} />
      </Routes>
      <ChatBot />
    </BrowserRouter>
  );
}
