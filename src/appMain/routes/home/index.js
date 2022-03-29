import React, { useState } from "react";
import Projects from "./Projects";

const Home = () => {
  return (
    <div>
      <div className="app-wrapper">
        <h1 style={{ color: "#ff9800" }}>Your Projects</h1>
        <Projects />
      </div>
    </div>
  );
};

export default Home;
