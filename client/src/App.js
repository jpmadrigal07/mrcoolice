import 'rsuite/dist/styles/rsuite-default.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/Login/Login"
import Order from './pages/Order/Order';
import Customer from './pages/Customer/Customer';
import './App.css';
import Expenses from './pages/Expenses/Expenses';

function App() {
  const renderRoutes = () => {
    return (
      <>
        <Route
          path="/"
          exact
          render={() => <Login/>}
        />
        <Route
          path="/login"
          exact
          render={() => <Login/>}
        />
        <Route
          path="/order"
          exact
          render={() => <Order/>}
        />
        <Route
          path="/customer"
          exact
          render={() => <Customer/>}
        />
        <Route
          path="/expenses"
          exact
          render={() => <Expenses/>}
        />
      </>
    )
  }

  return (
    <>
      <Router>
        {renderRoutes()}
      </Router>
    </>
  );
}

export default App;
