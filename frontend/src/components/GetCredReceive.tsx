import React from "react";

type GetCredReceiveProps = {
  idType: string;
  imageUrl: string;
  incrementFn: () => void;
};

function GetCredReceive({
  idType,
  imageUrl,
  incrementFn,
}: GetCredReceiveProps) {
  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">Receive {idType}</p>
      </header>
      <div className="card-content has-text-centered">
        <div className="content">
          <h3>{idType}</h3>
          <div className="block">
            <p>Scan this QR Code with the FlexID app to save it</p>
          </div>
          <figure className="image is-square">
            <img src={imageUrl} alt="" />
          </figure>
        </div>
      </div>
      <footer className="card-footer has-background-primary">
        <a
          className="card-footer-item has-text-white"
          onClick={() => incrementFn()}
        >
          Finish
        </a>
      </footer>
    </div>
  );
}

export default GetCredReceive;
