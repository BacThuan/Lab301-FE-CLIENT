import { useState, useEffect } from "react";
// email regex
const regex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// is email
const isEmail = (email) =>
  email !== undefined && regex.test(String(email).toLowerCase());
const errEmail = "Email is not valid!";

// is phone number
const isPhone = (value) =>
  value !== undefined && value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g);
const errPhone = "Phone number is not valid";

// is empty
const isEmpty = (value) => value !== undefined && value.trim() !== "";
const errString = "must not be empty!";

// is password
const isPass = (value) => value !== undefined && value.length > 8;
const errPass = "Password must have more than 8 characters!";

// the hook
const useInput = (type, defaultValue) => {
  const [enterValue, setValue] = useState(defaultValue ? defaultValue : "");
  const [isTouched, setTouched] = useState(false);
  const [errorMess, setError] = useState(null);
  const [validValue, setValid] = useState(false);
  const [hasError, setHasError] = useState(true);

  useEffect(() => {
    if (defaultValue !== "") setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const inputBlur = (event) => {
    setTouched(true);
  };

  const reset = () => {
    setValue("");
    setTouched(false);
  };

  // check input with check function and error message
  const checkInput = (checkfunction, errMess) => {
    const isValid = checkfunction(enterValue);

    // not valid value
    if (!isValid) {
      setValid(false);
      setError(errMess);
    }
    // valid
    else {
      setValid(true);
      setError("");
    }

    setHasError(!validValue && isTouched);
  };

  // check email
  const checkEmail = () => {
    checkInput(isEmail, errEmail);
  };

  // check string
  const checkString = () => {
    checkInput(isEmpty, errString);
  };

  // check pass
  const checkPass = () => {
    checkInput(isPass, errPass);
  };

  // check phone
  const checkPhone = () => {
    checkInput(isPhone, errPhone);
  };

  useEffect(() => {
    if (type === "email") {
      checkEmail();
    }

    // check string
    if (type === "string") {
      checkString();
    }

    // check pass
    if (type === "password") {
      checkPass();
    }

    // check phone
    if (type === "phone") {
      checkPhone();
    }
  }, [inputBlur]);

  return {
    value: enterValue,
    isValid: validValue,
    errorMess: errorMess,
    hasError,
    handleChange,
    inputBlur,
    reset,
  };
};
export default useInput;
