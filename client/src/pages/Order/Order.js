import React from 'react'
import "./Order.css";
import LoginForm from "../../components/Login/LoginForm"
import Navigation from "../../components/Navigation/Navigation"
import { Navbar, Nav, Dropdown, Panel, Form, FormGroup, ControlLabel, FormControl, Input, ButtonToolbar, Button, Col, Row, SelectPicker } from 'rsuite';

const Order = () => {
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
        <div className="login-bg">
            <Navigation/>
            <Row gutter={16}>
    <Col style={{margin: '10px'}} md={6}>
    <Panel bordered style={{backgroundColor: 'white'}}>
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
      <ControlLabel>Ice Type</ControlLabel>
      <SelectPicker data={values2} block/>
    </FormGroup>
    <FormGroup>
      <ControlLabel>Weight</ControlLabel>
      <SelectPicker data={values2} block/>
    </FormGroup>
    <FormGroup>
      <ControlLabel>Weight (Custom)</ControlLabel>
      <Input type="number" block />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Scale Type</ControlLabel>
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
        </div>
    )
}

export default Order
