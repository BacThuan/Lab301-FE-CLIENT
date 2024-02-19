import classes from "./Checkout.module.css";
import Banner from "../../component/banner/Banner";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../../api/api";
import { convert } from "../../store/convert";
import Cookies from "js-cookie";
import Media from "react-media";
import {
  getApiCities,
  getApiDistricts,
  getApiWard,
  getApiService,
  getApiDeliveryPrice,
  getApiAvailableShop,
} from "../../store/delivery";
import { useDispatch } from "react-redux";
// tinh tong tien
const countTotal = (items) => {
  let result = 0;
  for (let i = 0; i < items.length; ++i) {
    result += Number(items[i].quantity) * Number(items[i].price);
  }

  return result;
};

// tinh trong luong san pham
const countTotalItembuy = (data) => {
  let total = 0;
  data.forEach((item) => {
    total += item.quantity;
  });

  return total;
};

const initOption = {
  province: {},
  district: {},
  ward: {},
  services: {},
};

const fast = "Giao hàng nhanh";
// const save = "Giao hàng tiết kiệm thường";
// const saveXteam = "Giao hàng tiết kiệm nhanh";
const GuestCheckout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // get address infomation to count delivery
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);

  const [availableDistrict, setAvailableDistrict] = useState([]);
  const [services, setServices] = useState([]);
  const [deliveryChose, setDeliveryChose] = useState(0);

  const [deliveryFee, setDeliveryFee] = useState(0);

  const [deliveryOption, setDeliveryOption] = useState(initOption);

  const [orderData, setOrderData] = useState({
    name: "",
    email: "email",
    phone: "",
    address: "",
    method: "Credit card",
  });

  let cart = Cookies.get("_cart");
  const [total, setTotal] = useState("");
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(null);

  //----------

  const getCities = async () => {
    setDeliveryOption(initOption);

    const data = await getApiCities();
    let arr = [];
    data.forEach((city) => {
      arr.push({
        idCity: city.ProvinceID,
        nameCity: city.ProvinceName,
      });
    });
    setProvince(arr);
  };

  const getDistricts = async (idCity) => {
    const data = await getApiDistricts(idCity);
    let arr = [];
    data.forEach((district) => {
      arr.push({
        idDistrict: district.DistrictID,
        nameDistrict: district.DistrictName,
      });
    });

    setDistrict(arr);
  };

  const getWard = async (district) => {
    const res = await getApiWard(district);
    if (res.data.data) {
      const data = res.data.data;

      let arr = [];
      data.forEach((ward) => {
        arr.push({
          idWard: ward.WardCode,
          nameWard: ward.WardName,
        });
      });

      setWard(arr);
    } else setWard([]);
  };

  const getService = async (district) => {
    setServices([]);
    availableDistrict.forEach(async (shopDistrict) => {
      const data = await getApiService(shopDistrict, district);

      // get fast
      data.forEach((value) => {
        // add some data to get service
        value.idDistrict = shopDistrict.fastDeliveryCodeDistrict;
        value.district = shopDistrict.district;
        value.city = shopDistrict.city;
        value.type = fast;
      });

      setServices((prev) => [...prev, ...data]);
      setDeliveryOption((prev) => ({ ...prev, services: data[0] }));
    });
  };

  const getDeliveryPrice = async (
    service_id,
    from_district_id,
    to_district_id,
    to_ward_code
  ) => {
    try {
      const res = await getApiDeliveryPrice(
        service_id,
        from_district_id,
        to_district_id,
        to_ward_code,
        totalItems,
        total
      );

      setDeliveryFee(res.total);
    } catch (err) {
      setDelivery(services[0], 0);
    }
  };
  useEffect(() => {
    const getAvailbleShopsAndDiscount = async () => {
      const shops = await getApiAvailableShop();
      setAvailableDistrict(shops);
    };

    cart = JSON.parse(cart);
    axios
      .post(`${api}/public/cart`, cart)
      .then((res) => {
        let temp = res.data;
        setData(temp);
        setTotal(convert(String(countTotal(temp))));
      })
      .catch((err) => {
        alert("Some thing wrong");
        navigate("/");
      });

    // get city
    getCities();
    getAvailbleShopsAndDiscount();
  }, []);

  // tinh tong
  useEffect(() => {
    if (data) {
      setTotal(countTotal(data));
      setTotalItems(countTotalItembuy(data));
    }
  }, [data]);

  const handleChooseDelivery = (e) => {
    let id = e.target.id;
    let data = JSON.parse(e.target.value);

    setDeliveryOption((prev) => ({ ...prev, [id]: data }));

    if (id === "province") {
      getDistricts(data);
    }
    if (id === "district") {
      getWard(data);
      getService(data);
    }

    if (id === "ward") {
      getDeliveryPrice(
        services[0].service_id,
        services[0].idDistrict,
        deliveryOption.district.idDistrict,
        data.idWard
      );
    }
  };

  const setDelivery = (service, index) => {
    setDeliveryOption((prev) => ({ ...prev, services: service }));
    setDeliveryChose(index);

    getDeliveryPrice(
      service.service_id,
      service.idDistrict,
      deliveryOption.district.idDistrict,
      deliveryOption.ward.idWard
    );
  };

  const handleChange = (e) => {
    setOrderData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const order = async (e) => {
    e.preventDefault();

    // check if still have item in database
    cart = JSON.parse(cart);

    try {
      const checkItems = await axios.post(`${api}/public/checkItems`, cart);

      if (checkItems) {
        let address =
          orderData.address +
          ", " +
          deliveryOption.ward.nameWard +
          ", " +
          deliveryOption.district.nameDistrict +
          ", " +
          deliveryOption.province.nameCity;

        orderData.address = address;
        orderData.total = total + deliveryFee;
        orderData.listItem = JSON.parse(cart);

        Cookies.set("guest_order", JSON.stringify(orderData));
        navigate("/payment-guest");
      }
    } catch (err) {
      alert(err.respone.data);
    }
  };

  const printOrder = (
    <div className={classes.order}>
      <div>
        <div className={classes.title}>YOUR ORDER</div>
        <div className={classes.list}>
          {data?.map((item, index) => {
            return (
              <div key={index} className={classes.item}>
                <div className={classes.name}>{item.name}</div>
                <div className={classes.price}>
                  {convert(String(item.price))} x {item.quantity}
                </div>
              </div>
            );
          })}
        </div>
        <div className={classes.total}>
          <div>SUB TOTAL</div>
          <p>{convert(String(total))}</p>
        </div>
      </div>
      <br></br>
      <div>
        <div className={classes.title}>DELIVER FEE</div>
        <div className={classes.list}>
          <div className={classes.item}>
            <div className={classes.name}>Total fee:</div>
            <div className={classes.price}>{convert(String(deliveryFee))}</div>
          </div>
        </div>
        <div className={classes.total}>
          <div>TOTAL</div>
          <p>{convert(String(total + deliveryFee))}</p>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <Banner title={"Checkout"} />
      <div className={classes.container}>
        <form className={classes.details} onSubmit={order}>
          <div className={classes.title}>BILLING DETAILS</div>
          <div className={classes.input}>
            <div className={classes.alt}>FULL NAME: </div>
            <input
              id="name"
              placeholder="Enter Your Full Name Here!"
              onChange={handleChange}
              required={true}
            />
          </div>

          <div className={classes.input}>
            <div className={classes.alt}>EMAIL: </div>
            <input
              id="email"
              placeholder="Enter Your Email Here!"
              onChange={handleChange}
              required={true}
            />
          </div>

          <div className={classes.input}>
            <div className={classes.alt}>PHONE NUMBER: </div>
            <input
              id="phone"
              placeholder="Enter Your Phone Number Here!"
              onChange={handleChange}
              required={true}
            />
          </div>

          <div className={classes.input}>
            <div className={classes.alt}>ADDRESS: </div>

            <select
              id="province"
              onChange={handleChooseDelivery}
              required={true}
              value={JSON.stringify(deliveryOption.province)}
            >
              <option value="">Choose city</option>
              {province.map((city, index) => {
                return (
                  <option key={index} value={JSON.stringify(city)}>
                    {city.nameCity}
                  </option>
                );
              })}
            </select>

            <select
              id="district"
              onChange={handleChooseDelivery}
              required={true}
              value={JSON.stringify(deliveryOption.district)}
            >
              <option value="">Choose district</option>
              {district.map((district, index) => {
                return (
                  <option key={index} value={JSON.stringify(district)}>
                    {district.nameDistrict}
                  </option>
                );
              })}
            </select>

            <select
              id="ward"
              onChange={handleChooseDelivery}
              required={true}
              value={JSON.stringify(deliveryOption.ward)}
            >
              <option value="">Choose ward</option>
              {ward.map((ward, index) => {
                return (
                  <option key={index} value={JSON.stringify(ward)}>
                    {ward.nameWard}
                  </option>
                );
              })}
            </select>
            <input
              id="address"
              placeholder="Enter Your Address Here!"
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className={classes.input}>
            <div className={classes.alt}>DELIVERY: </div>
            <div className={classes.delivery}>
              {services.map((service, index) => {
                return (
                  <div
                    className={classes.card}
                    onClick={() => setDelivery(service, index)}
                  >
                    <div>
                      <div>
                        From: {service.district} (<span>{service.type}</span>)
                      </div>
                      <div>{service.short_name}</div>
                    </div>

                    <input
                      type="radio"
                      checked={index === deliveryChose ? true : false}
                    ></input>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={classes.input}>
            <div className={classes.alt}>DISCOUNT CODE: </div>
            <div className={classes.delivery}>
              You are not a member. Sign up to get some discount code.
            </div>
          </div>

          <div className={classes.input}>
            <div className={classes.alt}>PAYING METHOD: </div>
            <select id="method" onChange={handleChange}>
              <option value="Credit card">Credit card</option>
            </select>
          </div>

          <Media
            queries={{
              normal: "(max-width: 320px)",
            }}
          >
            {(matches) => (
              <React.Fragment>
                {matches.normal && <div>{printOrder}</div>}
              </React.Fragment>
            )}
          </Media>

          <button type="submit">
            <div>Place Order</div>
          </button>
        </form>

        <Media
          queries={{
            normal: "(min-width: 321px)",
          }}
        >
          {(matches) => (
            <React.Fragment>
              {matches.normal && (
                <div className={classes.order}>
                  <div>
                    <div className={classes.title}>YOUR ORDER</div>
                    <div className={classes.list}>
                      {data?.map((item, index) => {
                        return (
                          <div key={index} className={classes.item}>
                            <div className={classes.name}>{item.name}</div>
                            <div className={classes.price}>
                              {convert(String(item.price))} x {item.quantity}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={classes.total}>
                      <div>SUB TOTAL</div>
                      <p>{convert(String(total))}</p>
                    </div>
                  </div>
                  <br></br>
                  <div>
                    <div className={classes.title}>DELIVER FEE</div>
                    <div className={classes.list}>
                      <div className={classes.item}>
                        <div className={classes.name}>Total fee:</div>
                        <div className={classes.price}>
                          {convert(String(deliveryFee))}
                        </div>
                      </div>
                    </div>
                    <div className={classes.total}>
                      <div>TOTAL</div>
                      <p>{convert(String(total + deliveryFee))}</p>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </Media>
      </div>
    </div>
  );
};
export default GuestCheckout;
