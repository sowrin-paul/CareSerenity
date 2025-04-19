import React from "react";
import '../css/LandingPage.css'
const LandingPage = () => {
  return (
    <div>
      {/* <div className="feedback">
        <div className="positive">
          <h5>Notification</h5>
        </div>
      </div> */}

      <div className="hero">
        <div className="section__container header__container">
          <h1>Join us to make Lives Better</h1>
          <p>
            A platform for Organizations. Stay connected with orphans and elderly
            to change lives with each click. Spread kindness to all.
          </p>
        </div>

        <div className="row diag-ro" id="info_web">
          {[
            "orphans to help",
            "organizations",
            "BDT as Donation",
            "users",
            "Volunteers"
          ].map((label, index) => (
            <div className="about-diag" id="info_cell" key={index}>
              <div className="icon">
                <i className="fas fa-arrow-right"></i>
              </div>
              <div className="tex">
                <p>We have</p>
                <h3>43</h3>
                <p>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="line"></div>
      <div className="services" id="services">
        <div className="section-title">
          <p id="highlight">We provide</p>
          <p>
            A platform for Organizations. Stay connected with orphans and elderly
            to change lives with each click. Spread kindness to all.
          </p>
        </div>

        <div className="service-table">
          {[
            {
              icon: "bxs-credit-card",
              title: "RAISE FUND FOR ORGs",
              desc:
                "Facilitate financial support for organizations, empowering them to achieve their noble goals."
            },
            {
              icon: "bxs-home-heart",
              title: "Enabling Adoptions, Enriching Lives",
              desc:
                "Empower life-changing adoptions, enriching lives for both adoptive parents and the adopted children."
            },
            {
              icon: "bxs-dollar-circle",
              title: "Dynamic Donation System",
              desc:
                "A versatile donation system that allows seamless and flexible contributions to various causes and organizations."
            },
            {
              icon: "bxs-calendar-event",
              title: "Seminars",
              desc:
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla consectetur adipiscing elit. Sed ac accumsan hic deserunt facere et animi"
            },
            {
              icon: "bx-world",
              title: "Access to Orphanage for Everyone",
              desc:
                "Ensure inclusive access to orphanages, making them accessible and reachable for everyone in need."
            },
            {
              icon: "bxs-user-plus",
              title: "Join As Volunteer",
              desc:
                "Lorem ipsum dolor sit amet consectetur, consectetur adipiscing elit. Sed ac accumsan adipisicing elit. Nulla hic deserunt facere et animi"
            }
          ].map((item, index) => (
            <div className="part" key={index}>
              <i className={`bx ${item.icon}`} id="icon_i"></i>
              <h4 className="title">{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="line"></div>
      <div className="donations" id="donations">
        <div className="section-title">
          <p id="highlight">Recently raised funds</p>
        </div>
        <div className="cards-container">card generate</div>
      </div>

      <div id="line"></div>
      <div className="AboutUs" id="AboutUs">
        <div className="descriptionbox">
          <div className="session-title">
            <p>Help us to Achieve our Goal</p>
            <p id="highlight descHighlight">Joining Hands, Changing Stories</p>
          </div>
          <div className="about-detail">
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
        <div className="about-image">
          <img src="./assets/about_img.png" alt="About" />
        </div>
      </div>

      <div id="line"></div>
      <div className="blog" id="blogs">
        <div className="section-title">
          <h2 id="highlight">Blog</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ipsum
            sit nibh amet egestas tellus.
          </p>
        </div>
        <div className="cards-container">{/* PHP blog display area */}</div>
      </div>

      <div id="line"></div>
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

      <div className="contactUs">
        <form
          className="contact_form"
          action="./contact_form_BE"
          method="post"
          onSubmit={(e) => {
            const mobile = document.getElementById("mobile");
            const error = document.getElementById("mobile-error");
            if (mobile.value.length > 11) {
              e.preventDefault();
              error.style.display = "block";
              mobile.style.borderColor = "red";
            } else {
              error.style.display = "none";
              mobile.style.borderColor = "";
            }
          }}
        >
          <h2 id="highlight">Contact Form</h2>
          <br />
          <div className="form_row">
            <div className="label">
              <label>Enter Name </label>
              <span>:</span>
            </div>
            <div className="inputbox">
              <input type="text" placeholder="Enter Name" name="name" />
            </div>
          </div>

          <div className="form_row">
            <div className="label">
              <label>Email Address </label>
              <span>:</span>
            </div>
            <div className="inputbox">
              <input type="email" name="email" placeholder="Enter Email Address" />
            </div>
          </div>

          <div className="form_row">
            <div className="label">
              <label>Mobile Number</label>
              <span>:</span>
            </div>
            <div className="inputbox">
              <input
                type="text"
                id="mobile"
                name="mobile"
                placeholder="Enter Mobile Number"
                required
              />
              <span
                id="mobile-error"
                style={{ color: "red", display: "none" }}
              >
                Mobile number cannot exceed 11 digits
              </span>
            </div>
          </div>

          <div className="form_row">
            <div className="label">
              <label>Enter Message</label>
              <span>:</span>
            </div>
            <div className="inputbox">
              <textarea rows="5" placeholder="Enter Your Message" name="msg"></textarea>
            </div>
          </div>

          <div className="form_row">
            <button type="submit" id="button-30">
              Send Message
            </button>
          </div>
        </form>

        <div className="contact_address">
          <div className="address">
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

      <button id="scrollTopBtn" title="Go to top">
        <i className="bx bx-chevrons-up bx-burst"></i>
      </button>
    </div>
  );
};

export default LandingPage;
