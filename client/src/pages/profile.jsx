import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { SetupNotification } from "../notification";
import Toggle from "../components/toggle";
import { useAuth } from "../hooks/useAuth";
import api from "../api";
import { toast } from "react-toastify";
import LoadingCircle from "../components/loadingCircle";

function Profile() {
  const { logout } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      const res = await api.get("/user");
      setUser(res.data);
      if (user) {
        console.log(user.subscription);
        setIsSubscribed(user.subscription !== "");
      }
    };
    getUser();
  }, []);
  const handleToggle = async () => {
    if (!isSubscribed) {
      try {
        await SetupNotification();

        setIsSubscribed(!isSubscribed);
      } catch (e) {}
    } else {
      try {
        const res = await api.post("/notifications/unsubscribe");
        toast(res.data);
        setIsSubscribed(!isSubscribed);
      } catch (e) {}
    }
  };
  return (
    <>
      <div className="">
        <Header title="profile"></Header>
        {user ? (
          <div className="px-4 pt-4 w-full flex flex-col items-stretch  text-2xl">
            <div className="flex justify-between mb-4 ">
              <span className="font-semibold ">First Name:</span>
              <span>{user.firstName}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-semibold ">Last Name:</span>
              <span>{user.lastName}</span>
            </div>
            <div className="flex justify-between mb-8">
              <span className="font-semibold ">Recieve Notification</span>
              <div className="mr-6">
                <Toggle
                  onChange={handleToggle}
                  checked={isSubscribed}
                  child={"Notification"}
                />
              </div>
            </div>
            <button
              onClick={logout}
              className=" flex-grow bg-red-300 rounded-full p-2 mt-4 hover:bg-red-500 shadow-xl "
            >
              <span className=" text-2xl font-bold text-gray-800">Logout</span>
            </button>
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/2">
            <LoadingCircle />
          </div>
        )}
      </div>
    </>
  );
}
export default Profile;
