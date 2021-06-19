import React, { useState, useEffect } from "react";
import AddCustomer from "../../components/Customer/AddCustomer";
import CustomerList from "../../components/Customer/CustomerList";
import Navigation from "../../components/Navigation/Navigation";
import { Nav } from "rsuite";
import axios from "axios";
import { graphqlUrl } from "../../services/constants";
import { useLocation } from "react-router-dom";

const Customer = () => {
  const { search } = useLocation();
  const currentTab = search.replace("?tab=", "")
  const [activeTab, setActiveTab] = useState(currentTab !== "" ? currentTab : "customerList");

  const renderTabContent = () => {
    if (activeTab === "addCustomer") {
      return (
        <AddCustomer />
      );
    } else if (activeTab === "customerList") {
      return (
        <CustomerList />
      );
    }
  };

  return (
    <>
      <Navigation currentPage={"customer"} />
      <Nav
        appearance="subtle"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item eventKey="customerList">Customer List</Nav.Item>
        <Nav.Item eventKey="addCustomer">Add Customer</Nav.Item>
      </Nav>
      {renderTabContent()}
    </>
  );
};

export default Customer;
