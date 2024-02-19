import { useState, useEffect } from "react";
import banner from "../../assets/banner/banner1.jpg";
import classes from "./Payment.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../api/api";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useParams } from "react-router-dom";

import { vndToUsd } from "../../store/convert";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
// form
const GuestPayment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order = JSON.parse(Cookies.get("guest_order"));

  const handleSuccess = async () => {
    try {
      let res = await axios.post(`${api}/public/users/orders`, order);
      if (res) {
        alert("Order successful! Check your email!");

        Cookies.remove("_cart");
        dispatch({ type: "ADD_TO_CART", total: 0 });

        navigate("/");
      }
    } catch (err) {
      if (err.response.data) alert(err.response.data);
      else alert("Order failed!");
    }
  };

  const handleVNPay = () => {
    axios
      .get(`${api}/public/users/orders/createVNPay?amount=${order.total}`)
      .then((res) => {
        const url = res.data;
        window.location.href = url;
        // window.open(url, "_blank");
      })
      .catch((err) => {
        alert("Something wrong!");
      });
  };
  return (
    <div className={classes.container}>
      <img className={classes.img} src={banner}></img>

      <section className={classes.card}>
        <h1>Online Payment</h1>
        <PayPalScriptProvider>
          <PayPalButtons
            createOrder={(datas, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: "Pay order of " + order.email,
                    amount: {
                      currency_code: "USD",
                      value: vndToUsd(order.total),
                    },
                  },
                ],
              });
            }}
            onApprove={async (datas, actions) => {
              const order = await actions.order.capture();

              handleSuccess();
            }}
            onCancel={() => {}}
            onError={(err) => {
              alert("PayPal transaction fail!");
              console.log(err);
            }}
          />
        </PayPalScriptProvider>

        <h3>Or</h3>
        <div className={classes["vnpay-button"]} onClick={handleVNPay}>
          <div className={classes.bg_vnp}></div>
          <button>VNPAY Payment</button>
        </div>
      </section>
    </div>
  );
};

export default GuestPayment;
