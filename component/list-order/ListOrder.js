import classes from "./ListOrder.module.css";
import Table from "react-bootstrap/Table";
import React, { useState } from "react";
import OrderItem from "./OrderItem";
import useFetchToken from "../../component/hook/useFetchToken";
import { api } from "../../api/api";
import Media from "react-media";
import Cookies from "js-cookie";
const ListOrder = () => {
  const email = Cookies.get("email");
  const { data, loading, error } = useFetchToken(
    `${api}/users/orders?email=${email}`
  );

  const getTable = (
    <tbody>
      {data?.map((order) => {
        return <OrderItem order={order} key={order.idOrder} />;
      })}
    </tbody>
  );
  return (
    <div className={classes.container}>
      <div className={classes.list}>
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
                <Table bordered striped>
                  <thead>
                    <tr>
                      <th>ID ORDER</th>
                      <th>ID USER</th>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>PHONE</th>
                      <th>ADDRESS</th>
                      <th>TOTAL</th>
                      <th>METHOD</th>
                      <th>ORDER DAY</th>
                      <th>DELIVERY</th>
                      <th>STATUS</th>
                      <th>DETAIL</th>
                    </tr>
                  </thead>
                  {getTable}
                </Table>
              )}

              {matches.largeIpad && (
                <Table bordered striped>
                  <thead>
                    <tr>
                      <th>ID ORDER</th>
                      <th>ID USER</th>
                      <th>NAME & EMAIL & ADDRESS</th>
                      <th>PHONE</th>
                      <th>TOTAL</th>
                      <th>METHOD</th>
                      <th>ORDER DAY</th>
                      <th>DELIVERY</th>
                      <th>STATUS</th>
                      <th>DETAIL</th>
                    </tr>
                  </thead>
                  {getTable}
                </Table>
              )}

              {matches.smallIpad && (
                <Table bordered striped>
                  <thead>
                    <tr>
                      <th>ID ORDER</th>
                      <th>ID USER</th>
                      <th>NAME & EMAIL & ADDRESS & PHONE</th>
                      <th>TOTAL & METHOD & ORDER DAY</th>
                      <th>DELIVERY</th>
                      <th>STATUS</th>
                      <th>DETAIL</th>
                    </tr>
                  </thead>
                  {getTable}
                </Table>
              )}

              {matches.tablet && (
                <Table bordered striped>
                  <thead>
                    <tr>
                      <th>INFORMATION</th>
                      <th>STATUS</th>
                      <th>DETAIL</th>
                    </tr>
                  </thead>
                  {getTable}
                </Table>
              )}

              {matches.iphone && (
                <Table bordered striped>
                  <thead>
                    <tr>
                      <th>INFORMATION</th>
                      <th>STATUS</th>
                      <th>DETAIL</th>
                    </tr>
                  </thead>
                  {getTable}
                </Table>
              )}
              {matches.smartPhone && (
                <Table bordered striped>
                  <thead>
                    <tr>
                      <th>INFORMATION</th>
                      <th>DETAIL</th>
                    </tr>
                  </thead>
                  {getTable}
                </Table>
              )}
            </React.Fragment>
          )}
        </Media>
      </div>
    </div>
  );
};
export default ListOrder;
