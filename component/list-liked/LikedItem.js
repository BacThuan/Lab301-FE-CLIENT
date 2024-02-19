import classes from "./LikedItem.module.css";
import { Link } from "react-router-dom";
import Media from "react-media";
import React, { useState } from "react";

const LikedItem = (props) => {
  const product = props.product;
  const [isVisible, setIsVisible] = useState(true);
  const linkView = (
    <div className={classes.button}>
      <Link to={`/shop/${product.id}`}>View</Link>
    </div>
  );

  const remove = (
    <div className={classes.button}>
      <Link
        onClick={() => {
          setIsVisible(false);
          props.unlike(product.id);
        }}
      >
        Remove
      </Link>
    </div>
  );

  return (
    <React.Fragment>
      {isVisible && (
        <Media
          queries={{
            smallIpad: "(min-width: 481px)",
            tablet: "(max-width: 480px) and (min-width: 321px)",
            iphone: "(max-width: 320px) and (min-width: 241px)",
            smartPhone: "(max-width: 240px)",
          }}
        >
          {(matches) => (
            <React.Fragment>
              {matches.smallIpad && (
                <tr className={classes.tr}>
                  <td>{product.name}</td>
                  <td>{product.gender}</td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>{product.numberItems}</td>
                  <td className={classes.action}>
                    {linkView}
                    {remove}
                  </td>
                </tr>
              )}

              {matches.tablet && (
                <tr className={classes.tr}>
                  <td>
                    <p>{product.name}</p>
                    <p>{product.gender}</p>
                  </td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>{product.numberItems}</td>
                  <td className={classes.action}>
                    {linkView}
                    {remove}
                  </td>
                </tr>
              )}

              {matches.iphone && (
                <tr className={classes.tr}>
                  <td>
                    <p>Name: {product.name}</p>
                    <p>Gender: {product.gender}</p>
                    <p>Brand: {product.brand}</p>
                    <p>Category: {product.category}</p>
                  </td>

                  <td>{product.numberItems}</td>
                  <td className={classes.action}>
                    <div>
                      {linkView}
                      {remove}
                    </div>
                  </td>
                </tr>
              )}
              {matches.smartPhone && (
                <tr className={classes.tr}>
                  <td>
                    <p>Name: {product.name}</p>
                    <p>Gender: {product.gender}</p>
                    <p>Brand: {product.brand}</p>
                    <p>Category: {product.category}</p>
                    <p>Options: {product.numberItems}</p>
                  </td>

                  <td className={classes.action}>
                    <div>
                      {linkView}
                      {remove}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          )}
        </Media>
      )}
    </React.Fragment>
  );
};
export default LikedItem;
