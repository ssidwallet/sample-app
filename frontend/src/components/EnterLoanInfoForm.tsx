import React, { useState } from "react";
import { LoanSubmitInfo } from "../pages/GetLoanAgreementCredential";

interface EnterInfoFormProps {
  incrementFn: (data?: any) => void;
  setFn: React.Dispatch<React.SetStateAction<LoanSubmitInfo | undefined>>;
}

function EnterLoanInfoForm({ incrementFn, setFn }: EnterInfoFormProps) {
  const [amount, setAmount] = useState(0);

  return (
    <section className="section">
      <div className="field">
        <label className="label">Amount</label>
        <div className="control">
          <input
            className="input"
            type="number"
            placeholder="5000"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <a
            href="#"
            className="button is-primary"
            onClick={() => {
              setFn({
                amount,
              });
              incrementFn();
            }}
          >
            Submit
          </a>
        </div>
        <div className="control">
          <button className="button is-link is-light">Cancel</button>
        </div>
      </div>
    </section>
  );
}

export default EnterLoanInfoForm;
