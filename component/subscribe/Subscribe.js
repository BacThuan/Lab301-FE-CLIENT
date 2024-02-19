import classes from "./Subscribe.module.css";
const Subscribe = () => {
  return (
    <div className={classes.container}>
      <div className={classes.info}>
        <div className={classes.column}>
          <p className={classes.title1}>FREE SHIPPING</p>
          <p className={classes.title2}>Free shipping worldwide</p>
        </div>

        <div className={classes.column}>
          <p className={classes.title1}>24 X 7 SERVICE</p>
          <p className={classes.title2}>We work 24/7 per week</p>
        </div>

        <div className={classes.column}>
          <p className={classes.title1}>FESTIVAL OFFER</p>
          <p className={classes.title2}>We have discount code</p>
        </div>
      </div>

      <div className={classes.contact}>
        <div className={classes.column}>
          <p className={classes.title1}>LET'S BE FRIENDS!</p>
          <p className={classes.title2}>
            Nisi nisi tempor consequat laboris nisi
          </p>
        </div>

        <form className={classes.column}>
          <input
            type="text "
            placeholder="Enter your email address"
            className={classes.input}
          />
          <button type="submit" className={classes.btn}>
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};
export default Subscribe;
