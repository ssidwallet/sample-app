import React from "react";
import { Link } from "react-router-dom";

export interface FlowCardProps {
  title: string;
  imageUrl: string;
  idType: string;
  descriptionLine1: string;
  descriptionLine2: string;
  toShare: string[];
  url: string;
}

function FlowCard({
  title,
  imageUrl,
  idType,
  descriptionLine1,
  descriptionLine2,
  toShare,
  url,
}: FlowCardProps) {
  return (
    <div className="is-flex is-justify-content-center">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title is-uppercase">{title}</p>
        </header>
        <div className="card-content">
          <div className="content">
            <div className="columns">
              <div className="column is-two-thirds">
                <article className="media">
                  <figure className="media-left">
                    <p className="image is-64x64">
                      <img src={imageUrl} alt="" />
                    </p>
                  </figure>
                  <div className="media-content">
                    <div className="content">
                      <div className="block">
                        <strong>{idType}</strong>
                      </div>
                      <div className="block">
                        {descriptionLine1}
                        <br />
                        {descriptionLine2}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
              <div className="column">
                <strong>You'll be asked to share:</strong>
                <p>
                  {toShare.map((share) => {
                    return (
                      <>
                        {" "}
                        {share} <br />{" "}
                      </>
                    );
                  })}
                </p>
                <Link to={url}>
                  <button className="button is-primary">Get {idType}</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowCard;
