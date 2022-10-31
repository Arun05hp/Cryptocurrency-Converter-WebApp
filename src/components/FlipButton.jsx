import React from "react";

const FlipButton = (props) => {
  return (
    <button className="flip-wrapper" {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        height="16px"
        width="16px"
        viewBox="0 0 24 24"
        className="flip-arrow"
      >
        <path
          d="M6 16H20M20 16L17 19M20 16L17 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M18 8H4M4 8L7 11M4 8L7 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </button>
  );
};

export default FlipButton;
