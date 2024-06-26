import React, { useEffect, useState } from "react";
import classes from "./EmployeeOrders.module.css";
import EmployeeSuccessful from "./Employee/EmployeeSuccessful";
import { EmployeeSuccesfulProvider } from "./Providers/EmployeeSuccesfulProvider";
import { useRecoilState } from "recoil";
import { useSelector, useDispatch } from "react-redux";
import { changeOrderStatus } from "../../../../store/auth-actions";
import CircularProgress from "@mui/material/CircularProgress";
import { baseURL } from "../../../../api/api";

const YourOrders = () => {
  const token = useSelector((state) => state.auth.userToken);
  const employeeDetails = useSelector((state) => state.auth.userInfo);
  console.log(employeeDetails);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const handleAcceptOrCancel = async (option, index) => {
    const selectedOrder = data[index];
    dispatch(changeOrderStatus(option, selectedOrder._id, token));
    setOriginalData((prevData) =>
      prevData.map((order) =>
        order._id === selectedOrder._id
          ? {
              ...order,
              status: "Delivered",
            }
          : order
      )
    );
    setData((prevData) =>
      prevData.map((order) =>
        order._id === selectedOrder._id
          ? {
              ...order,
              status: "Delivered",
            }
          : order
      )
    );
  };

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await fetch(
          `${baseURL}employee/${employeeDetails.id}/orders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const orderData = await response.json();
        setOriginalData(orderData);
        setData(orderData);
        console.log(orderData);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };
    sendRequest();
  }, [token]);
  // useEffect(() => {
  //   handleStatusFilter("Pending");
  // }, []);

  const [selectedorder, setselectedorder] = useState(0);
  const [ordersuccesscont, setordersuccesscont] = useRecoilState(
    EmployeeSuccesfulProvider
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
      filteredOrders = data.filter((order) => {
        return order.productType === category;
      });
    }
    console.log(originalData);
    setData(filteredOrders);
  };

  return (
    <div className={classes.yourorders}>
      <h1 className={classes.mainhead1}>Your Orders</h1>
      {ordersuccesscont && (
        <EmployeeSuccessful
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
      <table className={classes.yourorderstable}>
        <thead>
          <tr>
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
              User Name
            </th>
            <th scope="col" className={classes.tableHeaderCell}>
              Product Name
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
        {loading && (
          <div style={{ marginLeft: "25rem" }}>
            <CircularProgress />
          </div>
        )}
        {!loading && (
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={index}>
                  <td data-label="OrderDate">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td data-label="UserName">{item.userName}</td>
                  <td data-label="UserName">{item.productName}</td>
                  <td data-label="ProductType">{item && item.productType}</td>
                  <td data-label="Total">${item.amount * item.quantity}</td>
                  <td data-label="Operation">
                    {item.status === "Pending" && (
                      <button
                        onClick={() => handleAcceptOrCancel("accept", index)}
                      >
                        Accept
                      </button>
                    )}
                    {item.status !== "Pending" && item.status}
                    &nbsp;&nbsp;
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default YourOrders;
