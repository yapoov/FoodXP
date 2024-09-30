import React, { useRef } from "react";
import { useState } from "react";

function FoodCard({ item, onClickDelete }) {
  const [focused, setFocused] = useState(false);
  const parentRef = useRef(null);
  const onBlur = (event) => {
    if (parentRef.current && !parentRef.current.contains(event.relatedTarget)) {
      setFocused(false);
    }
  };
  const currentDate = new Date();
  // Get the expiry date from the item and convert it to a Date object
  const expiryDate = new Date(item.expiryDate);

  // Calculate the difference in time
  const timeDifference = expiryDate - currentDate;
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  let expiryMessage;
  let textColor;
  let removeText;
  let bgColor;
  if (daysDifference < 0) {
    expiryMessage = "Expired";
    textColor = "text-red-600";
    bgColor = "bg-red-300";
    removeText = "discard";
  } else if (daysDifference === 0) {
    expiryMessage = "Expires today";
    textColor = "text-yellow-600";
    removeText = "take my chance";
    bgColor = "bg-yellow-300";
  } else {
    expiryMessage = `Expires in ${daysDifference} days`;
    textColor = "text-teal-500";
    removeText = "consume";
    bgColor = "bg-teal-300";
  }
  return (
    <li
      ref={parentRef}
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
      class="rounded-lg w-full bg-gray-100 lg:max-w-full flex border-b-2 border-r-2 border-yellow-950 border-opacity-45"
    >
      {/* <div className="p-4">
        <img className="h-16 w-16  object-cover" src={"/foodxp_logo.png"}></img>
      </div> */}
      <div className="grow flex justify-between items-center">
        <div class="p-4 flex flex-col justify-between leading-normal">
          <div class="">
            <div class="text-yellow-700 font-bold text-2xl mb-2">
              {item.name}
            </div>
            <p class={`${textColor} font-bold text-lg`}>{expiryMessage}</p>
          </div>
        </div>
        {focused && (
          <button
            onClick={(e) => onClickDelete(item)}
            className={`h-full border-l-4  border-gray-500 p-2 ${bgColor} bg-red-300 hover:bg-red-100 font-bold`}
          >
            {removeText}
          </button>
        )}
      </div>
    </li>
  );
}

export default FoodCard;
