import classes from "./OrderItem.module.css";
import { Link, useNavigate } from "react-router-dom";
import { convert, formatDate, formatState } from "../../store/convert";
import Media from "react-media";
import React from "react";
import Cookies from "js-cookie";
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

const OrderItem = (props) => {
  const order = props.order;
  const navigate = useNavigate();

  const setOrder = () => {
    Cookies.set("order", JSON.stringify(order));
  };
  const linkView = (
    <div className={classes.button}>
      <Link to={`/history/${order.idOrder}`} onClick={setOrder}>
        View
      </Link>
      {arrowRight}
    </div>
  );

  const toPayment = () => {
    setOrder();
    navigate(`/history/pay/${order.idOrder}`);
  };
  const paidOrNot =
    order.payment === "PAYMENT_UNPAID" && order.method === "Credit card" ? (
      <div className={classes.button}>
        <Link onClick={toPayment}>PAY</Link>
      </div>
    ) : null;

  return (
    <Media
      queries={{
        pc: "(min-width: 1025px)",
        largeIpad: "(max-width: 1024px) and (min-width: 769px)",
        smallIpad: "(max-width: 768px) and (min-width: 481px)",
        tablet: "(max-width: 480px) and (min-width: 321px)",
        iphone: "(max-width: 320px) and (min-width: 241px)",
        smartPhone: "(max-width: 240px)",
      }}
    >
      {(matches) => (
        <React.Fragment>
          {matches.pc && (
            <tr className={classes.tr}>
              <td>{order.idOrder}</td>
              <td>{order.idUser}</td>
              <td>{order.name}</td>
              <td>{order.email}</td>
              <td>{order.phone}</td>
              <td>{order.address}</td>

              <td>{convert(String(order.total))}</td>
              <td>{order.method}</td>
              <td>{formatDate(order.orderDay)}</td>
              <td>{formatState(order.delivery)}</td>
              <td>{formatState(order.payment)}</td>
              <td className={classes.action}>
                {linkView}

                {paidOrNot}
              </td>
            </tr>
          )}

          {matches.largeIpad && (
            <tr className={classes.tr}>
              <td>{order.idOrder}</td>
              <td>{order.idUser}</td>
              <td>
                <p>{order.name}</p>

                <p>{order.email}</p>

                <p>{order.address}</p>
              </td>
              <td>{order.phone}</td>

              <td>{convert(String(order.total))}</td>
              <td>{order.method}</td>
              <td>{formatDate(order.orderDay)}</td>
              <td>{formatState(order.delivery)}</td>
              <td>{formatState(order.payment)}</td>
              <td className={classes.action}>
                <div>
                  {linkView}
                  {paidOrNot}
                </div>
              </td>
            </tr>
          )}
          {matches.smallIpad && (
            <tr className={classes.tr}>
              <td>{order.idOrder}</td>
              <td>{order.idUser}</td>
              <td>
                <p>{order.name}</p>

                <p>{order.email}</p>

                <p>{order.address}</p>

                <p>{order.phone}</p>
              </td>

              <td>
                <p>{convert(String(order.total))}</p>

                <p>{order.method}</p>

                <p>{formatDate(order.orderDay)}</p>
              </td>

              <td>{formatState(order.delivery)}</td>
              <td>{formatState(order.payment)}</td>
              <td className={classes.action}>
                <div>
                  {linkView}
                  {paidOrNot}
                </div>
              </td>
            </tr>
          )}

          {matches.tablet && (
            <tr className={classes.tr}>
              <td>
                <p>Id order: {order.idOrder}</p>
                <p>Email: {order.email}</p>
                <p>Total: {convert(String(order.total))}</p>

                <p>Day: {formatDate(order.orderDay)}</p>
              </td>

              <td>
                <p>Delivery: {formatState(order.delivery)}</p>

                <p>Payment: {formatState(order.payment)}</p>
              </td>
              <td className={classes.action}>
                <div>
                  {linkView}
                  {paidOrNot}
                </div>
              </td>
            </tr>
          )}

          {matches.iphone && (
            <tr className={classes.tr}>
              <td>
                <p>Id order: {order.idOrder}</p>

                <p>Day: {formatDate(order.orderDay)}</p>
              </td>

              <td>
                <p>Delivery: {formatState(order.delivery)}</p>

                <p>Payment: {formatState(order.payment)}</p>
              </td>
              <td className={classes.action}>
                <div>
                  {linkView}
                  {paidOrNot}
                </div>
              </td>
            </tr>
          )}
          {matches.smartPhone && (
            <tr className={classes.tr}>
              <td>
                <p>Id order: {order.idOrder}</p>

                <p>Day: {formatDate(order.orderDay)}</p>
                <p>Delivery: {formatState(order.delivery)}</p>

                <p>Payment: {formatState(order.payment)}</p>
              </td>

              <td className={classes.action}>
                <div>
                  {linkView}
                  {paidOrNot}
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      )}
    </Media>
  );
};
export default OrderItem;
