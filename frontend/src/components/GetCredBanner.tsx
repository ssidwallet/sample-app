import React from "react";

type GetCredBannerProps = {
  imageUrl: string;
  title: string;
};

function GetCredBanner({ imageUrl, title }: GetCredBannerProps) {
  return (
    <section className="section has-background-light">
      <div className="container is-fullhd">
        <div className="is-flex is-justify-content-flex-start">
          <figure className="image is-128x128">
            <img src={imageUrl} alt="" />
          </figure>
          <h1 style={{ lineHeight: "128px" }} className="is-size-1">
            &nbsp;&nbsp;&nbsp;{title}
          </h1>
        </div>
      </div>
    </section>
  );
}

export default GetCredBanner;
