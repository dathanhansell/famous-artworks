import ButtonAppBar from './components/MenuBar';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ModifyPage from "./page/ModifyPage";
import HomePage from "./page/Home";
import SearchPage from "./page/SearchPage";  
function App() {
  return (
    <Router>
      <ButtonAppBar/>
      <div className="app-content">
      <Routes>
        <Route path="/" element={ <HomePage /> } />
        <Route path="/db" element={ <ModifyPage /> } />
        <Route path="/search" element={ <SearchPage /> } />
      </Routes>
      </div>
    </Router>
    
  );
}

export default App;

