import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./pages/Homepage";
import GetBankAccountCredential from "./pages/GetBankAccountCredential";
import GetLoanAgreementCredential from "./pages/GetLoanAgreementCredential";
import SeeYou from "./pages/SeeYou";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/seeyou" component={SeeYou} />
        <Route exact path="/bank" component={GetBankAccountCredential} />
        <Route exact path="/loan" component={GetLoanAgreementCredential} />
      </Switch>
    </Router>
  );
}

export default App;
