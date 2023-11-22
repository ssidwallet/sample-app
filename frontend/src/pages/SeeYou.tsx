import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./SeeYou.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SeeYou() {
  const query = useQuery();

  const from = query.get("from");
  const to = query.get("to");
  const url = query.get("url") || "";

  useEffect(() => {
    setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      location.href = "/" + url;
    }, 5000);
  });

  return (
    <section className="section has-background-white">
      <div className="container is-fullhd">
        <div className="is-flex is-flex-direction-column content has-text-centered is-align-items-center">
          <br /> <br />
          <h2 className="has-text-info">See you later!</h2>
          <div className="block">
            <h3>
              You are leaving the <strong>{from}</strong> and will be redirected
              to the <strong>{to}</strong> website to continue.
            </h3>
          </div>
          <figure className="image is-128x128 wave">
            <img
              src="https://www.pngrepo.com/png/304508/512/hand-wave-simple.png"
              alt=""
            />
          </figure>
          <br />
          <br />
        </div>
        <div className="block"></div>
      </div>
    </section>
  );
}

export default SeeYou;
