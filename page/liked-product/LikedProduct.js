import ListLiked from "../../component/list-liked/ListLiked";

import Banner from "../../component/banner/Banner";
import classes from "./LikedProduct.module.css";
import { useEffect } from "react";

const LikedProduct = () => {
  useEffect(() => {
    document.title = "Products Liked";
  }, []);
  return (
    <div className={classes.container}>
      <Banner title={"Favourite"} />

      <div className={classes.like}>
        <ListLiked />
      </div>
    </div>
  );
};

export default LikedProduct;
