import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//PAGES
import Home from "./pages/home";
import Test from "./pages/Test";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Cart from './pages/Cart'
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from "./components/ResetPassword"


//COMPONENTS
import Navbarr from "./components/Navbarr";
import Footer from "./components/Footer";

import "../src/App.css";

function App() {
  return (
    <>
      <div className="h">
        <Router>
          <Navbarr />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />|
            <Route path="/verifyEmail" element={<Home />} />
            <Route path="forgotPassword" element={<ForgotPassword />} />
            <Route path="resetPassword" element={<ResetPassword />} />
            <Route path="test" element={<Test />} />
            <Route path="cart" element={<Cart />} />


          </Routes>
        </Router>
      </div>
      <Footer />
    </>
  );
}

export default App;
