import React, {useEffect, useState} from 'react';
import { Navbar, Nav, Dropdown, Loader } from 'rsuite';
import { getToken, logOut } from '../../services/helper';
import axios from 'axios';
import { useQuery } from "react-query";
import { graphqlUrl } from '../../services/constants';
import { triggerTopAlert } from "../../actions/topAlertActions";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const Navigation = (props) => {
  const history = useHistory();
  const { triggerTopAlert, currentPage } = props;

  const verifyToken = useQuery("verifyToken", async () => {
    const token = getToken();
    const query = `{
        verifyToken(token: "${token}") {
            isVerified
        }
    }`
    return await axios.post(
        graphqlUrl, { query }
    );
  }, {
    refetchInterval: 5000,
    refetchIntervalInBackground: true
  });

  useEffect(() => {
    if (verifyToken.isSuccess) {
        if (verifyToken.data.data.errors) {
          verifyToken.remove();
          history.push("/login");
        }
    }
    if (verifyToken.isError) {
      verifyToken.remove();
      history.push("/login");
      triggerTopAlert(true, "Unknown error occured", "danger");
    }
  }, [verifyToken.data, verifyToken.isError, verifyToken.isSuccess]);

  return (
    <Navbar appearance="inverse">
      <Navbar.Header>
        <a href="#" className="navbar-brand logo">Mr. Cool Ice</a>
      </Navbar.Header>
      <Navbar.Body>
            <Nav>
              <Nav.Item active={currentPage === "order"} onClick={() => history.push("/order")}>Order</Nav.Item>
              <Nav.Item active={currentPage === "customer"} onClick={() => history.push("/customer")}>Customer</Nav.Item>
              <Nav.Item active={currentPage === "expenses"} onClick={() => history.push("/expenses")}>Expenses</Nav.Item>
              <Nav.Item>Reports</Nav.Item>
            </Nav>
            <Nav pullRight>
              <Dropdown title="Admin">
                <Dropdown.Item active={currentPage === "settings"} onClick={() => history.push("/settings")}>Settings</Dropdown.Item>
                <Dropdown.Item onClick={() => logOut()}>Logout</Dropdown.Item>
              </Dropdown>
            </Nav>

      </Navbar.Body>
    </Navbar>
  )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(Navigation);
