import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Uploader from './components/Uploader';
import DownloadPage from './components/DownloadPage';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Uploader />} />
        <Route path="/view/:shortId" element={<DownloadPage />} />
      </Routes>
    </Router>
  );
}

export default App;