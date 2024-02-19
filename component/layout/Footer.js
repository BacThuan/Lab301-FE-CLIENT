import { Link } from "react-router-dom";
import classes from "./Footer.module.css";
import Media from "react-media";
const Footer = () => {
  return (
    <div className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.row}>
          <div className={classes.title}>CUSTOMER SERVICES</div>
          <Link to="#">Help & Contact Us</Link>
          <br></br>
          <Link to="#">Returns & Refunds</Link>
          <br></br>
          <Link to="#">Online Stores</Link>
          <br></br>
          <Link to="#">Term & Conditions</Link>
          <br></br>
        </div>

        <div className={classes.row}>
          <div className={classes.title}>COMPANY</div>
          <Link to="#">What We Do</Link>
          <br></br>
          <Link to="#">Available Services</Link>
          <br></br>
          <Link to="#">Latest Posts</Link>
          <br></br>
          <Link to="#">FAQs</Link>
          <br></br>
        </div>

        <div className={classes.row}>
          <div className={classes.title}>SOCIAL MEDIA</div>
          <Link to="#">Twitter</Link>
          <br></br>
          <Link to="#">Instagram</Link>
          <br></br>
          <Link to="#">Facebook</Link>
          <br></br>
          <Link to="#">Pinterest</Link>
          <br></br>
        </div>
      </div>

      <div className={classes.under}>Copyright © 2024. Shoe Shop</div>
    </div>
  );
};
export default Footer;
