import { useState, useEffect } from "react";
import banner from "../../assets/banner/banner1.jpg";
import classes from "./AuthForm.module.css";
import useInput from "../../component/hook/use-input";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { api, apiAdmin } from "../../api/api";
var bcrypt = require("bcryptjs");
// form
const ForgetPassword = () => {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [createNewPassword, setCreateNewPassword] = useState(false);

  const [verifyCode, setVerifyCode] = useState(null);

  const [typePassword, setTypePassword] = useState("password");

  const [messErr, setMessErr] = useState("");

  const {
    value: email,
    isValid: validEmail,
    errorMess: errEmail,
    hasError: errorEmail,
    handleChange: handleChangeEmail,
    inputBlur: blurEmail,
    reset: resetEmail,
  } = useInput("email");

  const {
    value: code,
    isValid: validCode,
    errorMess: errCodeMess,
    hasError: errorCode,
    handleChange: handleChangeCode,
    inputBlur: blurCode,
    reset: resetCode,
  } = useInput("string");

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

  if (validEmail || validCode) formValid = true;
  else formValid = false;

  useEffect(() => {
    document.title = "Forget Password";
  });
  // submit
  const handlerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!verified) {
        const res = await axios.post(api + "/verifyEmail", { email: email });

        setVerified(true);
        setVerifyCode(res.data);
        setMessErr("We sent a vertify code to your eamil. Type it here!");
      }
      //
      else if (verified && !createNewPassword) {
        const validCode = await bcrypt.compare(code, verifyCode);
        if (!validCode) {
          setMessErr("Invalid vertify code!");
        }
        //
        else {
          setMessErr("");
          setCreateNewPassword(true);
        }
      }
      //
      else {
        if (newPassword !== retypePassword) {
          setMessErr("New password and retype password must be the same!");
        }
        //
        else if (window.confirm("Are you sure want to craete new password?")) {
          const data = {
            email: email,
            newPassword: newPassword,
            retypePassword: retypePassword,
          };

          await axios.post(api + "/createNewPassword", data);

          alert("Create password success!");
          navigate("/auth");
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
              type="text"
              id="email"
              onChange={handleChangeEmail}
              placeholder="Email"
              onBlur={blurEmail}
              value={email}
              readOnly={verified}
            />
            {errorEmail && <p className={classes.error}>{errEmail}</p>}
          </div>
          {verified && (
            <div className={classes.control}>
              <input
                type="text"
                id="code"
                onChange={handleChangeCode}
                placeholder="Type your vertify code"
                onBlur={blurCode}
                value={code}
                readOnly={createNewPassword}
              />
              {errorCode && <p className={classes.error}>Code {errCodeMess}</p>}
            </div>
          )}

          {createNewPassword && (
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
          )}

          {createNewPassword && (
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
          )}

          {createNewPassword && (
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
          )}

          <div className={classes.actions}>
            {messErr && <p className={classes.error}>{messErr}</p>}
            {!verified && (
              <button
                disabled={!formValid}
                className={classes.submit}
                type="submit"
              >
                Change Password
              </button>
            )}

            {verified && !createNewPassword && (
              <button
                disabled={!formValid}
                className={classes.submit}
                type="submit"
              >
                Verify
              </button>
            )}

            {createNewPassword && (
              <button
                disabled={!formValid}
                className={classes.submit}
                type="submit"
              >
                Create new password
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
};

export default ForgetPassword;
