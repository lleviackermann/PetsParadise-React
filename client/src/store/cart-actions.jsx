import { baseURL } from "../api/api";
import { authActions } from "./auth-slice";

export const addItemToCart = (id, token) => {
  return async (dispatch) => {
    const sendData = await fetch(`${baseURL}auth/addToCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        productId: id,
      }),
    });
    // if(sendData.status)
    const data = await sendData.json();
    dispatch(authActions.updateCart(data.cart));
  };
};

export const removeItemFromCart = (id, token) => {
  return async (dispatch) => {
    const removeData = await fetch(`${baseURL}auth/removeFromCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        productId: id,
      }),
    });
    const data = await removeData.json();
    console.log("data is ", data);
    dispatch(authActions.updateCart(data.cart));
  };
};
