import React from "react";
import { useState } from "react";
const InputField = ({ type, validate, onChange, placeholder, error }) => {
  return (
    <>
      <input
        className="rounded-full text-sm w-full p-4 my-2  border border-solid border-gray-300 "
        type={type}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 p-2">{error}</p>}
    </>
  );
};

export default InputField;
