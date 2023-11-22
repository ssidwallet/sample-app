import React from "react";
import FlowCard from "./FlowCard";
import StepCards from "./StepCards";

import { bankAccountFlowCard, loanAgreementFlowCard } from "../constants";

function Instructions() {
  return (
    <section className="section has-background-light">
      <div className="container is-fullhd">
        <div className="content">
          <StepCards />

          <br />
          <br />
          <FlowCard
            title={bankAccountFlowCard.title}
            url={bankAccountFlowCard.url}
            imageUrl={bankAccountFlowCard.imageUrl}
            idType={bankAccountFlowCard.idType}
            descriptionLine1={bankAccountFlowCard.descriptionLine1}
            descriptionLine2={bankAccountFlowCard.descriptionLine2}
            toShare={bankAccountFlowCard.toShare}
          />

          <br />
          <br />
          <FlowCard
            title={loanAgreementFlowCard.title}
            url={loanAgreementFlowCard.url}
            imageUrl={loanAgreementFlowCard.imageUrl}
            idType={loanAgreementFlowCard.idType}
            descriptionLine1={loanAgreementFlowCard.descriptionLine1}
            descriptionLine2={loanAgreementFlowCard.descriptionLine2}
            toShare={loanAgreementFlowCard.toShare}
          />
        </div>
      </div>
    </section>
  );
}

export default Instructions;
