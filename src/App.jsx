import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import HomePage from "./Pages/Home/HomePage.jsx";
import UploadPage from "./Pages/Upload/UploadPage.jsx";
import ContactPage from "./Pages/Contact/ContactPage.jsx";
import NavBar from './Components/NavBar.jsx';

function App() {
  return (
    <>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
