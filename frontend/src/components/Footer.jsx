import React from 'react';
import styles from '../css/Color.module.css';
import style from '../css/Footer.module.css';
const Footer = () => {
  return (
    <div>
      <footer class={style.footer}>
            <div class={style.footer__container}>
                <div class={style.footer__content}>
                    <h4>SUBSCRIBE TO GET THE LATEST NEWS</h4>
                    <p>
                        We recommend you to subscribe to our page. Enter your email to
                        get our daily updates.
                    </p>
                </div>
                <div class={style.footer__form}>
                    <form action="">
                        <input type="text" placeholder="Enter your email" />
                        <button>Subscribe</button>
                    </form>
                </div>
            </div>
            <div class={style.footer__bar}>
                <div class={style.footer__logo}>
                    <h4><a href="#">CareSerenity.ORG</a></h4>
                    <p>Copyright © 2023 Web Design Mastery. All rights reserved.</p>
                </div>
                <ul class={style.footer__nav}>
                    <li class={style.footer__link}><a href="#">Partnership</a></li>
                    <li class={style.footer__link}><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
        </footer>
    </div>
  )
}

export default Footer
