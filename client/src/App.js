import RegisterForm from "./components/RegisterForm";
import ButtonAppBar from './components/MenuBar';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TestPage from "./page/testPage";
import LoginForm from "./components/LoginForm";
import HomePage from "./page/Home";
import ArtworksPage from "./page/artworksOnArtist";
import MuseumsPage from "./page/artistsOnMuseums";  
function App() {
  return (
    <Router>
      <ButtonAppBar/>
      <div className="app-content">
      <Routes>
        <Route path="/" element={ <HomePage /> } />
        <Route path="/test" element={ <TestPage /> } />
        <Route path="/artonartist" element={ <ArtworksPage /> } />
        <Route path="/login" element={ <LoginForm /> } />
        <Route path="/register" element={ <RegisterForm /> } />
        <Route path="/artonmuseum" element={ <MuseumsPage /> } />
      </Routes>
      </div>
    </Router>
    
  );
}

export default App;

