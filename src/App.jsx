import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Storage from "./pages/storage";
import Card from "./pages/card";
import View from "./pages/view";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Home />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/card/:id" element={<Card />} />
        <Route path="/view/:id" element={<View />} />
      </Routes>
    </Router>
  );
}

export default App;
