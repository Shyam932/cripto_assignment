// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OAuthSuccess from "./pages/OAuthSuccess";
import CryptoDetails from "./pages/CryptoDetails";
import TopGainersLosers from "./pages/TopGainersLosers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard  />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/crypto/:id" element={<CryptoDetails />} />
        <Route path="/top-movers" element={<TopGainersLosers />} />

      </Routes>
    </Router>
  );
}

export default App;
