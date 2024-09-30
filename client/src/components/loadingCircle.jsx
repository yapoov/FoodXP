import React from "react";

function LoadingCircle({ text }) {
  return (
    <>
      <div
        class="  inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite"
        role="status"
      ></div>
      <span className="ml-4 text-lg font-bold">{text}</span>
    </>
  );
}

export default LoadingCircle;
