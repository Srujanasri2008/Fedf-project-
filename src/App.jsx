// import React from "react";
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import About from "./components/About";
// import Services from "./components/Services";
// // import Footer from "./components/Footer";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import "./App.css";

// const App = () => {
//   return <div>
//     <Navbar />
//     <section id="about">
//     <Hero /> </section>
//     <section id="about">
//         <About />
//       </section>
//       <section id="services">
//         <Services />
//       </section>
//   </div>;
// };

// export default App;


import React from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";

import Signup from "./components/Signup";
import Login from "./components/Login";

import Dashboard from "./components/Dashboard";

import "./App.css";

const Home = () => {
  return (
    <>
      <Navbar />

      <section id="home">
        <Hero />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="services">
        <Services />
      </section>
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("telemed_logged_in") === "true";

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;