import classes from "./Banner.module.css";
import Media from "react-media";
const BannerShop = (props) => {
  return (
    <div className={classes.banner}>
      <div className={classes.title1}>{props.title}</div>

      <Media
        queries={{
          normal: "(min-width: 480px)",
        }}
      >
        {(matches) => (
          <div>
            {matches.normal && (
              <div className={classes.title2}>{props.title}</div>
            )}
          </div>
        )}
      </Media>
    </div>
  );
};
export default BannerShop;
