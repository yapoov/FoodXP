import React from "react";

function NotificationCard({ item, onClickDelete }) {
  return (
    <div class="rounded-lg w-full bg-yellow-50 lg:max-w-full flex border-b-2 border-r-2 border-yellow-950 border-opacity-45">
      <div className="p-4">
        <img className="h-16 w-16  object-cover" src={"/foodxp_logo.png"}></img>
      </div>
      <div className="grow flex justify-between items-center">
        <div class="p-4 flex flex-col justify-between leading-normal">
          <div class="">
            <div class="text-yellow-700 font-bold text-2xl mb-2">
              {item.name}
            </div>
            <p class="text-gray-500 font-bold text-lg">
              Use before: {item.expiryDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
