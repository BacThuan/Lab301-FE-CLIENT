import axios from "axios";
import { api } from "../api/api";
const deliveryToken = process.env.REACT_APP_FAST_DELIVERY_TOKEN;
const deliveryShopId = process.env.REACT_APP_FAST_DELIVERY_SHOP_ID;

export const getApiCities = async () => {
  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      {
        headers: {
          token: deliveryToken,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return [];
  }
};

export const getApiDistricts = async (data) => {
  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      {
        headers: {
          token: deliveryToken,
        },
        params: {
          province_id: data.idCity,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return [];
  }
};

export const getApiWard = async (district) => {
  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
      {
        headers: {
          token: deliveryToken,
        },
        params: {
          district_id: district.idDistrict,
        },
      }
    );
    return res;
  } catch (error) {
    return [];
  }
};

export const getApiService = async (shopDistrict, district) => {
  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
      {
        headers: {
          token: deliveryToken,
        },
        params: {
          shop_id: deliveryShopId,
          from_district: shopDistrict.fastDeliveryCodeDistrict,
          to_district: district.idDistrict,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return [];
  }
};

export const getApiDeliveryPrice = async (
  service_id,
  from_district_id,
  to_district_id,
  to_ward_code,
  itemsBuy,
  total
) => {
  let params = {
    service_id: service_id,
    insurance_value: total,
    coupon: null,
    from_district_id: from_district_id,
    to_district_id: to_district_id,
    to_ward_code: to_ward_code,
    height: itemsBuy,
    length: itemsBuy,
    width: itemsBuy,
    weight: itemsBuy * 3 * 1000, // coi trung binh 1 doi giay la 3kg, ket qua tinh theo gram
  };

  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        headers: {
          token: deliveryToken,
        },
        params: params,
      }
    );

    return res.data.data;
  } catch (error) {
    alert(error.response.data.code_message_value);
  }
};

export const getApiAvailableShop = async () => {
  try {
    // get shop delivery
    const res = await axios.get(`${api}/public/get-all-delivery-shop`);
    return res.data;
  } catch (error) {
    return [];
  }
};
// ------------------------- economical
const deliveryEconomicalToken = process.env.REACT_APP_ECONOMICAL_DELIVERY_TOKEN;
export const getApiEconomicalDelivery = async (
  from_city,
  from_district,
  to_city,
  to_district,
  total,
  itemsBuy,
  option
) => {
  let params = {
    pick_province: from_city,
    pick_district: from_district,
    province: to_city,
    district: to_district,
    weight: itemsBuy * 3 * 1000, // coi trung binh 1 doi giay la 3kg, ket qua tinh theo gram
    value: total,
    deliver_option: option,
  };

  try {
    // get shop delivery
    const res = await axios.get(
      `https://services.giaohangtietkiem.vn/services/shipment/fee`,
      {
        headers: {
          Token: deliveryEconomicalToken,
          "Access-Control-Allow-Origin": "*",
        },
        params: params,
      }
    );
    return res.data;
  } catch (error) {
    return [];
  }
};

// --------------- discount code
export const getDiscountCode = async () => {
  try {
    // get shop delivery
    const res = await axios.get(`${api}/public/get-active-event`);
    return res.data;
  } catch (error) {
    return [];
  }
};
