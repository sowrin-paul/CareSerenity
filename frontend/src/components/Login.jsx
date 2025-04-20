import React from "react";
import { Link } from "react-router-dom";
import styles from "../css/Login.module.css";

const Login = () => {
  return (
    <div className={styles.body}>
      {/* Optional background divs */}
      {/* <div className={styles.negative}></div>
      <div className={styles.positive}></div> */}

      <div className={styles.loginContainer}>
        <form>
          <h1>Log In</h1>

          <input
            type="email"
            name="acc_email"
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="acc_pass"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            name="login_btn"
            className={styles.loginBtn}
          >
            Log In
          </button>
        </form>

        <p className={styles.forgetPass}>
          <Link to="/forgetpassword">Forgot password?</Link>
        </p>

        <p className={styles.signup}>
          Don’t have an account?{" "}
          <Link className={styles.signupLink} to="/signup">
            Create new
          </Link>
        </p>

        <span>
          <Link className={styles.goBack} to="/">Go Back</Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
