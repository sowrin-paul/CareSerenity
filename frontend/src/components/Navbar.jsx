import React from 'react'
import '../css/Navbar.css'

const Navbar = () => {
    return (
        <div class="navbar">
            <div class="logo-container">
                {/* <img src="" alt="Logo" class="logo"> */}
                    <div class="brand"><span class="care">Care</span><span class="serenity">Serenity</span></div>
            </div>
            <div class="nav-links">
                <a href="#" class="active">Home</a>
                <a href="#">Services</a>
                <a href="#">Donations</a>
                <a href="#">Blogs</a>
                <a href="#">About Us</a>
                <a href="#">Contact Us</a>
            </div>
        </div>

    )
}

export default Navbar
