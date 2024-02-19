import classes from "./CartItem.module.css";
import React, { useState, useEffect } from "react";
import { convert } from "../../store/convert";
import Media from "react-media";
import Cookies from "js-cookie";
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

const trash = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="15"
    width="15"
    viewBox="0 0 448 512"
  >
    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
  </svg>
);

// tinh tong tien
const countTotal = (price, quantity) => {
  const toNumber = Number(price);
  const quan = Number(quantity);
  const total = toNumber * quan;
  return total;
};

const CartItem = (props) => {
  const item = props.item;
  const token = Cookies.get("token");
  const [value, setValue] = useState(0);
  const [total, setTotal] = useState(0);
  const [leftOver, setLeftOver] = useState(0);
  let id;

  if (token) id = item.cartId;
  else id = props.index;

  useEffect(() => {
    if (item.quantity > item.itemsLeft) {
      setValue(1);
      setTotal(countTotal(item.price, 1));
      setLeftOver(item.itemsLeft);

      props.alert(id);
      setTimeout(() => {
        alert(
          `You ordered ${item.quantity} ${item.name}. We only have ${item.itemsLeft} left`
        );
      }, 1000);
    }
    //
    else {
      setValue(item.quantity);
      setTotal(countTotal(item.price, item.quantity));
      setLeftOver(item.itemsLeft);
    }
  }, [item]);

  const handleIncrement = (e) => {
    let temp = leftOver - 1;
    if (temp < 0) {
      alert("Not enough products!");
    }
    //
    else {
      setValue((value) => value + 1);
      setTotal(countTotal(item.price, value + 1));
      setLeftOver(temp);
      props.update(id, value + 1);
    }
  };

  const handleDecrement = (e) => {
    if (value > 1) {
      setValue((value) => value - 1);
      setTotal(countTotal(item.price, value - 1));
      setLeftOver(leftOver + 1);
      props.update(id, value - 1);
    }
  };

  const handleChange = (e) => {
    let tempValue = e.target.value;
    if (tempValue > leftOver) alert("Not enough products!");
    else if (tempValue !== 0) {
      setValue(Number(tempValue));
      setTotal(countTotal(item.price, tempValue));
      props.update(id, tempValue);
    }
  };

  const deleteItem = () => {
    props.delete(id);
  };

  return (
    <Media
      queries={{
        pc: "(min-width: 1025px)",
        largeIpad: "(max-width: 1024px) and (min-width: 769px)",
        smallIpad: "(max-width: 768px) and (min-width: 481px)",
        tablet: "(max-width: 480px)",
      }}
    >
      {(matches) => (
        <React.Fragment>
          {matches.pc && (
            <tr className={classes.tr}>
              <td>
                <img src={item.img} />
              </td>
              <td className={classes.name}>{item.name}</td>
              <td className={classes.name}>{item.gender}</td>
              <td className={classes.name}>{item.size}</td>

              <td className={classes.name}>{item.color}</td>
              <td className={classes.price}>{convert(String(item.price))}</td>

              <td>
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
              </td>
              <td className={classes.price}>{convert(String(total))}</td>
              <td className={classes.trash} onClick={deleteItem}>
                {trash}
              </td>
            </tr>
          )}
          {matches.largeIpad && (
            <tr className={classes.tr}>
              <td>
                <img src={item.img} />
              </td>
              <td className={classes.name}>
                <p>{item.name}</p>
                <p>{item.gender}</p>
                <p>Size: {item.size}</p>
                <p>{item.color}</p>
              </td>

              <td className={classes.price}>{convert(String(item.price))}</td>

              <td>
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
              </td>
              <td className={classes.price}>{convert(String(total))}</td>
              <td className={classes.trash} onClick={deleteItem}>
                {trash}
              </td>
            </tr>
          )}
          {matches.smallIpad && (
            <tr className={classes.tr}>
              <td>
                <img src={item.img} />
              </td>
              <td className={classes.name}>
                <p>{item.name}</p>
                <p>{item.gender}</p>
                <p>Size: {item.size}</p>
                <p>{item.color}</p>
              </td>

              <td className={classes.price}>{convert(String(item.price))}</td>

              <td>
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
              </td>
              <td className={classes.price}>{convert(String(total))}</td>
              <td className={classes.trash} onClick={deleteItem}>
                {trash}
              </td>
            </tr>
          )}
          {matches.tablet && (
            <tr className={classes.tr}>
              <td>
                <img src={item.img} />
              </td>
              <td className={classes.name}>
                <div>
                  <p>{item.name}</p>
                  <p>
                    Gender: {item.gender}, Size: {item.size}, Color:{" "}
                    {item.color}
                  </p>
                </div>

                <div>
                  <div>
                    <button
                      className={classes.handle}
                      onClick={handleDecrement}
                    >
                      {left}
                    </button>
                    <input
                      className={classes.input}
                      type="number"
                      min={1}
                      value={value}
                      onChange={handleChange}
                    />
                    <button
                      className={classes.handle}
                      onClick={handleIncrement}
                    >
                      {right}
                    </button>{" "}
                    <span>{convert(String(total))}</span>
                  </div>

                  <br></br>
                  <div className={classes.trash} onClick={deleteItem}>
                    {trash}
                  </div>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      )}
    </Media>
  );
};
export default CartItem;
