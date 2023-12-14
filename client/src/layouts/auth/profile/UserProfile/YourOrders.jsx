import React, { useEffect, useState } from "react";
import "./YourOrders.css";
import OrderSuccessful from "./Order/OrderSuccessful";
// import { useRecoilState } from "recoil";
import { orderSuccessfulProvider } from "./Providers/OrderSuccessfulProvider";
import { useRecoilState } from "recoil";
import { useSelector, useDispatch } from "react-redux";

const YourOrders = () => {
  const token = useSelector((state) => state.auth.userToken);
  const [data, setData] = useState([]);
  useEffect(() => {
    const sendRequest = async () => {
      const response = await fetch("http://localhost:8000/auth/order", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const orderData = await response.json();
      setData(orderData);
    };
    sendRequest();
  }, []);

  const [selectedorderid, setselectedorderid] = useState(0);
  const [ordersuccesscont, setordersuccesscont] = useRecoilState(
    orderSuccessfulProvider
  );
  return (
    <div className="yourorders">
      <h1 className="mainhead1">Your Orders</h1>
      {ordersuccesscont && (
        <OrderSuccessful
          orderid={selectedorderid}
          message={`Order ID: ${selectedorderid}`}
        />
      )}
      <table className="yourorderstable">
        <thead>
          <tr>
            <th scope="col">Oder ID</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Total</th>
            {/* <th scope="col">Invoice</th> */}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <td data-label="OrderID">{item._id}</td>
                <td data-label="OrderDate">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td data-label="Delivery Status">
                  <div>
                    {item.status === "Delivered" && (
                      <span className="greendot"></span>
                    )}
                    {item.status === "On the way" && (
                      <span className="yellowdot"></span>
                    )}
                    {item.status === "Cancelled" && (
                      <span className="reddot"></span>
                    )}
                    {item.status}
                  </div>
                </td>
                <td data-label="Total">${item.amount * item.quantity}</td>
                {/* <td data-label="Invoice">
                  <button
                    className="mainbutton1"
                    onClick={() => {
                      setselectedorderid(item.id);
                      setordersuccesscont(true);
                    }}
                  >
                    View
                  </button>
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default YourOrders;
