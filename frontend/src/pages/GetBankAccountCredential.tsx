import axios from "axios";
import React, { useEffect, useState } from "react";
import EnterInfoForm from "../components/EnterInfoForm";
import GetCredBanner from "../components/GetCredBanner";
import GetCredInfo, { GetCredInfoProps } from "../components/GetCredInfo";
import GetCredMenu, { GetCredMenuProps } from "../components/GetCredMenu";
import GetCredReceive from "../components/GetCredReceive";
import GetCredShare from "../components/GetCredShare";
import GetCredVerifying from "../components/GetCredVerifying";
import { bankAccountFlowCard } from "../constants";

export interface BankAccountSubmitInfo {
  firstName: string;
  lastName: string;
  nationalIdNumber: number;
}

function GetBankAccountCredential() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prRequestId, setPrRequestId] = useState("");
  const [prImageUrl, setPrImageUrl] = useState("");
  const [shareStatus, setShareStatus] = useState(false);
  const [credImageUrl, setCredImageUrl] = useState("");
  const [submitInfo, setSubmitInfo] = useState<BankAccountSubmitInfo>();
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/presentation-request")
      .then((response) => {
        console.log(response.data);
        setPrRequestId(response.data.requestId);
        setPrImageUrl(response.data.qrcode);
      });
  }, []);

  useEffect(() => {
    setInterval(() => {
      if (!shareStatus && prRequestId !== "") {
        axios
          .get(`http://localhost:5000/auth/poll/${prRequestId}`)
          .then((response) => {
            if (response.status === 200) {
              localStorage.setItem("token", response.data.token);
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
          "http://localhost:5000/bank-account/receive-cred",
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

  function incrementIdx(data?: any) {
    if (activeIdx < bankAccountMenuProps.menuItems.length) {
      setActiveIdx(activeIdx + 1);
    } else {
      // eslint-disable-next-line no-restricted-globals
      location.href = "/seeyou?from=Acme Bank&to=App Dashboard&url=";
    }
  }

  const bankAccountMenuProps: GetCredMenuProps = {
    label: bankAccountFlowCard.idType,
    menuItems: [
      "Login with FlexID",
      "Bank Account Credential",
      "Enter Your Information",
      "Receive Bank Account Credential",
    ],
    activeIdx: 0,
  };

  const cityInfoProps: GetCredInfoProps = {
    title: bankAccountFlowCard.title,
    contentItems: [
      "Get things done without leaving your home. No more standing in lines.",
      "Access services and programs offered by the bank",
    ],
    shareString: "Acme Bank will ask you to share:",
    toShare: bankAccountFlowCard.toShare,
    incrementFn: incrementIdx,
  };

  function showScreen() {
    if (activeIdx === 0) {
      return (
        <GetCredShare
          toShare={["Authentication Credential"]}
          imageUrl={prImageUrl}
          shareStatus={shareStatus}
          incrementFn={incrementIdx}
        />
      );
    } else if (activeIdx === 1) {
      return (
        <GetCredInfo
          title={cityInfoProps.title}
          contentItems={cityInfoProps.contentItems}
          shareString={cityInfoProps.shareString}
          toShare={cityInfoProps.toShare}
          incrementFn={cityInfoProps.incrementFn}
        />
      );
    } else if (activeIdx === 2) {
      return <EnterInfoForm incrementFn={incrementIdx} setFn={setSubmitInfo} />;
    } else if (activeIdx === 3) {
      return (
        <GetCredVerifying
          name={bankAccountFlowCard.title}
          incrementFn={incrementIdx}
        />
      );
    } else {
      return (
        <GetCredReceive
          idType={bankAccountFlowCard.idType}
          imageUrl={credImageUrl}
          incrementFn={incrementIdx}
        />
      );
    }
  }

  return (
    <>
      <GetCredBanner
        imageUrl={bankAccountFlowCard.imageUrl}
        title={bankAccountFlowCard.title}
      />
      <div className="columns">
        <div className="column is-one-quarter">
          <GetCredMenu
            label={bankAccountMenuProps.label}
            menuItems={bankAccountMenuProps.menuItems}
            activeIdx={activeIdx}
          />
        </div>
        <div className="column is-half">{showScreen()}</div>
        <p style={{ fontSize: 30, color: "red" }}>ERROR: {error}</p>
      </div>
    </>
  );
}

export default GetBankAccountCredential;
