import { Carousel, Image } from "react-bootstrap";
import banner1 from "../../assets/banner/banner1.jpg";
import banner2 from "../../assets/banner/banner2.jpg";
import banner4 from "../../assets/banner/banner4.jpg";
import classes from "./BannerHome.module.css";
const BannerHome = () => {
  const array = [banner1, banner2, , banner4];
  return (
    <Carousel>
      {array.map((img, index) => {
        return (
          <Carousel.Item key={index}>
            <img src={img} className={classes.img} />
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};
export default BannerHome;
