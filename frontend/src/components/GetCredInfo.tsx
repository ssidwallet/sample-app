import React from "react";

export type GetCredInfoProps = {
  title: string;
  contentItems: string[];
  shareString: string;
  toShare: string[];
  incrementFn: () => void;
};

function GetCredInfo({
  title,
  contentItems,
  shareString,
  toShare,
  incrementFn,
}: GetCredInfoProps) {
  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">{title}</p>
      </header>
      <div className="card-content">
        <div className="content">
          <ul>
            {contentItems.map((item, i) => {
              return <li key={i}>{item}</li>;
            })}
          </ul>
          <br />
          <p className="is-uppercase is-size-7 has-text-weight-semibold">
            {shareString}
          </p>
          <div className="box has-background-grey-lighter">
            {toShare.map((item, i) => {
              if (i < toShare.length - 1) {
                return (
                  <>
                    <span key={i}>{item}</span> <br />{" "}
                  </>
                );
              } else {
                return <span>{item}</span>;
              }
            })}
          </div>
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

export default GetCredInfo;
