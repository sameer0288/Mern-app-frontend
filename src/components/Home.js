import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <h2>Welcome to the Home Page</h2>
      <p>This is the landing page of your application.</p>
      <p>
        If you have an account, <Link to="/login">login here</Link>.
      </p>
      <p>
        If you don't have an account, <Link to="/register">register here</Link>.
      </p>
      <p>
        Users Table, <Link to="/user-table">User Table</Link>.
      </p>
    </div>
  );
}

export default Home;
