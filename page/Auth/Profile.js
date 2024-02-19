import { useEffect, useState } from "react";
import banner from "../../assets/banner/banner1.jpg";
import classes from "./AuthForm.module.css";
import useInput from "../../component/hook/use-input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { api } from "../../api/api";

import useFetchToken from "../../component/hook/useFetchToken";
import Cookies from "js-cookie";
// form
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const email = Cookies.get("email");
  const { data, loading, error } = useFetchToken(
    `${api}/users/profile?email=${email}`
  );

  // state for login
  const [messErr, setMessErr] = useState("");

  const {
    value: name,
    isValid: validName,
    errorMess: errName,
    hasError: errorName,
    handleChange: handleChangeName,
    inputBlur: blurName,
    reset: resetName,
  } = useInput("string", data?.name);

  const {
    value: phone,
    isValid: validPhone,
    errorMess: errPhone,
    hasError: errorPhone,
    handleChange: handleChangePhone,
    inputBlur: blurPhone,
    reset: resetPhone,
  } = useInput("phone", data?.phone);

  // valid form
  let formValid = false;

  if (validName && validPhone) formValid = true;
  else formValid = false;

  useEffect(() => {
    document.title = "Login Page";
  });

  // handle login data
  const handleUpdateData = () => {
    dispatch({
      type: "UPDATE_PROFILE",
      name: name,
      phone: phone,
    });
  };

  // submit
  const handlerSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: email,
      name: name,
      phone: phone,
    };

    try {
      await axios.post(api + "/users/update-profile", user, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      handleUpdateData();
      navigate("/");
    } catch (err) {
      console.log(err);
      // setMessErr(err.response.data);
    }
  };

  return (
    <div className={classes.container}>
      <img className={classes.img} src={banner}></img>
      <section className={classes.auth}>
        <h1>Update Profile</h1>
        <form onSubmit={handlerSubmit}>
          <div className={classes.control}>
            <input type="text" id="email" value={email} readOnly={true} />
          </div>

          <div className={classes.control}>
            <input
              type="text"
              id="name"
              onChange={handleChangeName}
              placeholder="Full Name"
              onBlur={blurName}
              value={name}
            />
            {errorName && <p className={classes.error}>Name {errName}</p>}
          </div>

          <div className={classes.control}>
            <input
              type="text"
              id="phone"
              onChange={handleChangePhone}
              placeholder="Phone"
              onBlur={blurPhone}
              value={phone}
            />
            {errorPhone && <p className={classes.error}>{errPhone}</p>}
          </div>

          <div className={classes.actions}>
            {messErr && <p className={classes.error}>{messErr}</p>}
            <button
              disabled={!formValid}
              className={classes.submit}
              type="submit"
            >
              Update Profile
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Profile;
