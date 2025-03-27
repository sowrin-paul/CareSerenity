import "../styles/footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__content">
                    <h4>SUBSCRIBE TO GET THE LATEST NEWS</h4>
                    <p>
                        We recommend you to subscribe to our page. Enter your email to
                        get our daily updates.
                    </p>
                </div>
                <div className="footer__form">
                    <form action="/">
                        <input type="text" placeholder="Enter your email" />
                        <button>Subscribe</button>
                    </form>
                </div>
            </div>
            <div className="footer__bar">
                <div className="footer__logo">
                    <h4><a href="#">CareSerenity.ORG</a></h4>
                    <p>Copyright © 2023 Web Design Mastery. All rights reserved.</p>
                </div>
                <ul className="footer__nav">
                    <li className="footer__link"><a href="#">Partnership</a></li>
                    <li className="footer__link"><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
