import React from "react";
import Header from "../components/header";
import { SetupNotification } from "../notification";
import Toggle from "../components/toggle";
import { useAuth } from "../hooks/useAuth";
import api from "../api";
import { toast } from "react-toastify";

function Profile() {
  const { logout } = useAuth();
  const handleToggle = async (enabled) => {
    console.log(enabled);
    if (enabled) {
      try {
        await SetupNotification();
        // toast(res.data);
      } catch (e) {}
    } else {
      try {
        const res = await api.post("/notifications/unsubscribe");
        toast(res.data);
      } catch (e) {}
    }
  };
  return (
    <div className="flex flex-col items-stretch">
      <Header title="profile"></Header>
      <div className="flex justify-between text-4xl">
        <span>notification</span>
        <div className="mr-6">
          <Toggle
            onChange={(e) => handleToggle(e.target.checked)}
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
  );
}

export default Profile;
