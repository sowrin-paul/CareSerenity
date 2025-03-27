import { Link } from "react-router-dom";
import logo from "../assets/LOGO.png";
import "../styles/navbar.css";

function Navbar(){
    return(
        <nav>
            <div className="top-nav">
                <ul className="contact-info">
                    <li className="top-nav-item">
                        <i className="bx bxs-phone"></i>
                        <a href="tel:+8801973336001">+8801973336001</a>
                    </li>
                    <li className="top-nav-item">
                        <i className="bx bxl-gmail"></i>
                        <a href="mailto:care.senerity@gmail.com">care.senerity@gmail.com</a>
                    </li>
                    <li className="top-nav-item">
                        <i className="bx bxs-map"></i>
                        <a href="#">1/1, Block-B, Road-27, Dhaka - 1216</a>
                    </li>
                </ul>
                <ul className="auth-links">
                    <li><Link to="/signup">Create account</Link></li>
                    <li><Link id="login-btn" to="/login">Login</Link></li>
                </ul>
            </div>

            <div className="bottom-nav">
                <div className="logo">
                    <img src={logo} height="35" alt="Logo" />
                    <Link to="/">
                        <span className="icon first">Care</span>
                        <span className="icon second">Serenity</span>
                    </Link>
                </div>
                <ul className="main-nav">
                    <li><Link to="/">Home</Link></li>
                    <span className="h-bar"></span>
                    <li><Link to="/#services">Services</Link></li>
                    <span className="h-bar"></span>
                    <li><Link to="/#donations">Donations</Link></li>
                    <span className="h-bar"></span>
                    <li><Link to="/#blogs">Blogs</Link></li>
                    <span className="h-bar"></span>
                    <li><Link to="/#AboutUs">About Us</Link></li>
                    <span className="h-bar"></span>
                    <li><Link to="/#contactUs">Contact Us</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;