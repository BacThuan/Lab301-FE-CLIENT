import classes from "./Filter.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { api } from "../../api/api";

const Filter = () => {
  const filterDefault = useSelector((state) => state.filter);
  const [optionFilter, setOptionFilter] = useState(filterDefault);

  const [brands, setBrand] = useState([]);
  const [categories, setCategory] = useState([]);
  const [colors, setColor] = useState([]);

  const dispatch = useDispatch();

  const getBrands = async () => {
    const brands = await axios.get(`${api}/public/brands/getAll`);

    setBrand(brands.data);
  };

  const getCategories = async () => {
    const categories = await axios.get(`${api}/public/categories/getAll`);

    setCategory(categories.data);
  };

  const getColors = async () => {
    const colors = await axios.get(`${api}/public/colors/getAll`);

    setColor(colors.data);
  };
  //
  useEffect(() => {
    getBrands();
    getCategories();
    getColors();
  }, []);

  useEffect(() => {
    dispatch({ type: "FILTER", filter: optionFilter });
  }, [optionFilter]);

  const setFilter = (value, type) => {
    setOptionFilter((prev) => ({ ...prev, [type]: value }));
  };

  // create button
  const createButton = (value, type) => {
    return (
      <button className={classes.btn} onClick={() => setFilter(value, type)}>
        {value}
      </button>
    );
  };

  // create color button
  const createColorButton = (color) => {
    return (
      <button
        className={classes.colorContent}
        onClick={() => setFilter(color.name, "color")}
      >
        {color.name}
        <span
          className={classes.colorIcon}
          style={{ backgroundColor: `${color.code}` }}
        ></span>
      </button>
    );
  };

  const createChose = (value, type) => {
    return (
      <button
        className={classes.chose}
        onClick={() => setOptionFilter((prev) => ({ ...prev, [type]: "" }))}
      >
        {value} <span>x</span>
      </button>
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.title}>Filter</div>
      <div className={classes.title1}>
        <p>Shoe Option</p>
      </div>
      <div>
        {optionFilter.brand !== "" && (
          <div>{createChose(optionFilter.brand, "brand")}</div>
        )}
        {optionFilter.category !== "" && (
          <div>{createChose(optionFilter.category, "category")}</div>
        )}
        {optionFilter.price !== "" && (
          <div>{createChose(optionFilter.price, "price")}</div>
        )}
        {optionFilter.color !== "" && (
          <div>{createChose(optionFilter.color, "color")}</div>
        )}
      </div>
      {/* <div className="option">{createButton("All")}</div> */}
      <div className={classes.title2}>
        <p>Brand</p>
      </div>
      <div className={classes.filter_option}>
        {brands?.map((brand, index) => (
          <div key={index}>{createButton(brand, "brand")}</div>
        ))}
      </div>
      <div className={classes.title2}>
        <p>Category</p>
      </div>
      <div className={classes.filter_option}>
        {categories?.map((category, index) => (
          <div key={index}>{createButton(category, "category")}</div>
        ))}
      </div>
      <div className={classes.title2}>
        <p>Price</p>
      </div>
      <div className={classes.filter_option}>
        {createButton("< 1.000.000", "price")}
        <br></br>
        {createButton("1.000.000 - 2.000.000", "price")}
        <br></br>
        {createButton("2.000.000 - 3.000.000", "price")}
        <br></br>
        {createButton("> 3.000.000", "price")}
      </div>
      <div className={classes.title2}>
        <p>Color</p>
      </div>
      <div className={classes.filter_option}>
        {colors?.map((color, index) => (
          <div key={index}>{createColorButton(color)}</div>
        ))}
      </div>
    </div>
  );
};
export default Filter;
