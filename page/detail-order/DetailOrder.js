import classes from "./DetailOrder.module.css";
import { useParams } from "react-router-dom";
import useFetchToken from "../../component/hook/useFetchToken";
import Table from "react-bootstrap/Table";
import React from "react";
import { api } from "../../api/api";
import { convert, formatDate, formatState } from "../../store/convert";
import Media from "react-media";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
// page
const DetailOrder = () => {
  const navigate = useNavigate();
  const id = useParams();
  const { data, loading, error } = useFetchToken(
    `${api}/users/orders/detail?orderId=${id.idOrder}`
  );

  const toPayment = () => {
    navigate(`/history/pay/${id.idOrder}`);
  };

  const paidOrNot =
    data.payment === "PAYMENT_UNPAID" && data.method === "Credit card" ? (
      <div className={classes.button}>
        <Link onClick={toPayment}>PAY</Link>
      </div>
    ) : null;

  return (
    <React.Fragment>
      {data && (
        <div className={classes.container}>
          <h1>ORDER'S INFORMATION</h1>
          <p>ID Account: {data.idUser}</p>
          <p>Name: {data.name}</p>
          <p>Email: {data.email}</p>
          <p>Phone: {data.phone}</p>
          <p>Address: {data.address}</p>
          <p>Method: {data.method}</p>
          <p>Order's Day: {formatDate(data.orderDay)}</p>
          <p>Total: {convert(String(data.total))}</p>
          <p>Payment Status: {formatState(data.payment)}</p>
          <p>Delivery Status: {formatState(data.delivery)}</p>
          {paidOrNot}
          <div className={classes.table}>
            <Media
              queries={{
                pc: "(min-width: 481px)",
                normal: "(max-width: 480px)",
              }}
            >
              {(matches) => (
                <React.Fragment>
                  {matches.pc && (
                    <Table striped size="sm">
                      <thead>
                        <tr>
                          <th>ID ITEM</th>
                          <th>IMAGE</th>
                          <th>NAME</th>
                          <th>COLOR</th>
                          <th>SIZE</th>
                          <th>GENDER</th>
                          <th>QUANTITY</th>
                          <th>PRICE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.orderData?.map((item, index) => {
                          return (
                            <tr className={classes.tr} key={item.idItem}>
                              <td>{item.idItem}</td>
                              <td>
                                <img className={classes.img} src={item.img} />
                              </td>
                              <td>{item.name}</td>
                              <td>{item.color}</td>
                              <td>{item.size}</td>
                              <td>{item.gender}</td>
                              <td>{item.quantity}</td>
                              <td>{convert(String(item.price))}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                  {matches.normal && (
                    <Table striped size="sm">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>IMAGE</th>
                          <th>NAME</th>
                          <th>PRICE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.orderData?.map((item, index) => {
                          return (
                            <tr className={classes.tr} key={item.idItem}>
                              <td>{item.idItem}</td>
                              <td>
                                <img className={classes.img} src={item.img} />
                              </td>
                              <td>
                                <p>{item.name}</p>
                                <p>
                                  Gender: {item.gender}, Size: {item.size},
                                  Color: {item.color}
                                </p>
                              </td>

                              <td>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: {convert(String(item.price))}</p>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </React.Fragment>
              )}
            </Media>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default DetailOrder;
