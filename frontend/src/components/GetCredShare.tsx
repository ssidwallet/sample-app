import React, { useEffect, useState } from "react";
import "./GetCredShare.css";

type GetCredShareProps = {
  toShare: string[];
  imageUrl: string;
  shareStatus: boolean;
  incrementFn: () => void;
};

function GetCredShare({
  toShare,
  imageUrl,
  shareStatus,
  incrementFn,
}: GetCredShareProps) {
  function showSpinnerOrCheck() {
    if (!shareStatus) {
      return <div className="loader"></div>;
    } else {
      return (
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            className="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      );
    }
  }

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          Share&nbsp;
          {toShare.map((item, i) => {
            if (i < toShare.length - 1) {
              return <span key={i}>{item},&nbsp;</span>;
            } else {
              return <span key={i}>{item}</span>;
            }
          })}
        </p>
      </header>
      <div className="card-content has-text-centered">
        <div className="content">
          <h3>Share Credentials</h3>
          {showSpinnerOrCheck()}
          <figure className="image is-square">
            <img src={imageUrl} alt="" />
          </figure>
        </div>
      </div>
      <footer className="card-footer has-background-primary">
        <a
          href="#"
          className="card-footer-item has-text-white"
          onClick={() => incrementFn()}
        >
          Continue
        </a>
      </footer>
    </div>
  );
}

export default GetCredShare;
