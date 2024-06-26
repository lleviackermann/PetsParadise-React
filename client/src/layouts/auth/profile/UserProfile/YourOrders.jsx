import React, { useEffect, useState } from "react";
import classes from "./YourOrders.module.css";
import OrderSuccessful from "./Order/OrderSuccessful";
import { orderSuccessfulProvider } from "./Providers/OrderSuccessfulProvider";
import { useRecoilState } from "recoil";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { baseURL } from "../../../../api/api";

const YourOrders = () => {
  const token = useSelector((state) => state.auth.userToken);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [prodData, setProdData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await fetch(`${baseURL}auth/order`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        let orderData = await response.json();
        orderData.orders = orderData.orders.filter((order) => order !== null);
        orderData.products = orderData.products.filter(
          (product) => product !== null
        );
        setOriginalData(orderData.orders);
        setData(orderData.orders);
        setProdData(orderData.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    sendRequest();
  }, [token]);

  const [selectedorder, setselectedorder] = useState(0);
  const [ordersuccesscont, setordersuccesscont] = useRecoilState(
    orderSuccessfulProvider
  );

  const handleStatusFilter = (status) => {
    let filteredOrders;
    if (status === "All") {
      filteredOrders = [...originalData];
    } else {
      filteredOrders = originalData.filter((order) => order.status === status);
    }
    setData(filteredOrders);
  };

  const handleTotalAmountFilter = (sortOrder) => {
    let sortedOrders;
    if (sortOrder === "Ascending") {
      sortedOrders = [...data].sort(
        (a, b) => a.amount * a.quantity - b.amount * b.quantity
      );
    } else {
      sortedOrders = [...data].sort(
        (a, b) => b.amount * b.quantity - a.amount * a.quantity
      );
    }
    setData(sortedOrders);
  };

  const handleDateFilter = (sortOrder) => {
    let sortedOrders;
    if (sortOrder === "Ascending") {
      sortedOrders = [...data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else {
      sortedOrders = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    setData(sortedOrders);
  };

  const handleCategoryFilter = (category) => {
    let filteredOrders;
    if (category === "All") {
      filteredOrders = [...originalData];
    } else {
      filteredOrders = originalData.filter((order) => {
        const productData = prodData.find(
          (product) => product._id === order.prodId
        );
        return productData && productData.productType === category;
      });
    }
    setData(filteredOrders);
  };

  return (
    <div className={classes.yourorders}>
      <h1 className={classes.mainhead1}>Your Orders</h1>
      {ordersuccesscont && (
        <OrderSuccessful
          order={selectedorder}
          message={`Order ID: ${selectedorder}`}
        />
      )}
      <div className={classes.filterButtons}>
        <div className={classes.filterButton}>
          <span>Status:</span>
          <select onChange={(e) => handleStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <div className={classes.filterButton}>
          <span>Order Category:</span>
          <select onChange={(e) => handleCategoryFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="pet">Pets</option>
            <option value="food">Food</option>
            <option value="Accessory">Accessory</option>
          </select>
        </div>
      </div>
      {loading && (
        <div style={{ marginLeft: "25rem" }}>
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <table className={classes.yourorderstable}>
          <thead>
            <tr>
              <th scope="col" className={classes.tableHeaderCell}>
                Sno
              </th>
              <th scope="col" className={classes.tableHeaderCell}>
                <span
                  onClick={() => handleDateFilter("Descending")}
                  className={classes.arrowIcon}
                >
                  &#9650;
                </span>
                &nbsp; Date &nbsp;
                <span
                  onClick={() => handleDateFilter("Ascending")}
                  className={classes.arrowIcon}
                >
                  &#9660;
                </span>
              </th>
              <th scope="col" className={classes.tableHeaderCell}>
                Status
              </th>
              <th scope="col" className={classes.tableHeaderCell}>
                Product Type
              </th>
              <th scope="col" className={classes.tableHeaderCell}>
                <span
                  onClick={() => handleTotalAmountFilter("Descending")}
                  className={classes.arrowIcon}
                >
                  &#9650;
                </span>
                &nbsp; Total &nbsp;
                <span
                  onClick={() => handleTotalAmountFilter("Ascending")}
                  className={classes.arrowIcon}
                >
                  &#9660;
                </span>
              </th>
              <th scope="col" className={classes.tableHeaderCell}>
                Product
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const productData = prodData.find(
                (product) => product._id === item.prodId
              );
              return (
                <tr key={index}>
                  <td data-label="Sno">{index + 1}</td>
                  <td data-label="OrderDate">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td data-label="Delivery Status">
                    <div>
                      {item.status}
                      {item.status === "Delivered" && (
                        <span className={classes.greendot}></span>
                      )}
                      {item.status === "Pending" && (
                        <span className={classes.yellowdot}></span>
                      )}
                    </div>
                  </td>
                  <td data-label="ProductType">
                    {productData && productData.productType}
                  </td>{" "}
                  {/* Render productType here */}
                  <td data-label="Total">${item.amount * item.quantity}</td>
                  <td data-label="Invoice">
                    <button
                      className={classes.mainbutton1}
                      onClick={() => {
                        setselectedorder(item);
                        setordersuccesscont(true);
                      }}
                    >
                      View Product
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default YourOrders;
