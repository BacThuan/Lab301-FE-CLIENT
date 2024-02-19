import classes from "./Category.module.css";
import product1 from "../../assets/brand/alacoste-logo.jpg";
import product2 from "../../assets/brand/Converse-Logo.jpg";
import product3 from "../../assets/brand/logo_adidas.jpg";
import product4 from "../../assets/brand/logo_lv.jpg";
import product5 from "../../assets/brand/logo_newbalan.jpg";
import product6 from "../../assets/brand/puma-logo1.jpg";
import product7 from "../../assets/brand/logo_reebok.jpg";
import product8 from "../../assets/brand/nike_logo.png";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Media from "react-media";
import React from "react";
const Category = () => {
  const array = [
    product1,
    product2,
    product3,
    product4,
    product5,
    product6,
    product7,
    product8,
  ];
  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <span>CAREFULLY CREATED COLLECTIONS</span>
        <p>BROWSE OUR CATEGORY</p>
      </div>

      <div className={classes.img}>
        <Media
          queries={{
            normal: "(min-width: 241px)",
            smartPhone: "(max-width: 240px)",
          }}
        >
          {(matches) => (
            <React.Fragment>
              {matches.normal && (
                <React.Fragment>
                  <ul className={classes.list}>
                    {array.map((product, index) => {
                      return (
                        <li key={index}>
                          <Link to="/shop" className="tt-img-box">
                            <img src={product} alt="" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </React.Fragment>
              )}

              {matches.smartPhone && (
                <Carousel>
                  {array.map((img, index) => {
                    return (
                      <Carousel.Item key={index}>
                        <div>
                          <Link to="/shop" className="tt-img-box">
                            <img src={img} />
                          </Link>
                        </div>
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              )}
            </React.Fragment>
          )}
        </Media>
      </div>
    </div>
  );
};
export default Category;
