import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../api/api";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

const HandleSuccessVNPay = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const searchParams = new URLSearchParams(document.location.search);
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (token) {
      axios
        .get(`${api}/public/users/orders/pay?orderId=${orderId}`)
        .then((res) => {
          alert("Payment Success");
          navigate("/history");
        })
        .catch((err) => {
          alert("Something wrong!");
        });
    }
    //
    else {
      const order = JSON.parse(Cookies.get("guest_order"));

      axios
        .post(`${api}/public/users/orders`, order)
        .then((res) => {
          alert("Order successful! Check your email!");

          Cookies.remove("_cart");
          dispatch({ type: "ADD_TO_CART", total: 0 });

          navigate("/");
        })
        .catch((err) => {
          if (err.response.data) alert(err.response.data);
          else alert("Order failed!");
        });
    }
  }, []);
};

export default HandleSuccessVNPay;
