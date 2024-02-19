import classes from "./ListCart.module.css";
import Table from "react-bootstrap/Table";
import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import useFetchToken from "../hook/useFetchToken";
import axios from "axios";
import { api } from "../../api/api";
import { convert } from "../../store/convert";
import Cookies from "js-cookie";
import Media from "react-media";
// arrow
const arrowRight = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="15"
    width="15"
    viewBox="0 0 448 512"
  >
    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
  </svg>
);

const arrowLeft = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="15"
    width="15"
    viewBox="0 0 448 512"
  >
    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
  </svg>
);
const gift = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="15"
    width="15"
    viewBox="0 0 512 512"
  >
    <path d="M190.5 68.8L225.3 128H224 152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H438.4c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40H288h-1.3l34.8-59.2C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40zM32 288V464c0 26.5 21.5 48 48 48H224V288H32zM288 512H432c26.5 0 48-21.5 48-48V288H288V512z" />
  </svg>
);

// tinh tong tien
const countTotal = (items) => {
  let result = 0;
  for (let i = 0; i < items.length; ++i) {
    result += Number(items[i].quantity) * Number(items[i].price);
  }

  return result;
};
// tinh lai tong tien khi co cap nhat
const updateTotal = (data, newQuantity, oldTotal) => {
  const diff =
    (Number(newQuantity) - Number(data.quantity)) * Number(data.price);

  return Number(oldTotal) + diff;
};
//
const ListCart = () => {
  const email = Cookies.get("email");
  const [total, setTotal] = useState("");
  const { data, loading, error } = useFetchToken(
    `${api}/users/carts?email=${email}`
  );

  const token = Cookies.get("token");
  const dispatch = useDispatch();

  // tinh tong
  useEffect(() => {
    if (data) setTotal(convert(String(countTotal(data))));

    dispatch({ type: "ADD_TO_CART", total: data.length });
  }, [data]);

  // bộ đếm thời gian: sau khi người dùng tăng giảm số lượng item
  // sẽ đợi 2 giây rồi mới update database, nếu trong 2 giây lại có thay đổi thì bỏ bộ đếm và đếm lại
  let countdownTimer;
  const handleUpdate = (cartId, newQuantity) => {
    // xoa bo dem truoc do
    clearTimeout(countdownTimer);
    // Bắt đầu đếm ngược mới sau 2 giây
    countdownTimer = setTimeout(() => {
      // Gọi hàm update sau khi đếm ngược hoàn tất
      updateProduct(cartId, newQuantity);
    }, 2000);
  };

  // update
  const updateProduct = async (cartId, newQuantity) => {
    const updateData = {
      cartId: cartId,
      count: newQuantity,
    };

    // DOM
    const index = data.findIndex((cart) => cart.cartId === cartId);
    const newTotal = updateTotal(data[index], newQuantity, countTotal(data));

    setTotal(convert(String(newTotal)));

    const fomrData = new FormData();
    fomrData.append("cartId", updateData.cartId);
    fomrData.append("count", updateData.count);

    axios.put(`${api}/users/carts/update`, fomrData, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  };

  // delete item
  const deleteProduct = async (cartId) => {
    try {
      let res = await axios.delete(
        `${api}/users/carts/delete?cartId=${cartId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (res) {
        dispatch({ type: "REMOVE_FROM_CART" });
        // DOM
        const index = data.findIndex((cart) => cart.cartId === cartId);
        data.splice(index, 1);
        setTotal(convert(String(countTotal(data))));
        // reFetch();
      }
    } catch (err) {
      alert("Something wrong!");
    }
  };

  const createTable = (
    <tbody>
      {data?.map((item, index) => {
        return (
          <CartItem
            item={item}
            key={index}
            index={index}
            update={handleUpdate}
            delete={deleteProduct}
          />
        );
      })}
    </tbody>
  );
  return (
    <React.Fragment>
      {data && data.length > 0 && (
        <div className={classes.container}>
          <div className={classes.list}>
            <div className={classes.title}>SHOPPING CART</div>
            <div className={classes.listData}>
              <Media
                queries={{
                  pc: "(min-width: 1025px)",
                  largeIpad: "(max-width: 1024px) and (min-width: 769px)",
                  smallIpad: "(max-width: 768px) and (min-width: 481px)",
                  tablet: "(max-width: 480px)",
                }}
              >
                {(matches) => (
                  <React.Fragment>
                    {matches.pc && (
                      <Table bordered striped>
                        <thead>
                          <tr>
                            <th>IMAGE</th>
                            <th>PRODUCT</th>
                            <th>GENDER</th>
                            <th>SIZE</th>
                            <th>COLOR</th>
                            <th>PRICE</th>
                            <th>QUANTITY</th>
                            <th>TOTAL</th>
                            <th>REMOVE</th>
                          </tr>
                        </thead>
                        {createTable}
                      </Table>
                    )}
                    {matches.largeIpad && (
                      <Table bordered striped>
                        <thead>
                          <tr>
                            <th>IMAGE</th>
                            <th>PRODUCT</th>
                            <th>PRICE</th>
                            <th>QUANTITY</th>
                            <th>TOTAL</th>
                            <th>REMOVE</th>
                          </tr>
                        </thead>
                        {createTable}
                      </Table>
                    )}
                    {matches.smallIpad && (
                      <Table bordered striped>
                        <thead>
                          <tr>
                            <th>IMAGE</th>
                            <th>PRODUCT</th>
                            <th>PRICE</th>
                            <th>QUANTITY</th>
                            <th>TOTAL</th>
                            <th>REMOVE</th>
                          </tr>
                        </thead>
                        {createTable}
                      </Table>
                    )}
                    {matches.tablet && (
                      <Table bordered striped>
                        <thead>
                          <tr>
                            <th>IMAGE</th>
                            <th className={classes.name}>PRODUCT</th>
                          </tr>
                        </thead>
                        {createTable}
                      </Table>
                    )}
                  </React.Fragment>
                )}
              </Media>
            </div>

            <div className={classes.option}>
              <div className={classes.left}>
                {arrowLeft}
                <Link to="/shop">Continue shopping</Link>
              </div>
              <div className={classes.right}>
                <Link to="/checkout">Proceed to checkout</Link>
                {arrowRight}
              </div>
            </div>
          </div>
          <div className={classes.total_count}>
            <div className={classes.title}>CART TOTAL</div>
            <div className={classes.total_sub}>
              <div>SUBTOTAL</div>
              <p>{total}</p>
            </div>
            <div className={classes.total}>
              <div>TOTAL</div>
              <p>{total}</p>
            </div>

            <input type="text" placeholder="Enter your coupon" />
            <button>
              <div>{gift} Apply coupon</div>
            </button>
          </div>
        </div>
      )}
      {data && data.length === 0 && (
        <div>
          No product...
          <div className={classes.option}>
            <div className={classes.left}>
              {arrowLeft}
              <Link to="/shop">Continue shopping</Link>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
export default ListCart;
