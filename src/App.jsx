import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from "./Pages/Home/HomePage.jsx";
import UploadPage from "./Pages/Upload/UploadPage.jsx";
import PlayerPage from "./Pages/Player/PlayerPage.jsx";
import ContactPage from "./Pages/Contact/ContactPage.jsx";
import ErrorPage from './Pages/Error/ErrorPage.jsx';
import AuthPage from './Pages/Auth/AuthPage.jsx'; // Import AuthPage
import NavBar from './Components/NavBar.jsx';
import Footer from './Components/Footer.jsx';

function App() {
  return (
    <>
      <BrowserRouter   
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/player" element={<PlayerPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} /> {/* Add Auth route */}
          {/* Error Page */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
