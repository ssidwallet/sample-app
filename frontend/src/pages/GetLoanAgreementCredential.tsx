import axios from "axios";
import React, { useEffect, useState } from "react";
import GetCredBanner from "../components/GetCredBanner";
import GetCredInfo, { GetCredInfoProps } from "../components/GetCredInfo";
import GetCredMenu, { GetCredMenuProps } from "../components/GetCredMenu";
import GetCredReceive from "../components/GetCredReceive";
import GetCredShare from "../components/GetCredShare";
import GetCredVerifying from "../components/GetCredVerifying";
import { loanAgreementFlowCard } from "../constants";
import EnterLoanInfoForm from "../components/EnterLoanInfoForm";

export interface LoanSubmitInfo {
  amount: number;
}

function GetLoanAgreementCredential() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prRequestId, setPrRequestId] = useState("");
  const [prImageUrl, setPrImageUrl] = useState("");
  const [shareStatus, setShareStatus] = useState(false);
  const [credImageUrl, setCredImageUrl] = useState("");
  const [submitInfo, setSubmitInfo] = useState<LoanSubmitInfo>();
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/loan-request/presentation-request", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setPrRequestId(response.data.requestId);
        setPrImageUrl(response.data.qrcode);
      });
  }, []);

  useEffect(() => {
    setInterval(() => {
      if (!shareStatus && prRequestId !== "") {
        axios
          .get(`http://localhost:5000/loan-request/poll/${prRequestId}`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          })
          .then((response) => {
            if (response.status === 200) {
              setShareStatus(true);
            }
          });
      }
    }, 5000);
  }, [shareStatus, prRequestId]);

  useEffect(() => {
    if (submitInfo) {
      axios
        .post(
          `http://localhost:5000/loan-request/receive-cred/${prRequestId}`,
          {
            ...submitInfo,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setCredImageUrl(response.data.qrcode);
          }
        })
        .catch((e) => {
          setError(e.response.data.message);
        });
    }
  }, [submitInfo]);

  function incrementIdx() {
    if (activeIdx < loanMenuProps.menuItems.length - 1) {
      setActiveIdx(activeIdx + 1);
    } else {
      // eslint-disable-next-line no-restricted-globals
      location.href = "/seeyou?from=Acme MFI&to=App Dashboard&url=";
    }
  }

  const loanMenuProps: GetCredMenuProps = {
    label: loanAgreementFlowCard.idType,
    menuItems: [
      "Loan Agreement",
      "Share Bank Account Credential",
      "Enter Your Information",
      "Get Verified",
      "Receive Loan Agreement",
    ],
    activeIdx: 0,
  };

  const loanInfoProps: GetCredInfoProps = {
    title: "Get a digital verification of your Loan Agreement",
    contentItems: [
      "Get a digital loan agreement to access third party services",
      "Protect yourself and have verifiable record of your loan agreement",
    ],
    shareString: "Acme MFI will ask you to share:",
    toShare: loanAgreementFlowCard.toShare,
    incrementFn: incrementIdx,
  };

  function showScreen() {
    if (activeIdx === 0) {
      return (
        <GetCredInfo
          title={loanInfoProps.title}
          contentItems={loanInfoProps.contentItems}
          shareString={loanInfoProps.shareString}
          toShare={loanInfoProps.toShare}
          incrementFn={loanInfoProps.incrementFn}
        />
      );
    } else if (activeIdx === 1) {
      return (
        <GetCredShare
          toShare={loanAgreementFlowCard.toShare}
          shareStatus={shareStatus}
          imageUrl={prImageUrl}
          incrementFn={incrementIdx}
        />
      );
    } else if (activeIdx == 2) {
      return (
        <EnterLoanInfoForm incrementFn={incrementIdx} setFn={setSubmitInfo} />
      );
    } else if (activeIdx === 3) {
      return (
        <GetCredVerifying
          name={loanAgreementFlowCard.title}
          incrementFn={incrementIdx}
        />
      );
    } else {
      return (
        <GetCredReceive
          idType={loanAgreementFlowCard.idType}
          imageUrl={credImageUrl}
          incrementFn={incrementIdx}
        />
      );
    }
  }

  return (
    <>
      <GetCredBanner
        imageUrl={loanAgreementFlowCard.imageUrl}
        title={loanAgreementFlowCard.title}
      />
      <div className="columns">
        <div className="column is-one-quarter">
          <GetCredMenu
            label={loanMenuProps.label}
            menuItems={loanMenuProps.menuItems}
            activeIdx={activeIdx}
          />
        </div>
        <div className="column is-half">{showScreen()}</div>
        <p style={{ fontSize: 30, color: "red" }}>{error}</p>
      </div>
    </>
  );
}

export default GetLoanAgreementCredential;
