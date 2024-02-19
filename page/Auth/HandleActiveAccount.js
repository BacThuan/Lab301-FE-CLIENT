import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../api/api";
const HandleActiveAccount = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(document.location.search);

  const email = searchParams.get("email");

  useEffect(() => {
    axios
      .post(api + "/activeAccount", { email: email })
      .then(() => {
        alert("Your Account has been actived. You can log in now.");
        navigate("/");
      })
      .catch(() => {
        navigate("/err");
      });
  }, []);
};

export default HandleActiveAccount;
