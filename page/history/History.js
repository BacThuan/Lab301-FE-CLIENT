import ListOrder from "../../component/list-order/ListOrder";

import Banner from "../../component/banner/Banner";
import { useNavigate } from "react-router-dom";
import classes from "./History.module.css";
import { useEffect } from "react";
import Cookies from "js-cookie";

const History = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  useEffect(() => {
    document.title = "Orders History";
    if (!token) navigate("/auth");
  }, []);
  return (
    <div className={classes.container}>
      <Banner title={"History"} />

      {token && (
        <div className={classes.order}>
          <ListOrder />
        </div>
      )}
    </div>
  );
};

export default History;
