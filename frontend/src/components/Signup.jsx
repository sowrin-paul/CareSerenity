import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg_4.jpg";

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    background: "rgba(35, 39, 47, 0.85)",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "450px",
    },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    minHeight: "100vh",
    padding: theme.spacing(2),
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    position: "relative",
    [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(4),
    },
    "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        zIndex: -1,
        inset: 0,
    },
}));

const Signup = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [role, setRole] = React.useState("");
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);
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
                if (role == 0) {
                    navigate("/user-home");
                } else if (role == 1) {
                    alert(data.message || "Registration request sent to the admin for approval.")
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
        <React.Fragment>
            <CssBaseline enableColorScheme />
            <SignUpContainer direction="column" justifyContent="center">
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            width: "100%",
                            fontSize: "clamp(2rem, 10vw, 2.15rem)",
                            color: "var(--primary-title-color)",
                            fontFamily: "var(--primary-font), sans-serif",
                            fontWeight: 700,
                            textAlign: "center",
                            letterSpacing: 1,
                        }}
                    >
                        Sign Up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <TextField
                                id="email"
                                label="Email"
                                type="email"
                                name="acc_email"
                                placeholder="Account Email"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputLabelProps={{
                                    style: { color: "#b0bec5" },
                                }}
                                sx={{
                                    mb: 2,
                                    input: {
                                        // color: "#f5f5f5",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#00bcd4",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#00bcd4",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4081",
                                        },
                                        background: "#23272f",
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                name="acc_pass"
                                label="Password"
                                placeholder="Account Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                required
                                fullWidth
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputLabelProps={{
                                    style: { color: "#b0bec5" },
                                }}
                                sx={{
                                    mb: 2,
                                    input: {
                                        color: "#f5f5f5",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#00bcd4",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#00bcd4",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4081",
                                        },
                                        background: "#23272f",
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                name="confirm_pass"
                                label="Confirm Password"
                                placeholder="Confirm password"
                                type="password"
                                id="confirm_password"
                                autoComplete="new-password"
                                required
                                fullWidth
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                InputLabelProps={{
                                    style: { color: "#b0bec5" },
                                }}
                                sx={{
                                    mb: 2,
                                    input: {
                                        color: "#f5f5f5",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#00bcd4",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#00bcd4",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ff4081",
                                        },
                                        background: "#23272f",
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="role-label" sx={{ color: "#b0bec5" }}>
                                Account Type
                            </InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                name="role"
                                value={role}
                                label="Account Type"
                                required
                                onChange={(e) => setRole(e.target.value)}
                                sx={{
                                    color: "#f5f5f5",
                                    background: "#23272f",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#00bcd4",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#00bcd4",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#ff4081",
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            background: "#23272f",
                                            color: "#f5f5f5",
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="" disabled>
                                    Select your account type
                                </MenuItem>
                                <MenuItem value="0">User</MenuItem>
                                <MenuItem value="1">Organization</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 1,
                                background: "#ff4081",
                                color: "#fff",
                                fontFamily: "var(--primary-font)",
                                fontWeight: 600,
                                fontSize: 18,
                                letterSpacing: 1,
                                "&:hover": {
                                    background: "#e91e63",
                                },
                                boxShadow: "none",
                                borderRadius: "4px",
                                py: 1.2,
                            }}
                        >
                            Sign Up
                        </Button>
                        {error && (
                            <Typography color="error" sx={{ mt: 1, fontFamily: "var(--primary-font)" }}>
                                {error}
                            </Typography>
                        )}
                        {success && (
                            <Typography color="success.main" sx={{ mt: 1, fontFamily: "var(--primary-font)" }}>
                                Registration successful! Redirecting...
                            </Typography>
                        )}

                        <Typography
                            sx={{
                                alignSelf: "center",
                                color: "var(--secondary-title-color)",
                                fontFamily: "var(--primary-font)",
                                mt: 1,
                                fontSize: 14,
                            }}
                        >Already have an account?</Typography>
                        <Link
                            component="button"
                            type="button"
                            variant="body2"
                            sx={{
                                alignSelf: "center",
                                color: "var(--secondary-title-color)",
                                fontFamily: "var(--primary-font)",
                                mt: 1,
                                fontSize: 14,
                            }}
                            onClick={() => navigate("/login")}
                        > Login
                        </Link>
                    </Box>
                    <Divider sx={{ color: "var(--primary-title-color)", fontFamily: "var(--primary-font)", fontSize: 12 }}>
                        or
                    </Divider>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography sx={{ textAlign: "center", fontFamily: "var(--primary-font)", color: "var(--primary-text-color)", fontSize: 14 }}>
                            <Link
                                component="button"
                                variant="body2"
                                sx={{ color: "var(--secondary-title-color)", fontFamily: "var(--primary-font)", fontSize: 14 }}
                                onClick={() => navigate("/")}
                            >
                                Go Back
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
        </React.Fragment>
    );
};

export default Signup;