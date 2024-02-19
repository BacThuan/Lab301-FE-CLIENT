import classes from "./ListLiked.module.css";
import Table from "react-bootstrap/Table";
import React, { useEffect, useState } from "react";
import LikedItem from "./LikedItem";
import useFetchToken from "../hook/useFetchToken";
import { api } from "../../api/api";
import Media from "react-media";
import Cookies from "js-cookie";
import axios from "axios";
const ListLiked = () => {
  const email = Cookies.get("email");
  const token = Cookies.get("token");
  const [list, setList] = useState([]);
  const { data, loading, error } = useFetchToken(
    `${api}/user/get-likes-data?email=${email}`
  );

  useEffect(() => {
    setList(data);
  }, [data]);

  const unlike = (id) => {
    axios
      .post(`${api}/user/unlike?email=${email}&idProduct=${id}`, null, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .catch((err) => alert("Something wrong"));
  };

  const getTable = (
    <tbody>
      {list?.map((product, index) => {
        return <LikedItem product={product} key={index} unlike={unlike} />;
      })}
    </tbody>
  );

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <Media
          queries={{
            smallIpad: "(min-width: 481px)",
            tablet: "(max-width: 480px) and (min-width: 321px)",
            iphone: "(max-width: 320px) and (min-width: 241px)",
            smartPhone: "(max-width: 240px)",
          }}
        >
          {(matches) => (
            <React.Fragment>
              {matches.smallIpad && (
                <Table bordered striped>
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>GENDER</th>
                      <th>BRAND</th>
                      <th>CATEGORY</th>
                      <th>OPTIONS</th>
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
                      <th>NAME & GENDER</th>
                      <th>BRAND</th>
                      <th>CATEGORY</th>
                      <th>OPTIONS</th>
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
                      <th>OPTIONS</th>
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
export default ListLiked;
