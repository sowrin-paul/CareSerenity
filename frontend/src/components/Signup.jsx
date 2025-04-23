import React from "react";
import { Link } from "react-router-dom";
import styles from '../css/Signup.module.css';

const Signup = () => {
    return (
        <div className={styles.body}>
            <div className={styles.loginContainer}>
                <form>
                    <h1>SignUp</h1>

                    <input type="email" name="acc_email" required placeholder="Account Email" />
                    <input type="password" name="acc_pass" required placeholder="Account Password" />
                    <input type="password" name="confirm_pass" required placeholder="Confirm password" />

                    <div className={styles.userType}>
                        <label>Account type:</label>
                        <select name="role" required>
                            <option value="" disabled selected>Select your account type</option>
                            <option value="user">User</option>
                            <option value="org">Organization</option>
                        </select>
                    </div>

                    <div className={styles.userType}>
                        <label>Security question:</label>
                        <select name="question" required>
                            <option value="" disabled selected>Select a question</option>
                            <option value="What was your childhood nickname?">What was your childhood nickname?</option>
                            <option value="What is your favorite book?">What is your favorite book?</option>
                            <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                            <option value="What is your favorite movie?">What is your favorite movie?</option>
                            <option value="What was your first job?">What was your first job?</option>
                            <option value="What was your biggest lost?">What was your biggest lost?</option>
                            <option value="What is the last name of your best childhood friend?">What is the last name of your best childhood friend?</option>
                            <option value="What is your favourite faculty name?">What is your favourite faculty name?</option>
                        </select>
                    </div>

                    <input type="text" name="answer" required placeholder="Your answer" />

                    <button type="submit" name="signup_btn" id="button-30">SignUp</button>
                </form>

                <p className={styles.signup}>
                    Already have an account? <Link id="signup" to="/login">Login</Link>
                </p>
                <span>
                    <Link className="goback" to="/">Go Back</Link>
                </span>
            </div>
        </div>
    );
};

export default Signup;
