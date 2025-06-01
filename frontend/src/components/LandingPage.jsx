import React, { useEffect, useState } from "react";
import styles from '../css/LandingPage.module.css';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import aboutImage from '../assets/about_img.png';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { TextField, Button, Box, Typography, Stack, Alert } from '@mui/material';
import emailjs from '@emailjs/browser';

const apiUrl = import.meta.env.VITE_API_URL;

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    msg: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate mobile number length
    if (formData.mobile.length > 11) {
      setErrorMessage("Mobile number cannot exceed 11 digits.");
      return;
    }

    setIsSending(true);
    setErrorMessage("");
    setSuccessMessage("");

    emailjs
      .send(
        "service_13pe3fr",
        "template_cibvreg",
        formData,
        "b3UNwrJ-Pypzfr76N"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setSuccessMessage("Your message has been sent successfully!");
          setFormData({ name: "", email: "", mobile: "", msg: "" }); // Reset form
        },
        (error) => {
          console.error("FAILED...", error);
          setErrorMessage("Failed to send your message. Please try again.");
        }
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  useEffect(() => {
    const hash = window.location.hash.substring(1);

    if (hash) {
      const section = document.getElementById(hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <>
      <TopBar />
      <Navbar />
      <Hero />
      <div id="line" className={styles.line}></div>
      <div className={styles.services} id="services">
        <div className={styles.sectionTitle}>
          <h1 id="highlight" className={styles.highlight}>We provide</h1>
          <p>
            A platform for Organizations. Stay connected with orphans and elderly
            to change lives with each click. Spread kindness to all.
          </p>
        </div>

        <div className={styles.serviceTable}>
          {[
            {
              icon: "bxs-credit-card",
              title: "RAISE FUND FOR ORGs",
              desc: "Facilitate financial support for organizations, empowering them to achieve their noble goals."
            },
            {
              icon: "bxs-home-heart",
              title: "Enabling Adoptions, Enriching Lives",
              desc: "Empower life-changing adoptions, enriching lives for both adoptive parents and the adopted children."
            },
            {
              icon: "bxs-dollar-circle",
              title: "Dynamic Donation System",
              desc: "A versatile donation system that allows seamless and flexible contributions to various causes and organizations."
            },
            {
              icon: "bxs-calendar-event",
              title: "Seminars",
              desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla consectetur adipiscing elit. Sed ac accumsan hic deserunt facere et animi"
            },
            {
              icon: "bx-world",
              title: "Access to Orphanage for Everyone",
              desc: "Ensure inclusive access to orphanages, making them accessible and reachable for everyone in need."
            },
            {
              icon: "bxs-user-plus",
              title: "Join As Volunteer",
              desc: "Lorem ipsum dolor sit amet consectetur, consectetur adipiscing elit. Sed ac accumsan adipisicing elit. Nulla hic deserunt facere et animi"
            }
          ].map((item, index) => (
            <div className={styles.part} key={index}>
              <i className={`bx ${item.icon}`} id="icon_i"></i>
              <h4 className={styles.title}>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="line"></div>

      <div className={styles.donations} id="donations">
        <div className={styles.sectionTitle}>
          <h1 id="highlight" className={styles.highlight}>Recently raised funds</h1>
        </div>
        <Stack sx={{ width: "100%", margin: "10px auto" }} spacing={2}>
          <Alert severity="warning">No recent fundraising campaigns yet.</Alert>
        </Stack>
      </div>

      <div id="line"></div>

      <div className={styles.AboutUs} id="aboutUs">
        <div className={styles.descriptionbox}>
          <div className={styles.sessionTitle}>
            <h1 id="highlight" className={styles.highlight}>Help us to Achieve our Goal</h1>
            <p id="highlight" className={styles.descHighlight}>Joining Hands, Changing Stories</p>
          </div>
          <div className={styles.aboutDetail}>
            <p>
              Welcome to our platform, a digital space dedicated to fostering
              connections between caring individuals, organizations, and those in
              need. We aim to create meaningful impacts by facilitating
              connections between generous donors and vulnerable members of our
              society.
            </p>
            <br />
            <p>
              At <b>CareSenrenity.org</b>, our mission is to facilitate
              connections that matter. Through our intuitive interface, we enable
              organizations to reach out, support, and make a real difference in
              the lives of orphans and the elderly community members.
            </p>
            <br />
            <p>
              Adopt an orphan, explore orphanages and organizations, extend
              support with donations to specific causes or children. View detailed
              profiles of orphans, post thoughts on orphanage situations, hunger,
              and more, accompanied by photos and comments. Share moments in the
              gallery, embrace the opportunity to adopt a child, and anticipate
              upcoming services for elderly individuals. Together, let's make a
              difference in the lives of the vulnerable.
            </p>
          </div>
        </div>
        <div className={styles.aboutImage}>
          <img src={aboutImage} alt="About" />
        </div>
      </div>

      <div id="line" className={styles.line}></div>
      {/* <div className={styles.blog} id="blogs">
        <div className={styles.sectionTitle}>
          <h2 id="highlight" className={styles.highlight}>Blog</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ipsum sit nibh amet egestas tellus.</p>
        </div>
        <div className="cards-container">
        </div>
      </div> */}
      {/* <div id="line" className={styles.line}></div> */}
      <div className="row no-margin" id="contactUs">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3650.582336034878!2d90.4471350761669!3d23.79788287863816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1721831420744!5m2!1sen!2sus"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        ></iframe>
      </div>

      <div className={styles.contactUs}>
        <Box
          component="form"
          className={styles.contactForm}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500, margin: '0 auto' }}
          onSubmit={handleSubmit}
        >
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            Contact Form
          </Typography>

          {successMessage && <Typography color="green">{successMessage}</Typography>}
          {errorMessage && <Typography color="red">{errorMessage}</Typography>}

          <TextField
            label="Enter Name"
            name="name"
            variant="outlined"
            fullWidth
            required
            margin="dense"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            label="Email Address"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            required
            margin="dense"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            label="Mobile Number"
            name="mobile"
            type="text"
            variant="outlined"
            fullWidth
            required
            margin="dense"
            inputProps={{ maxLength: 11 }}
            value={formData.mobile}
            onChange={handleChange}
          />

          <TextField
            label="Enter Message"
            name="msg"
            multiline
            rows={5}
            variant="outlined"
            fullWidth
            margin="dense"
            value={formData.msg}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            className={styles.button_30}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </Box>

        <div className={styles.contactAddress}>
          <div className={styles.address}>
            <h2 id="highlight">Address</h2>
            Ritz Mozaffor BA<br />
            1/1, B #F, R #1, S #2<br />
            Mirpur 02, Dhaka - 1216<br />
            Phone: +880 1973336001<br />
            Email: care.serenity@gmail.com<br />
            Website: www.careserenity.org<br />
          </div>
        </div>
      </div>


      {/* <button id="scrollTopBtn" title="Go to top">
        <i className="bx bx-chevrons-up bx-burst"></i>
      </button> */}
      <Footer />
    </>
  );
};

export default LandingPage;
