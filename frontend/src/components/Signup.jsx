import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/Signup.module.css";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    // const [securityQuestion, setSecurityQuestion] = useState("");
    // const [answer, setAnswer] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    ac_role: role,
                    // security_question: securityQuestion,
                    // security_answer: answer,
                }),
            });

            const data = await response.json();
            console.log(data);


            if (response.ok) {
                // setSuccess(true);
                // setTimeout(() => navigate("/login"), 2000);
                if(role == 0) {
                    navigate("/user-home");
                } else if(role == 1) {
                    alert(data.message|| "Registration request sent to the admin for approval.")
                }
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Failed to register. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.loginContainer}>
                <form onSubmit={handleSubmit}>
                    <h1>SignUp</h1>

                    <input
                        type="email"
                        name="acc_email"
                        required
                        placeholder="Account Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="acc_pass"
                        required
                        placeholder="Account Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        name="confirm_pass"
                        required
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <div className={styles.userType}>
                        <select
                            name="role"
                            required
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="" disabled>
                                Select your account type
                            </option>
                            <option value="0">User</option>
                            <option value="1">Organization</option>
                        </select>
                    </div>

                    <button type="submit" name="signup_btn" id="button-30">
                        SignUp
                    </button>


                    <p className={styles.signup}>
                        Already have an account? <Link id="signup" to="/login">Login</Link>
                    </p>

                    {/* <div className={styles.userType}>
                        <label>Security question:</label>
                        <select
                            name="question"
                            required
                            value={securityQuestion}
                            onChange={(e) => setSecurityQuestion(e.target.value)}
                        >
                            <option value="" disabled>
                                Select a question
                            </option>
                            <option value="What was your childhood nickname?">
                                What was your childhood nickname?
                            </option>
                            <option value="What is your favorite book?">
                                What is your favorite book?
                            </option>
                            <option value="What was the name of your first pet?">
                                What was the name of your first pet?
                            </option>
                            <option value="What is your favorite movie?">
                                What is your favorite movie?
                            </option>
                            <option value="What was your first job?">
                                What was your first job?
                            </option>
                            <option value="What was your biggest lost?">
                                What was your biggest lost?
                            </option>
                            <option value="What is the last name of your best childhood friend?">
                                What is the last name of your best childhood friend?
                            </option>
                            <option value="What is your favourite faculty name?">
                                What is your favourite faculty name?
                            </option>
                        </select>
                    </div>

                    <input
                        type="text"
                        name="answer"
                        required
                        placeholder="Your answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    /> */}
                </form>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>Registration successful! Redirecting...</p>}
                <span>
                    <Link className="goback" to="/">Go Back</Link>
                </span>
            </div>
        </div>
    );
};

export default Signup;
