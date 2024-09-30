import React, { useState, useRef, useEffect } from "react";
import api from "../api";
import BackButton from "./backButton";
import { useNavigate } from "react-router-dom";
function ImageProcess({ image, retryCapture }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const sendPhoto = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const response = await api.post(
        "/upload-image",
        JSON.stringify({
          image: image.replace(/^data:image\/png;base64,/, ""), // Send only Base64 string
        })
      );
      setResults(response.data.products);
    } catch (error) {
      console.error("Error sending photo: ", error);
      alert("Error sending photo");
    } finally {
      setLoading(false);
    }
  };

  const sendItems = async () => {
    if (!results) return;
    try {
      const data = results.map((product) => {
        return {
          name: product["Product Name"],
          expiryDate: product.expiryDate || new Date(),
          purchaseDate: new Date(),
          quantity: 1,
        };
      });
      console.log(data);
      const response = await api.post("/items", data);
    } catch (e) {
      console.log(e);
    } finally {
      navigate("/");
    }
  };
  return (
    <div className="flex flex-col items-center">
      <BackButton />
      {results.length == 0 ? (
        <>
          <div className="relative bg-black">
            <img
              src={image}
              alt="Captured"
              className={`h-full w-auto object-cover ${
                loading && "transition-opacity ease-in duration-700 opacity-30"
              }`}
            />
            {loading && (
              <div className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 text-center flex items-center">
                <div
                  class="  inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite"
                  role="status"
                ></div>
                <span className="ml-4 text-lg font-bold">
                  Processing image, please wait...
                </span>
              </div>
            )}
          </div>
          <div className="flex space-x-16 mt-4 text-lg">
            <button
              onClick={retryCapture}
              className="py-2 px-8 bg-gray-200 font-bold rounded-full items-center justify-center"
            >
              Retry
            </button>
            <button
              onClick={sendPhoto}
              className=" py-2 px-8 bg-teal-200 font-bold rounded-full items-center justify-center"
            >
              Send
            </button>
          </div>{" "}
        </>
      ) : (
        <div className="mt-6 w-full flex flex-col justify-start">
          <h3 className="text-lg font-semibold">Extracted Products:</h3>
          <div className="flex-grow flex justify-end">
            <h3 className=" mr-4">Storage</h3>
          </div>
          <ul>
            {results.map((product, i) => (
              <ProductDisplay
                index={i}
                product={product}
                onExpiryChange={(expDate, i) => {
                  results[i].expiryDate = expDate;
                  setResults(results);
                }}
                onDeleteItem={(item) =>
                  setResults(results.filter((result) => result !== item))
                }
              />
            ))}
          </ul>
          <button
            onClick={sendItems}
            className=" flex-grow bg-teal-300 rounded-full p-2 mt-4 hover:bg-teal-500 shadow-xl "
          >
            <span className=" text-2xl font-bold text-lime-900">Add Items</span>
          </button>
        </div>
      )}
    </div>
  );
}

function ProductDisplay({ product, onDeleteItem, onExpiryChange, index }) {
  const [storage, setStorage] = useState("fridge");
  const [focused, SetFocused] = useState(false);
  const [expiryDuration, setExpiryDuration] = useState(
    product.expiryData.fridge || "3-7 days"
  );
  const parentRef = useRef(null);
  const onFocus = () => {
    SetFocused(true);
  };
  const onBlur = (event) => {
    if (parentRef.current && !parentRef.current.contains(event.relatedTarget)) {
      SetFocused(false);
    }
  };
  const handleStorageChange = (type) => {
    setStorage(type);

    if (type === "fridge") {
      setExpiryDuration(product.expiryData.fridge || "3-7 days");
    } else if (type === "freezer") {
      setExpiryDuration(product.expiryData.freezer || "3-7 days");
    }
    onExpiryChange(convertToFutureDate(expiryDuration), index);
  };
  return (
    <li
      ref={parentRef}
      tabIndex={0}
      onBlur={onBlur}
      onFocus={onFocus}
      className="flex flex-col items-stretch"
    >
      <div
        className={`p-4 ${
          focused ? "border border-teal-300 shadow-lg" : ""
        }rounded shadow-md mt-4 flex justify-between items-baseline overflow-auto relative`}
      >
        <div>
          <span className="">{product["Product Name"]}</span>
          {expiryDuration && (
            <div className="mt-2 text-sm text-gray-600">
              Expires in: {expiryDuration}
            </div>
          )}
        </div>
        <div className="ml-4 flex justify-end items-center ">
          {product.expiryData.fridge && (
            <button
              onClick={() => handleStorageChange("fridge")}
              className={`px-4 ${
                storage == "fridge" ? "bg-sky-200" : "border border-sky-300"
              } rounded-full hover:bg-sky-300`}
            >
              fridge
            </button>
          )}
          {product.expiryData.freezer && (
            <button
              onClick={() => handleStorageChange("freezer")}
              className={`ml-2 px-4  ${
                storage == "freezer" ? " bg-sky-300" : "border border-sky-400"
              } rounded-full hover:bg-sky-500`}
            >
              freezer
            </button>
          )}
        </div>
      </div>

      {focused && (
        <div className="flex flex-grow justify-end">
          <button
            onClick={() => onDeleteItem(product)}
            className=" hover:text-white hover:bg-red-700 place-self-end font-semibold bg-red-300 px-2 py-1 rounded-b-lg right-0"
          >
            remove
          </button>
        </div>
      )}
    </li>
  );
}
function convertToFutureDate(expiryString) {
  const currentDate = new Date();
  let futureDate = new Date();

  // Extract the number range and unit (days, months, years)
  const match = expiryString.match(/(\d+)-(\d+) (\w+)/);

  if (!match) {
    return "";
  }

  const min = parseInt(match[1]);
  const max = parseInt(match[2]);
  const unit = match[3].toLowerCase();

  // Randomly select a value in the range
  const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;

  // Calculate the future date based on the unit (days, months, years)
  switch (unit) {
    case "days":
      futureDate.setDate(currentDate.getDate() + randomValue);
      break;
    case "months":
      futureDate.setMonth(currentDate.getMonth() + randomValue);
      break;
    case "years":
      futureDate.setFullYear(currentDate.getFullYear() + randomValue);
      break;
    default:
      return "";
  }
  console.log({ min, max, unit, futureDate });
  return futureDate;
}
export default ImageProcess;
