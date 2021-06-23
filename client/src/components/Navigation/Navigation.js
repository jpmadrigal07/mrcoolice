import React, { useEffect, useState } from "react";
import { Navbar, Nav, Dropdown, Loader } from "rsuite";
import { getToken, logOut } from "../../services/helper";
import axios from "axios";
import { useQuery } from "react-query";
import { graphqlUrl } from "../../services/constants";
import { triggerTopAlert } from "../../actions/topAlertActions";
import { updateLoggedInUser } from "../../actions/loggedInUserActions";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const Navigation = (props) => {
  const history = useHistory();
  const { triggerTopAlert, updateLoggedInUser, currentPage } = props;

  const [isAdmin, setIsAdmin] = useState(false);

  const verifyToken = useQuery("verifyToken", async () => {
    const token = getToken();
    const query = `{
        verifyToken(token: "${token}") {
            isVerified,
            userType
        }
    }`;
    return await axios.post(graphqlUrl, { query });
  });

  useEffect(() => {
    if (verifyToken.isSuccess) {
      if (verifyToken.data.data.errors) {
        verifyToken.remove();
        history.push("/login");
      } else {
        if (verifyToken.data.data?.data?.verifyToken.userType === "Admin") {
          setIsAdmin(true);
          updateLoggedInUser("", "", "Admin");
        } else {
          setIsAdmin(false);
          updateLoggedInUser("", "", "Staff");
        }
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
        <a href="#" className="navbar-brand logo">
          Mr. Cool Ice
        </a>
      </Navbar.Header>
      <Navbar.Body>
        <Nav>
          <Nav.Item
            active={currentPage === "order"}
            onClick={() => history.push("/order")}
          >
            Order
          </Nav.Item>
          <Nav.Item
            active={currentPage === "customer"}
            onClick={() => history.push("/customer")}
          >
            Customer
          </Nav.Item>
          <Nav.Item
            active={currentPage === "expenses"}
            onClick={() => history.push("/expenses")}
          >
            Expenses
          </Nav.Item>
          <Nav.Item
            active={currentPage === "reports"}
            onClick={() => history.push("/reports")}
          >
            Reports
          </Nav.Item>
          <Nav.Item
              active={currentPage === "product"}
              onClick={() => history.push("/product")}
            >
              Product
          </Nav.Item>
          {isAdmin ? (
            <Nav.Item
              active={currentPage === "staff"}
              onClick={() => history.push("/staff")}
            >
              Staff
            </Nav.Item>
          ) : null}
        </Nav>
        <Nav pullRight>
          <Dropdown title={isAdmin ? "Admin" : "Staff"}>
            <Dropdown.Item onClick={() => logOut()}>Logout</Dropdown.Item>
          </Dropdown>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
};

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert, updateLoggedInUser })(Navigation);
