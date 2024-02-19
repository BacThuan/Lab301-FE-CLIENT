import classes from "./ListProduct.module.css";
import Popup from "../popup/Popup";
import { useSelector, useDispatch } from "react-redux";
import useFetch from "../hook/useFetch";
import { api } from "../../api/api";
import { convert } from "../../store/convert";
const ListProduct = (props) => {
  // state for popup
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.isOpen);
  const productPopup = useSelector((state) => state.product);

  const { data, loading, error } = useFetch(`${api}/public/homepage-products`);

  const togglePopup = (product, event) => {
    event.preventDefault();

    // not open
    if (!isOpen) {
      dispatch({ type: "SHOW_POPUP", product: product.itemId });
    }

    // close
    else {
      dispatch({ type: "HIDE_POPUP" });
    }
  };

  return (
    <div className={classes.products}>
      <p className={classes.title1}>MADE THE HARD WAY</p>
      <p className={classes.title2}>TOP TRENDING PRODUCTS</p>
      <ul className={classes.list}>
        {data &&
          data != null &&
          data?.map((product, index) => {
            return (
              <li key={index}>
                <img
                  onClick={(event) => togglePopup(product, event)}
                  src={product.img}
                />
                <p className={classes.name}>{product.name}</p>
                <p className={classes.price}>{convert(product.price)}</p>
              </li>
            );
          })}
      </ul>
      {isOpen && (
        <Popup
          product={productPopup}
          handleClose={(event) => togglePopup(null, event)}
        />
      )}
    </div>
  );
};
export default ListProduct;
