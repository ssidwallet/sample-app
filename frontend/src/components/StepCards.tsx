import React from "react";

function StepCards() {
  return (
    <div className="level">
      <div className="level-item has-text-centered">
        <div className="is-flex is-flex-direction-column is-align-items-center">
          <figure className="image is-128x128">
            <img src="https://www.pngrepo.com/png/36356/512/id-card.png"></img>
          </figure>
          <h1>Get Bank Account ID</h1>
          <p>
            Acme Bank verifies your information <br /> and grants you Bank
            Account Credential
          </p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div className="is-flex is-flex-direction-column is-align-items-center">
          <figure className="image is-128x128">
            <img src="https://www.pngrepo.com/png/32217/512/facebook-mobile-app.png"></img>
          </figure>
          <h1>Store in FlexID</h1>
          <p>
            Own your information.
            <br /> You decide when and with whom you share it.
          </p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div className="is-flex is-flex-direction-column is-align-items-center">
          <figure className="image is-128x128">
            <img src="https://www.pngrepo.com/png/92923/512/city.png"></img>
          </figure>
          <h1>Access Services</h1>
          <p>
            As a full-fledged citizen,
            <br /> enjoy all the perks and benefits.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StepCards;
