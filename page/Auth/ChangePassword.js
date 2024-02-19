import { useState, useEffect } from "react";
import banner from "../../assets/banner/banner1.jpg";
import classes from "./AuthForm.module.css";
import useInput from "../../component/hook/use-input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../api/api";
import Cookies from "js-cookie";
// form
const ChangePassword = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [typePassword, setTypePassword] = useState("password");
  const [messErr, setMessErr] = useState("");

  const {
    value: oldPassword,
    isValid: validOldPass,
    errorMess: errOldPass,
    hasError: hasErrorOldPass,
    handleChange: handleChangeOldPass,
    inputBlur: blurOldPass,
    reset: resetOldPass,
  } = useInput("password");

  const {
    value: newPassword,
    isValid: validNewPass,
    errorMess: errNewPass,
    hasError: hasErrorNewPass,
    handleChange: handleChangeNewPass,
    inputBlur: blurNewPass,
    reset: resetNewPass,
  } = useInput("password");

  const {
    value: retypePassword,
    isValid: validRetypePass,
    errorMess: errRetypePass,
    hasError: hasErrorRetypePass,
    handleChange: handleChangeRetypePass,
    inputBlur: blurRetypePass,
    reset: resetRetypePass,
  } = useInput("password");

  // valid form
  let formValid = false;

  if (validOldPass && validNewPass && validRetypePass) formValid = true;
  else formValid = false;

  useEffect(() => {
    document.title = "Change Password";
  });

  // submit
  const handlerSubmit = async (e) => {
    e.preventDefault();

    try {
      if (newPassword !== retypePassword) {
        setMessErr("New password and retype password must be the same!");
      }
      //
      else if (oldPassword === newPassword) {
        setMessErr("New password and old password must not be the same!");
      }
      //
      else {
        if (window.confirm("Are you sure want to change your password?")) {
          const data = {
            oldPassword: oldPassword,
            newPassword: newPassword,
            retypePassword: retypePassword,
          };

          await axios.post(api + "/changePassword", data, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          alert("Chang password success!");
          navigate("/");
        }
      }
    } catch (err) {
      setMessErr(err.response.data);

      // setMessErr(err.response.data.message);
    }
  };

  return (
    <div className={classes.container}>
      <img className={classes.img} src={banner}></img>
      <section className={classes.auth}>
        <h1>Change Password</h1>
        <form onSubmit={handlerSubmit}>
          <div className={classes.control}>
            <input
              type={typePassword}
              id="old-password"
              onChange={handleChangeOldPass}
              placeholder="Your Old Password"
              onBlur={blurOldPass}
              value={oldPassword}
            />
            {hasErrorOldPass && <p className={classes.error}>{errOldPass}</p>}
          </div>

          <div className={classes.control}>
            <input
              type={typePassword}
              id="new-password"
              onChange={handleChangeNewPass}
              placeholder="Your New Password"
              onBlur={blurNewPass}
              value={newPassword}
            />
            {hasErrorNewPass && <p className={classes.error}>{errNewPass}</p>}
          </div>
          <div className={classes.control}>
            <input
              type={typePassword}
              id="retype-password"
              onChange={handleChangeRetypePass}
              placeholder="Type Again New Password"
              onBlur={blurRetypePass}
              value={retypePassword}
            />
            {hasErrorRetypePass && (
              <p className={classes.error}>{errRetypePass}</p>
            )}
          </div>
          <div className={classes.showPassword}>
            <input
              id="check"
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setTypePassword("text");
                } else {
                  setTypePassword("password");
                }
              }}
            />
            <label for="check">Show Password</label>
          </div>

          <div className={classes.actions}>
            {messErr && <p className={classes.error}>{messErr}</p>}
            <button
              disabled={!formValid}
              className={classes.submit}
              type="submit"
            >
              Change Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ChangePassword;
