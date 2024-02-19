import { useEffect, useState } from "react";
import banner from "../../assets/banner/banner1.jpg";
import classes from "./AuthForm.module.css";
import useInput from "../../component/hook/use-input";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { api, apiAdmin } from "../../api/api";
import OAuth2Login from "react-simple-oauth2-login";
import { useGoogleLogin } from "@react-oauth/google";

// form
const AuthForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [typePassword, setTypePassword] = useState("password");

  // state for login
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
    value: password,
    isValid: validPass,
    errorMess: errPass,
    hasError: errorPass,
    handleChange: handleChangePass,
    inputBlur: blurPass,
    reset: resetPass,
  } = useInput("password");

  const {
    value: name,
    isValid: validName,
    errorMess: errName,
    hasError: errorName,
    handleChange: handleChangeName,
    inputBlur: blurName,
    reset: resetName,
  } = useInput("string");

  const {
    value: phone,
    isValid: validPhone,
    errorMess: errPhone,
    hasError: errorPhone,
    handleChange: handleChangePhone,
    inputBlur: blurPhone,
    reset: resetPhone,
  } = useInput("phone");

  // switch mode
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    resetEmail();
    resetPass();
    resetName();
    resetPhone();
    setMessErr(null);
  };

  // valid form
  let formValid = false;

  // login
  if (isLogin) {
    if (validEmail && validPass) formValid = true;
    else formValid = false;
  }

  // sign in
  else {
    if (validName && validEmail && validPass && validPhone) formValid = true;
    else formValid = false;
  }

  useEffect(() => {
    document.title = "Login Page";
  });

  // handle login data
  const handleLoginData = (data) => {
    dispatch({
      type: "LOGIN",

      token: data.token,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      cartItems: data.cartItems,
    });
  };

  // submit
  const handlerSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    if (!isLogin) {
      user.name = name;
      user.phone = phone;
    }

    // login
    if (isLogin) {
      try {
        const res = await axios.post(api + "/login", user);
        const data = res.data;
        handleLoginData(data);

        navigate("/");
      } catch (err) {
        console.log(err);
        if (err.response.status == 400)
          setMessErr("Invalid email or password!");
        else setMessErr(err.response.data);
        // setMessErr(err.response.data.message);
      }
    }

    // sign up
    else {
      try {
        const res = await axios.post(api + "/register", user);
        switchAuthModeHandler();

        if (res.data.used === undefined) {
          alert(
            "We sent an email to active your account! Check your email and active your account."
          );
        }
      } catch (err) {
        console.log(err);
        // setMessErr(err.response.data);
        // setMessErr(err.response.data.message);
      }
    }
  };

  // oauth
  // google login
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      const data = userInfo.data; // email + name

      try {
        const response = await axios.post(api + "/oauth/login", {
          type: 2,
          email: data.email,
          name: data.name,
        });

        handleLoginData(response.data);
        navigate("/");
      } catch (err) {
        console.log(err);
        // setMessErr(err.response.data);
        // setMessErr(err.response.data.message);
      }
    },
    onError: (codeResponse) => {
      setMessErr("Some thing wrong with your account. Try to login again!");
    },
  });

  // facebook login
  const onSuccess = async (res) => {
    const accessToken = res.access_token;
    const result = await axios(
      `https://graph.facebook.com/me?fields=name,email&access_token=${accessToken}`
    );

    const data = result.data; // email + name
    try {
      const response = await axios.post(api + "/oauth/login", {
        type: 1,
        email: data.email,
        name: data.name,
      });

      handleLoginData(response.data);
      navigate("/");
    } catch (err) {
      setMessErr(err.response.data);
      // setMessErr(err.response.data.message);
    }
  };
  const onFailure = (response) => {
    setMessErr("Some thing wrong with your account. Try to login again!");
  };

  return (
    <div className={classes.container}>
      <img className={classes.img} src={banner}></img>
      <section className={classes.auth}>
        <h1>{isLogin ? "Sign in" : "Sign Up"}</h1>
        <form onSubmit={handlerSubmit}>
          {!isLogin && (
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
          )}
          <div className={classes.control}>
            <input
              type="text"
              id="email"
              onChange={handleChangeEmail}
              placeholder="Email"
              onBlur={blurEmail}
              value={email}
            />
            {errorEmail && <p className={classes.error}>{errEmail}</p>}
          </div>
          <div className={classes.control}>
            <input
              type={typePassword}
              id="password"
              onChange={handleChangePass}
              placeholder="Password"
              onBlur={blurPass}
              value={password}
            />
            {errorPass && <p className={classes.error}>{errPass}</p>}
          </div>

          {!isLogin && (
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
          )}

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
              {isLogin ? "SIGN IN" : "SIGN UP"}
            </button>
            <div>
              <span>
                {isLogin ? "Create an account?" : "You had an account?"}
              </span>
              <button
                type="button"
                className={classes.toggle}
                onClick={switchAuthModeHandler}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>

            {isLogin && (
              <div>
                <span>Forgot your password?</span>
                <Link
                  to="/auth/forgetPassword"
                  className={classes.toggle}
                  href={apiAdmin}
                >
                  Click here
                </Link>
              </div>
            )}

            {isLogin && (
              <div>
                <span>You are Admin?</span>
                <a className={classes.toggle} href={apiAdmin}>
                  Sign in
                </a>
              </div>
            )}
          </div>
        </form>
        {isLogin && (
          <button
            className={classes["login-with-google-btn"]}
            onClick={loginWithGoogle}
          >
            Sign In With Google
          </button>
        )}

        {isLogin && (
          <OAuth2Login
            className={classes["login-with-facebook-btn"]}
            authorizationUrl="https://www.facebook.com/dialog/oauth"
            responseType="token"
            clientId={process.env.REACT_APP_FACEBOOK_ID}
            redirectUri={process.env.REACT_APP_API_CLIENT}
            scope="email"
            onSuccess={onSuccess}
            onFailure={onFailure}
          >
            Sign In With Facebook
          </OAuth2Login>
        )}
      </section>
    </div>
  );
};

export default AuthForm;
