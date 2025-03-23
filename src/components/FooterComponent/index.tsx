import { useState } from "react";
import styles from "./index.module.scss";
import {
  TwitterOutlined,
  FacebookFilled,
  InstagramFilled,
  GithubFilled,
  MailOutlined,
} from "@ant-design/icons";
import {
  ApplePay,
  GooglePay,
  Mastercard,
  Paypal,
  Visa,
} from "@components/Icon";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className={cx("footer")}>
      <div className={cx("news-letter")}>
        <div className={cx("news-letter-content")}>
          <h2 className={cx("news-letter-heading")}>
            STAY UPTO DATE ABOUT
            <br />
            OUR LATEST OFFERS
          </h2>

          <form className={cx("news-letter-form")} onSubmit={handleSubmit}>
            <div className={cx("input-container")}>
              <MailOutlined className={cx("input-icon")} />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cx("email-input")}
                required
              />
            </div>
            <button type="submit" className={cx("subscribe-button")}>
              Subscribe to Newsletter
            </button>
          </form>
        </div>
      </div>

      {/* Main footer content */}
      <div className={cx("footer-content")}>
        <div className={cx("footer-container")}>
          {/* Brand information */}
          <div className={cx("brand-section")}>
            <h2 className={cx("brand-name")}>SHOP.CO</h2>
            <p className={cx("brand-description")}>
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>

            <div className={cx("social-icons")}>
              <a href="#" className={cx("social-icon")}>
                <TwitterOutlined />
              </a>
              <a href="#" className={cx("social-icon")}>
                <FacebookFilled />
              </a>
              <a href="#" className={cx("social-icon")}>
                <InstagramFilled />
              </a>
              <a href="#" className={cx("social-icon")}>
                <GithubFilled />
              </a>
            </div>
          </div>
          <div className={cx("link-container")}>
            {/* Company links */}
            <div className={cx("link-column")}>
              <h3 className={cx("link-heading")}>COMPANY</h3>
              <ul className={cx("link-list")}>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Features</a>
                </li>
                <li>
                  <a href="#">Works</a>
                </li>
                <li>
                  <a href="#">Career</a>
                </li>
              </ul>
            </div>
            {/* Help links */}
            <div className={cx("link-column")}>
              <h3 className={cx("link-heading")}>HELP</h3>
              <ul className={cx("link-list")}>
                <li>
                  <a href="#">Customer Support</a>
                </li>
                <li>
                  <a href="#">Delivery Details</a>
                </li>
                <li>
                  <a href="#">Terms & Conditions</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
            {/* FAQ links */}
            <div className={cx("link-column")}>
              <h3 className={cx("link-heading")}>FAQ</h3>
              <ul className={cx("link-list")}>
                <li>
                  <a href="#">Account</a>
                </li>
                <li>
                  <a href="#">Manage Deliveries</a>
                </li>
                <li>
                  <a href="#">Orders</a>
                </li>
                <li>
                  <a href="#">Payments</a>
                </li>
              </ul>
            </div>
            {/* Resources links */}
            <div className={cx("link-column")}>
              <h3 className={cx("link-heading")}>RESOURCES</h3>
              <ul className={cx("link-list")}>
                <li>
                  <a href="#">Free eBooks</a>
                </li>
                <li>
                  <a href="#">Development Tutorial</a>
                </li>
                <li>
                  <a href="#">How to - Blog</a>
                </li>
                <li>
                  <a href="#">Youtube Playlist</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className={cx("footer-bottom")}>
          <div className={cx("footer-container-payment")}>
            <div className={cx("footer-bottom-content")}>
              <p className={cx("copyright")}>
                Shop.co © 2000-2023, All Rights Reserved
              </p>

              <div className={cx("payment-methods")}>
                <Visa width={40} height={40} />
                <Mastercard width={40} height={40} />
                <Paypal width={40} height={40} />
                <ApplePay width={40} height={40} />
                <GooglePay width={40} height={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
