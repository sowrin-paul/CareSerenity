import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import AboutImage from "../assets/about_img.png";
import demo from "../assets/BlogDemo.jpg";

const Home = () => {
    const [data, setData] = useState({
        total_orphans: 4,
        total_organizations: 27,
        total_amount: 54230,
        total_users: 30,
        total_volunteers: 5,
    });

    useEffect(() => {
        fetch("YOUR_BACKEND_API_URL")
            .then((res) => res.json())
            .then((response) => {
                setData(response);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <>
            <Navbar />
            <div className="hero">
                <div className="section__container header__container">
                    <h1>Join us to make Lives Better</h1>
                    <p>A platform for Organizations. Stay connected with orphans and elderly to change lives with each click. Spread kindness to all.</p>
                </div>
                <div className="row diag-ro" id="info_web">
                    <div className="about-diag" id="info_cell">
                        <div className="icon"><i className="fas fa-arrow-right"></i></div>
                        <div className="tex">
                            <p id="text">There are over</p>
                            <h3 id="count">{data.total_orphans}</h3>
                            <p id="text">orphans to help</p>
                        </div>
                    </div>
                    <div className="about-diag" id="info_cell">
                        <div className="icon"><i className="fas fa-arrow-right"></i></div>
                        <div className="tex">
                            <p id="text">We have total</p>
                            <h3 id="count">{data.total_organizations}</h3>
                            <p id="text">organizations</p>
                        </div>
                    </div>
                    <div className="about-diag" id="info_cell">
                        <div className="icon"><i className="fas fa-arrow-right"></i></div>
                        <div className="tex">
                            <p id="text">We served over</p>
                            <h3 id="count">{data.total_amount}</h3>
                            <p id="text">BDT as Donation</p>
                        </div>
                    </div>
                    <div className="about-diag" id="info_cell">
                        <div className="icon"><i className="fas fa-arrow-right"></i></div>
                        <div className="tex">
                            <p id="text">Almost</p>
                            <h3 id="count">{data.total_users}</h3>
                            <p id="text">users</p>
                        </div>
                    </div>
                    <div className="about-diag" id="info_cell">
                        <div className="icon"><i className="fas fa-arrow-right"></i></div>
                        <div className="tex">
                            <p id="text">We have</p>
                            <h3 id="count">{data.total_volunteers}</h3>
                            <p id="text">Volunteers</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="line"></div>

            <div className="services" id="services">
                <div className="section-title">
                    <p id="highlight">We provide</p>
                    <p>A platform for Organizations. Stay connected with orphans and elderly to change lives with each click. Spread kindness to all.</p>
                </div>
                <div className="service-table">
                    <div className="part">
                        <i className='bx bxs-credit-card' id="icon_i"></i>
                        <h4 className="title">RAISE FUND FOR ORGs</h4>
                        <p>Facilitate financial support for organizations, empowering them to achieve their noble goals.</p>
                    </div>
                    <div className="part">
                        <i className='bx bxs-home-heart' id="icon_i"></i>
                        <h4 className="title">Enabling Adoptions, Enriching Lives</h4>
                        <p>Empower life-changing adoptions, enriching lives for both adoptive parents and the adopted children.</p>
                    </div>
                    <div className="part">
                        <i className='bx bxs-dollar-circle' id="icon_i"></i>
                        <h4 className="title">Dynamic Donation System</h4>
                        <p>A versatile donation system that allows seamless and flexible contributions to various causes and organizations.</p>
                    </div>
                    <div className="part">
                        <i className='bx bxs-calendar-event' id="icon_i"></i>
                        <h4 className="title">Seminars</h4>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla consectetur adipiscing elit. Sed ac accumsan hic deserunt facere et animi</p>
                    </div>
                    <div className="part">
                        <i className='bx bx-world' id="icon_i"></i>
                        <h4 className="title">Access to Orphanage for Everyone</h4>
                        <p>Ensure inclusive access to orphanages, making them accessible and reachable for everyone in need.</p>
                    </div>
                    <div className="part">
                        <i className='bx bxs-user-plus' id="icon_i"></i>
                        <h4 className="title">Join As Volunteer</h4>
                        <p>Lorem ipsum dolor sit amet consectetur, consectetur adipiscing elit. Sed ac accumsan adipisicing elit. Nulla hic deserunt facere et animi</p>
                    </div>
                </div>
            </div>

            <div id="line"></div>

            <div className="donations" id="donations">
                <div className="section-title">
                    <p id="highlight">Recently raised funds</p>
                </div>
                <div className="cards-container">
                    <div className="card">
                        <img src={ demo } alt="image"/>
                        <h1>Help them</h1>
                        <p>Aron</p>
                        <p className="price"> 2000$ </p>
                        <a href="#" id="button-30">Donate</a>
                    </div>
                </div>
            </div>

            <div id="line"></div>

            <div className="AboutUs" id="AboutUs">
                <div className="descriptionbox">
                    <div className="session-title">
                        <p>Help us to Achieve our Goal</p>
                        <p id="highlight">Joining Hands, Changing Stories</p>
                    </div>
                    <div className="about-detail">
                        <p>&nbsp;&nbsp;&nbsp;Welcome to our platform, a digital space dedicated to fostering connections between caring individuals, organizations, and those in need. We aim to create meaningful impacts by facilitating connections between generous donors and vulnerable members of our society.</p>
                        <br/>
                        <p>&nbsp;&nbsp;&nbsp;At <b>CareSenrenity.org</b> , our mission is to facilitate connections that matter. Through our intuitive interface, we enable organizations to reach out, support, and make a real difference in the lives of orphans and the elderly community members.</p>
                        <br/>
                        <p>&nbsp;&nbsp;&nbsp;Adopt an orphan, explore orphanages and organizations, extend support with donations to specific causes or children. View detailed profiles of orphans, post thoughts on orphanage situations, hunger, and more, accompanied by photos and comments. Share moments in the gallery, embrace the opportunity to adopt a child, and anticipate upcoming services for elderly individuals. Together, let's make a difference in the lives of the vulnerable.</p>
                    </div>
                </div>
                <div className="about-image">
                    <img src={AboutImage} alt="ChildImage"/>
                </div>
            </div>

            <div id="line"></div>

            <div className="blog" id="blogs">
                <div className="section-title">
                    <h2 id="highlight">Blog</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ipsum sit nibh amet egestas tellus.</p>
                </div>
                <div className="cards-container">
                    <div className="card">
                        <img src={ demo } alt="image"/>
                        <h1>Help them</h1>
                        <p>Aron</p>
                        <p>20th March</p>
                        <a href="#" id="button-30">Read</a>
                    </div>
                    <div className="card">
                        <img src={ demo } alt="image"/>
                        <h1>Help them</h1>
                        <p>Aron</p>
                        <p>20th March</p>
                        <a href="#" id="button-30">Read</a>
                    </div>
                    <div className="card">
                        <img src={ demo } alt="image"/>
                        <h1>Help them</h1>
                        <p>Aron</p>
                        <p>20th March</p>
                        <a href="#" id="button-30">Read</a>
                    </div>
                </div>
            </div>

            <div id="line"></div>

            <div class="row no-margin" id="contactUs">
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3650.582336034878!2d90.4471350761669!3d23.79788287863816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1721831420744!5m2!1sen!2sus" width="100%" height="450"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div className="contactUs">
                <form className="contact_form" action="./contact_form_BE.php" method="post">
                    <h2 id="highlight">Contact Form</h2>
                    <div className="form_row">
                        <div className="label"><label>Enter Name </label><span>:</span></div>
                        <div className="inputbox"><input type="text" placeholder="Enter Name" name="name" /></div>
                    </div>
                    <div className="form_row">
                        <div className="label"><label>Email Address </label><span>:</span></div>
                        <div className="inputbox"><input type="email" name="email" placeholder="Enter Email Address" /></div>
                    </div>
                    <div className="form_row">
                        <div className="label"><label>Mobile Number</label><span>:</span></div>
                        <div className="inputbox">
                            <input type="text" id="mobile" name="mobile" placeholder="Enter Mobile Number" required />
                            <span id="mobile-error" style={{ color: "red", display: "none" }}>Mobile number cannot exceed 11 digits</span>
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="label"><label>Enter Message</label><span>:</span></div>
                        <div className="inputbox">
                            <textarea rows="5" placeholder="Enter Your Message" name="msg"></textarea>
                        </div>
                    </div>
                    <div className="form_row">
                        <button type="submit" id="button-30">Send Message</button>
                    </div>
                </form>
                <div className="contact_address">
                    <div className="address">
                        <h2 id="highlight">Address</h2>
                        Ritz Mozaffor BA<br/>
                        1/1, B #F, R #1, S #2<br/>
                        Mirpur 02, Dhaka - 1216<br/>
                        Phone: +880 1973336001<br/>
                        Email: care.serenity@gmail.com<br/>
                        Website: www.careserenity.org<br/>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Home;