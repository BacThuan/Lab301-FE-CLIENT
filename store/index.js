import { createStore } from "redux";
import Cookies from "js-cookie";
import { tokenLimit } from "./tokenLimit";
import { domain } from "../api/api";
const isAccessDashboard = (role) => {
  return role.isCreate || role.isREAD || role.isUPDATE || role.isDELETE;
};
const initFilter = {
  brand: "",
  category: "",
  price: "",
  color: "",
};
const initState = {
  isOpen: false,
  product: null,
  filter: initFilter,
  sort: "",
  cartItems: 0,
  searching: "",
};
const reducer = (state = initState, action) => {
  if (action.type === "SHOW_POPUP") {
    return {
      ...state,
      isOpen: true,
      product: action.product,
    };
  }

  if (action.type === "HIDE_POPUP") {
    return {
      ...state,
      isOpen: false,
      product: null,
    };
  }

  if (action.type === "FILTER") {
    return {
      ...state,
      filter: action.filter,
    };
  }

  if (action.type === "CART") {
    return {
      ...state,
      cartItems: action.count,
    };
  }

  if (action.type === "ADD_TO_CART") {
    const newState = { ...state };
    newState.cartItems = action.total;
    return newState;
  }

  if (action.type === "REMOVE_FROM_CART") {
    const newState = { ...state };
    newState.cartItems -= 1;
    return newState;
  }

  if (action.type === "SORT") {
    return {
      ...state,
      sort: action.sort,
    };
  }

  if (action.type === "SEARCHING") {
    return {
      ...state,
      searching: action.value,
    };
  }

  if (action.type === "CREATEID") {
    Cookies.set("userTempId", action.userTempId, {
      domain: domain,
      expires: tokenLimit,
    });

    return {
      ...state,
    };
  }
  if (action.type === "LOGIN") {
    const newState = { ...state };
    const canAccessAdmin = isAccessDashboard(action.role);

    newState.cartItems = action.cartItems;

    Cookies.set("token", action.token, {
      domain: domain,
      expires: tokenLimit,
    });

    Cookies.set("name", action.name, {
      domain: domain,
      expires: tokenLimit,
    });

    Cookies.set("email", action.email, {
      domain: domain,
      expires: tokenLimit,
    });
    Cookies.set("phone", action.phone, {
      domain: domain,
      expires: tokenLimit,
    });

    if (canAccessAdmin) {
      Cookies.set("isAccessAdmin", canAccessAdmin, {
        domain: domain,
        expires: tokenLimit,
      });
    }

    return newState;
  }

  if (action.type === "UPDATE_PROFILE") {
    const newState = { ...state };

    Cookies.set("name", action.name, {
      domain: domain,
      expires: tokenLimit,
    });
    Cookies.set("phone", action.phone, {
      domain: domain,
      expires: tokenLimit,
    });

    return newState;
  }

  if (action.type === "LOGOUT") {
    Cookies.remove("token");
    Cookies.remove("name");
    Cookies.remove("email");
    Cookies.remove("phone");
    Cookies.remove("isAccessAdmin");

    return initState;
  }

  return state;
};

const store = createStore(reducer);
export default store;
