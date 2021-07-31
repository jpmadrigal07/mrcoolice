import React, { useEffect } from "react";
import "rsuite/dist/styles/rsuite-default.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Order from "./pages/Order/Order";
import Customer from "./pages/Customer/Customer";
import "./App.css";
import Expenses from "./pages/Expenses/Expenses";
import Staff from "./pages/Staff/Staff";
import Reports from "./pages/Reports/Reports";
import Reports2 from "./pages/Reports/Reports2";
import Credit from "./pages/Credit/Credit";
import Receipt from "./pages/Receipt/Receipt";
import Product from "./pages/Product/Product";
import Cash from "./pages/Cash/Cash";
import { Alert } from "rsuite";
import { connect } from "react-redux";
import { triggerTopAlert } from "./actions/topAlertActions";

function App(props) {
  const { alertMessage, alertType, alertShowAlert, triggerTopAlert } = props;

  useEffect(() => {
    if (alertShowAlert) {
      if (alertType === "success") {
        Alert.success(alertMessage, 3000, () => triggerTopAlert(false, "", ""));
      } else if (alertType === "warning") {
        Alert.warning(alertMessage, 3000, () => triggerTopAlert(false, "", ""));
      } else if (alertType === "danger") {
        Alert.error(alertMessage, 3000, () => triggerTopAlert(false, "", ""));
      }
    }
  }, [alertMessage, alertType, alertShowAlert]);

  const renderRoutes = () => {
    return (
      <>
        <Route path="/" exact render={() => <Login />} />
        <Route path="/login" exact render={() => <Login />} />
        <Route path="/order" exact render={() => <Order />} />
        <Route path="/customer" exact render={() => <Customer />} />
        <Route path="/expenses" exact render={() => <Expenses />} />
        <Route path="/staff" exact render={() => <Staff />} />
        <Route path="/product" exact render={() => <Product />} />
        <Route path="/cash" exact render={() => <Cash />} />
        <Route path="/reports" exact render={() => <Reports />} />
        <Route path="/receipt" exact render={() => <Receipt />} />
        <Route path="/credit" exact render={() => <Credit />} />
        <Route path="/print-report" exact render={() => <Reports2 />} />
      </>
    );
  };

  return (
    <>
      <Router>{renderRoutes()}</Router>
    </>
  );
}

const mapStateToProps = (global) => ({
  alertMessage: global.topAlert.message,
  alertType: global.topAlert.type,
  alertShowAlert: global.topAlert.showAlert,
});

export default connect(mapStateToProps, { triggerTopAlert })(App);
