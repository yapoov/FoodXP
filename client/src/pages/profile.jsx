import React from "react";
import Header from "../components/header";
import { SetupNotification } from "../notification";

function Profile() {
  return (
    <>
      <Header title="profile"></Header>

      <button
        onClick={SetupNotification}
        className="m-4 text-xl text-white font-bold hover:bg-teal-700 rounded-full p-4 bg-teal-400 "
      >
        Send notification
      </button>
    </>
  );
}

export default Profile;
