import './App.css';
import { Navbar, Nav, Dropdown, Panel, Form, FormGroup, ControlLabel, FormControl, Input, ButtonToolbar, Button, Col, Row, SelectPicker } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/Login/Login"
import Order from "./pages/Order/Order"

function App() {
  const values = [
    {
      "label": "MAM LOLITA",
      "value": "MAM LOLITA",
      "role": "Master"
    },
    {
      "label": "KUYA OYET",
      "value": "KUYA OYET",
      "role": "Master"
    },
    {
      "label": "SIR BANEK",
      "value": "SIR BANEK",
      "role": "Master"
    }
  ]
  const values2 = [
    {
      "label": "30 kilogram (Tube)",
      "value": "30 kilogram (Tube)",
      "role": "Master"
    },
    {
      "label": "50 kilogram (Tube)",
      "value": "50 kilogram (Tube)",
      "role": "Master"
    },
    {
      "label": "2 kilogram (Tube)",
      "value": "2 kilogram (Tube)",
      "role": "Master"
    },
    {
      "label": "5 kilogram (Tube)",
      "value": "5 kilogram (Tube)",
      "role": "Master"
    },
    {
      "label": "30 kilogram (Crushed)",
      "value": "30 kilogram (Crushed)",
      "role": "Master"
    },
    {
      "label": "4 kilogram (Crushed)",
      "value": "4 kilogram (Crushed)",
      "role": "Master"
    }
  ]

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
      </>
    )
  }

  return (
    <>
  {/* <Row gutter={16}>
    <Col style={{margin: '10px'}} md={6}>
    <Panel bordered>
  <Form>
    <FormGroup>
      <ControlLabel>Cashier</ControlLabel>
      <h4>Trixie C. Aguila</h4>
    </FormGroup>
    <FormGroup>
      <ControlLabel>Customer</ControlLabel>
      <SelectPicker data={values} block/>
    </FormGroup>
    <FormGroup>
      <ControlLabel>Kilogram</ControlLabel>
      <SelectPicker data={values2} block/>
    </FormGroup>
    <FormGroup>
      <ControlLabel>Custom Quantity</ControlLabel>
      <Input type="number" block />
    </FormGroup>
    <FormGroup>
      <ButtonToolbar>
        <Button appearance="primary">Create</Button>
        <Button appearance="default">Reset</Button>
      </ButtonToolbar>
    </FormGroup>
  </Form>
  </Panel>
    </Col>
  </Row> */}
    <Router>
      {renderRoutes()}
    </Router>
  </>
  );
}

export default App;
