import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div class="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2  border-2 rounded-full bottom-4 left-1/2 bg-teal-300">
      <div class="grid h-full max-w-lg grid-cols-3 mx-auto">
        <Link
          to={"/"}
          class="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-teal-500  group"
        >
          <svg
            class="w-7 h-7 mb-1 text-gray-500 group-hover:text-gray-200 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
          <span class="sr-only">Home</span>
        </Link>

        <div class="flex items-center justify-center">
          <Link
            to="/camera-capture"
            class="inline-flex items-center justify-center w-10 h-10 font-medium bg-teal-500 rounded-full hover:bg-teal-600 group focus:ring-2 focus:ring-teal-600 focus:outline-none "
          >
            <svg
              class="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 18"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 1v16M1 9h16"
              />
            </svg>
            <span class="sr-only">New item</span>
          </Link>
        </div>

        <Link
          to={"/profile"}
          class="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-teal-500 group"
        >
          <svg
            class="w-8 h-8 mb-1 text-gray-500 group-hover:text-gray-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
