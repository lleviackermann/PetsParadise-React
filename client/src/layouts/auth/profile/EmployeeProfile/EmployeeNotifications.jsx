import React from "react";
import classes from "./EmployeeNotifications.module.css";

const Notifications = () => {
  const notifications = [
    { id: "m1", message: "hello1" },
    { id: "m2", message: "hello2" },
    { id: "m3", message: "hello3" },
    { id: "m4", message: "hello4" },
    { id: "m5", message: "hello5" },
    { id: "m6", message: "hello5" },
    { id: "m7", message: "hello5" },
    { id: "m8", message: "hello5" },
    { id: "m9", message: "hello5" },
    { id: "m10", message: "hello5" },
  ];

  return (
    <div className={classes.notification}>
      <div className={classes.noti}>
        <h1 className={classes.Hnoti}>MESSAGE FROM US</h1>
        {notifications.map((mess) => (
          <p key={mess.id} className={classes.Pnoti}>
            {mess.message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
