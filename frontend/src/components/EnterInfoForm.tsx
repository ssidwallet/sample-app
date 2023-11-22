import React, { useState } from "react";
import { BankAccountSubmitInfo } from "../pages/GetBankAccountCredential";

interface EnterInfoFormProps {
  incrementFn: (data?: any) => void;
  setFn: React.Dispatch<
    React.SetStateAction<BankAccountSubmitInfo | undefined>
  >;
}

function EnterInfoForm({ incrementFn, setFn }: EnterInfoFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalIdNumber, setNationalIdNumber] = useState(0);

  return (
    <section className="section">
      <div className="field">
        <label className="label">First Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="John"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Last Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Doe"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">National ID</label>
        <div className="control">
          <input
            className="input"
            type="number"
            placeholder="123456789"
            onChange={(e) => setNationalIdNumber(Number(e.target.value))}
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
                firstName,
                lastName,
                nationalIdNumber,
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

export default EnterInfoForm;
