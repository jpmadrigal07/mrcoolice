import './App.css';
import { Navbar, Nav, Dropdown, Panel, Form, FormGroup, ControlLabel, FormControl, Input, ButtonToolbar, Button, Col, Row, SelectPicker } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';

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
  return (
    <>
    <Navbar appearance="inverse">
    <Navbar.Header>
      <a href="#" className="navbar-brand logo">Mr. Cool Ice</a>
    </Navbar.Header>
    <Navbar.Body>
      <Nav>
        <Dropdown title="Order">
          <Dropdown.Item>Add</Dropdown.Item>
          <Dropdown.Item>List</Dropdown.Item>
        </Dropdown>
        <Dropdown title="Customer">
          <Dropdown.Item>Add</Dropdown.Item>
          <Dropdown.Item>List</Dropdown.Item>
        </Dropdown>
        <Dropdown title="Expenses">
          <Dropdown.Item>Add</Dropdown.Item>
          <Dropdown.Item>List</Dropdown.Item>
        </Dropdown>
        <Nav.Item>Reports</Nav.Item>
      </Nav>
      <Nav pullRight>
        <Dropdown title="Admin">
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Logout</Dropdown.Item>
        </Dropdown>
      </Nav>
    </Navbar.Body>
  </Navbar>
  <Row gutter={16}>
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
  </Row>
  </>
  );
}

export default App;
