import classes from "./DetailPage.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Product from "../../component/product-related/Product";
import { useNavigate } from "react-router-dom";
import useFetch from "../../component/hook/useFetch";
import axios from "axios";
import React from "react";
import { api } from "../../api/api";
import { convert, formatState } from "../../store/convert";
import { useInView } from "react-intersection-observer";
import Cookies from "js-cookie";
import Rating from "../../component/rating/Rating";
// decrement button
const left = (
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 256 512">
    <path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" />
  </svg>
);

// increment button
const right = (
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 256 512">
    <path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" />
  </svg>
);

const notLike = (
  <svg
    // class="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    height="2.5em"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.008 8.714c1-.097 1.96-.45 2.792-1.028a25.112 25.112 0 0 0 4.454-5.72 1.8 1.8 0 0 1 .654-.706 1.742 1.742 0 0 1 1.65-.098 1.82 1.82 0 0 1 .97 1.128c.075.248.097.51.065.767l-1.562 4.629M4.008 8.714H1v9.257c0 .273.106.535.294.728a.99.99 0 0 0 .709.301h1.002a.99.99 0 0 0 .71-.301c.187-.193.293-.455.293-.728V8.714Zm8.02-1.028h4.968c.322 0 .64.08.925.232.286.153.531.374.716.645a2.108 2.108 0 0 1 .242 1.883l-2.36 7.2c-.288.813-.48 1.354-1.884 1.354-2.59 0-5.39-1.06-7.504-1.66"
    />
  </svg>
);

const liked = (
  <svg
    // class="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 18 18"
    height="2.5em"
  >
    <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z" />
  </svg>
);
// chinh lai long desc
const longDesc = (string) => {
  return string !== undefined
    ? string.split("\n").filter((des) => des !== "")
    : [];
};

// page
const DetailPage = () => {
  const email = Cookies.get("email");
  const token = Cookies.get("token");
  let cart = Cookies.get("_cart");

  const [refRelatedPost, inView] = useInView({
    triggerOnce: true,
  });

  const navigate = useNavigate();
  const [value, setValue] = useState(1);

  const id = useParams();

  const { data, loading, error, reFetch } = useFetch(
    `${api}/public/products/details?productId=${id.idProduct}`
  );

  const [isGetRelated, setIsGetRelated] = useState(false);
  const [related, setRelated] = useState([]);

  const [primary, setPrimary] = useState(null);
  const [chose, setChosed] = useState(null);
  const [leftOver, setLeftOver] = useState(null);

  const [like, setLike] = useState(false);
  const [listLiked, setListLiked] = useState([]);

  const handleIncrement = () => {
    let temp = leftOver - 1;
    if (temp < 0) alert("Not enough products!");
    else {
      setValue((prevValue) => prevValue + 1);
      setLeftOver(temp);
    }
  };

  const handleDecrement = () => {
    if (value > 1) {
      setValue((prevValue) => prevValue - 1);
      setLeftOver(leftOver + 1);
    }
  };

  const handleChange = (e) => {
    let temp = e.target.value;
    if (temp > leftOver) alert("Not enough products!");
    else setValue(Number(e.target.value));
  };

  const handleChose = (item) => {
    setChosed(item);
    setPrimary(item.img);
    setLeftOver(item.quantity);
    setValue(1);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // submit
  const addToCart = async () => {
    if (token) {
      const fomrData = new FormData();
      fomrData.append("itemId", chose.id);
      fomrData.append("email", email);
      fomrData.append("count", value);
      try {
        let res = await axios.post(`${api}/users/carts/add`, fomrData, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (res) navigate("/cart");
      } catch (err) {
        alert("Something wrong!");
      }
    }
    //
    else {
      // navigate("/auth");

      if (cart === undefined) {
        cart = [];

        cart.push({
          id: chose.id,
          quantity: value,
        });

        Cookies.set("_cart", JSON.stringify(cart), {
          expires: 7,
        });
        navigate("/cart");
      }
      //
      else {
        cart = JSON.parse(cart);

        if (Array.isArray(cart)) {
          let index = cart.findIndex((value) => value.itemId === chose.id);
          if (index !== -1) {
            cart[index].count += Number(value);
          }

          //
          else {
            cart.push({
              id: chose.id,
              quantity: value,
            });
          }
        }
      }

      Cookies.set("_cart", JSON.stringify(cart), {
        expires: 7,
      });
      navigate("/cart");
    }
  };

  // check if data is object
  const checkData = () => {
    return typeof data === "object" && data !== null;
  };

  const handleLike = () => {
    if (!token) navigate("/auth");
    else {
      setLike(true);
      axios
        .post(
          `${api}/user/like?email=${email}&idProduct=${id.idProduct}`,
          null,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .catch((err) => alert("Something wrong"));
    }
  };

  const handleNotLike = () => {
    setLike(false);
    axios
      .post(
        `${api}/user/unlike?email=${email}&idProduct=${id.idProduct}`,
        null,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .catch((err) => alert("Something wrong"));
  };

  useEffect(() => {
    handleScrollToTop();

    if (token)
      axios
        .get(`${api}/user/get-list-likes?email=${email}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => setListLiked(res.data))
        .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let index = listLiked.findIndex((data) => data == id.idProduct);

    if (index !== -1) setLike(true);
    else setLike(false);
  }, [listLiked, id]);

  useEffect(() => {
    if (checkData()) {
      if (Array.isArray(data.items)) {
        setPrimary(data.items[0].img);
        setChosed(data.items[0]);
        setLeftOver(Number(data.items[0].quantity));
      }
    }
  }, [data, id]);

  useEffect(() => {
    reFetch();
    if (checkData()) {
      if (Array.isArray(data.items)) {
        setPrimary(data.items[0].img);
        setChosed(data.items[0]);
        setLeftOver(Number(data.items[0].quantity));
      }
    }
  }, [id]);

  useEffect(() => {
    const getRelatedProduct = async () => {
      if (!isGetRelated) {
        const res = await axios.get(
          `${api}/public/products/related?productId=${id.idProduct}`
        );
        setRelated(res.data);
      }
    };
    if (inView) {
      getRelatedProduct();
    }
  }, [inView, id]);

  return (
    <React.Fragment>
      {checkData() && (
        <div className={classes.container}>
          {/** intro for product */}
          <div className={classes.intro}>
            <div className={classes.img}>
              <div className={classes.normal}>
                {data.items?.map((item, index) => {
                  return (
                    <div key={index}>
                      {item.images.map((img, ind) => (
                        <img
                          key={ind}
                          src={img}
                          onClick={() => setPrimary(img)}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
              <div className={classes.primary}>
                <img src={primary} />
                <span>{formatState(chose?.state)}</span>
              </div>
            </div>

            <div className={classes.infor}>
              <p className={classes.name}>{data.name}</p>
              <p className={classes.price}>{convert(String(chose?.price))}</p>

              <div className={classes.choseInfo}>
                <div>
                  <p>
                    Brand: <span className={classes.des}>{data.brand}</span>
                  </p>
                  <p>
                    CATEGORY:{" "}
                    <span className={classes.des}>{data.category}</span>
                  </p>
                </div>
                <div>
                  <p>
                    Size: <span className={classes.des}>{chose?.size}</span>
                  </p>
                  <p>
                    Color: <span className={classes.des}>{chose?.color}</span>
                  </p>
                </div>
                <div>
                  <p>
                    Gender: <span className={classes.des}>{data.gender}</span>
                  </p>
                  <p>
                    Quantity: <span className={classes.des}>{leftOver}</span>
                  </p>
                </div>
              </div>

              <div className={classes.all_option}>
                {data.items?.map((item, index) => {
                  return (
                    <button
                      className={
                        item.id === chose?.id
                          ? classes.optionChosed
                          : classes.option
                      }
                      key={index}
                      onClick={() => handleChose(item)}
                    >
                      Option {index + 1}
                    </button>
                  );
                })}
              </div>

              <p className={classes.des}>{data.short_desc}</p>

              <div className={classes.form}>
                <span>QUANTITY </span>
                <button className={classes.handle} onClick={handleDecrement}>
                  {left}
                </button>
                <input
                  className={classes.input}
                  type="number"
                  min={1}
                  value={value}
                  onChange={handleChange}
                />
                <button className={classes.handle} onClick={handleIncrement}>
                  {right}
                </button>

                <button onClick={addToCart} className={classes.submit}>
                  Add To Cart
                </button>
              </div>
            </div>
          </div>

          {/** product description*/}
          <div className={classes.description}>
            <p className={classes.title}>DESCRIPTION</p>

            {!like && (
              <span className={classes.like} onClick={handleLike}>
                {notLike}
              </span>
            )}

            {like && (
              <span className={classes.like} onClick={handleNotLike}>
                {liked}
              </span>
            )}
            <p className={classes.title1}>PRODUCT DESCRIPTION</p>
            <ul>
              {longDesc(data.long_desc).map((des, index) => {
                return (
                  <li key={index}>
                    <p>{des}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/** product description*/}
          <div className={classes.description}>
            <p className={classes.title1}>PRODUCT REVIEW</p>
            <Rating id={id.idProduct} />
          </div>

          {/** related product */}
          <div className={classes.related}>
            <p className={classes.title1}>RELATED PRODUCT</p>
            <div ref={refRelatedPost}>
              <ul>
                {related.map((product, index) => {
                  return (
                    <li key={index} onClick={handleScrollToTop}>
                      <Product product={product} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default DetailPage;
