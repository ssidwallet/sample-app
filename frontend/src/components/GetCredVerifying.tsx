import React, { useEffect } from "react";
import "./GetCredVerifying.css";

type GetCredVerifyingProps = {
  name: string;
  incrementFn: () => void;
};

function GetCredVerifying({ name, incrementFn }: GetCredVerifyingProps) {
  useEffect(() => {
    setTimeout(() => {
      incrementFn();
    }, 7500);
  });

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">Get Verified</p>
      </header>

      <div className="card-content has-text-centered is-flex is-justify-content-center">
        <div className="content">
          <h4>The {name} is verifying your submitted information...</h4>
          <div className="loader"></div>
        </div>
      </div>
    </div>
  );
}

export default GetCredVerifying;
