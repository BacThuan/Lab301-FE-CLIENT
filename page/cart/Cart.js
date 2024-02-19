import classes from "./Cart.module.css";
import Banner from "../../component/banner/Banner";
import ListCart from "../../component/list-cart/ListCart";
import ListTempCart from "../../component/list-cart/ListTempCart";
import { useEffect } from "react";
import Cookies from "js-cookie";

const Cart = () => {
  const token = Cookies.get("token");
  useEffect(() => {
    document.title = "Cart";
  }, []);
  return (
    <div className={classes.container}>
      <Banner title={"Cart"} />

      <div className={classes.cart}>
        {token && <ListCart />}
        {!token && <ListTempCart />}
      </div>
    </div>
  );
};
export default Cart;
