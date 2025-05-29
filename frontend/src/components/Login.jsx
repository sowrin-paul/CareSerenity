import React, { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/Signup.module.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.data.access);
        const userId = data.data.id;
        const userRole = data.data.role;

        if (userRole == 0) {
          navigate(`/user-home/${userId}`);
        } else if (userRole == 1) {
          navigate(`/organization-profile/${userId}`);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Invalid credentials");
      }
    } catch (err) {
      setError(err.error, "Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.body}>
      {/* Optional background divs */}
      {/* <div className={styles.negative}></div>
      <div className={styles.positive}></div> */}

      <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit}>
          <h1>Log In</h1>

          <input
            type="email"
            name="acc_email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="acc_pass"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" name="login_btn" className={styles.loginBtn}>
            Log In
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.signup}>
          Don't have an account?{" "}
          <Link className={styles.signupLink} to="/signup">
            Create new
          </Link>
        </p>

        <span>
          <Link className={styles.goBack} to="/">
            Go Back
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
