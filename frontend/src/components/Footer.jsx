import React from 'react';
import styles from '../css/Color.module.css';
import style from '../css/Footer.module.css';
const Footer = () => {
  return (
    <div>
      <footer className={style.footer}>
            <div className={style.footer__container}>
                <div className={style.footer__content}>
                    <h4>SUBSCRIBE TO GET THE LATEST NEWS</h4>
                    <p>
                        We recommend you to subscribe to our page. Enter your email to
                        get our daily updates.
                    </p>
                </div>
                <div className={style.footer__form}>
                    <form action="">
                        <input type="text" placeholder="Enter your email" />
                        <button>Subscribe</button>
                    </form>
                </div>
            </div>
            <div className={style.footer__bar}>
                <div className={style.footer__logo}>
                    <h4><a href="#">CareSerenity.ORG</a></h4>
                    <p>Copyright © 2023 Web Design Mastery. All rights reserved.</p>
                </div>
                <ul className={style.footer__nav}>
                    <li className={style.footer__link}><a href="#">Partnership</a></li>
                    <li className={style.footer__link}><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
        </footer>
    </div>
  )
}

export default Footer
