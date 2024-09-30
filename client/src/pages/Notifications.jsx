import React, { useEffect, useState } from "react";
import Header from "../components/header";
import api from "../api";
import NotificationCard from "../components/notificationCard";
import FoodCard from "../components/foodCard";

export default function Notifications() {
  const [notifications, setNotifications] = useState({
    expired: [],
    expiringSoon: [],
  });

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <Header title={"Notifications"} />
      <div className="relative max-w-full">
        <div className="mb-3">
          {notifications.expiringSoon.length > 0 ? (
            <>
              <h4 className="w-full px-4 text-md font-bold bg-yellow-700 text-white">
                Expiring Soon({notifications.expiringSoon.length})
              </h4>
              {notifications.expiringSoon.map((item) => (
                <div className="mt-2 px-4">
                  <NotificationCard item={item} />
                </div>
              ))}
            </>
          ) : null}
        </div>
        <hr />
        <div className="mt-3">
          {notifications.expired.length > 0 ? (
            <>
              <h4 className="w-full px-4 text-md font-bold bg-yellow-700 text-white">
                Expired({notifications.expired.length})
              </h4>
              {notifications.expired.map((item) => (
                <div className="mt-2 px-4">
                  <NotificationCard item={item} />
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
