import React from "react";
import BackButton from "./backButton";

function Header({ title }) {
  return (
    <div className="w-full relative bg-teal-300  h-48 flex flex-col justify-end">
      <BackButton />
      <p className=" pb-4 pl-4 uppercase text-5xl text-white  font-bold">
        {title}
      </p>
    </div>
  );
}

export default Header;
