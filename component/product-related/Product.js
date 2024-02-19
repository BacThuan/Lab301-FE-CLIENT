import { Link } from "react-router-dom";
import classes from "./Product.module.css";
import { convert } from "../../store/convert";

const Product = (props) => {
  const product = props.product;

  return (
    <div className={classes.container}>
      <Link to={`/shop/${product.productId}`}>
        <img src={product.img} />
      </Link>
      <p className={classes.name}>{product.name}</p>
      <p className={classes.price}>{convert(product.price)}</p>
    </div>
  );
};
export default Product;
