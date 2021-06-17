import React, { useState, useEffect } from "react";
import AddCustomer from "../../components/Customer/AddCustomer";
import CustomerList from "../../components/Customer/CustomerList";
import Navigation from "../../components/Navigation/Navigation";
import { Col, Nav } from "rsuite";
import { useQuery } from "react-query";
import Cookies from "js-cookie";
import axios from "axios";


const Customer = () => {
  const [activeTab, setActiveTab] = useState("addCustomer");
  const [customerList, setCustomerList] = useState();

  const getCustomerList = useQuery(
    "OrderList",
    async () => {
      const query = `{
        customers {
            _id
            description
        }
      }`;
      return await axios.post("http://localhost:5000/mrcoolice", { query });
    },
    {
      refetchInterval: 1000,
    }
  );
  useEffect(() => {
    if (getCustomerList.isSuccess) {
      if (
        !getCustomerList.data.data?.errors &&
        getCustomerList.data.data?.data?.customers
      ) {
        setCustomerList(getCustomerList.data.data?.data?.customers);
      }
    }
  }, [getCustomerList.data, getCustomerList.isSuccess]);

  const renderTabs = () => {
    if (activeTab === "addCustomer") {
      return (
        <>
          <AddCustomer />
        </>
      );
    } else if (activeTab === "customerList") {
      return (
        <>
          <CustomerList customerList={customerList} />
        </>
      );
    }
  };
  return (
    <div className="login-bg">
      <Navigation currentPage={"customer"} />
      <Col style={{ marginBottom: 15 }}>
        <Nav
          appearance="subtle"
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
        >
          <Nav.Item eventKey="addCustomer">Add customer</Nav.Item>
          <Nav.Item eventKey="customerList">Customer list</Nav.Item>
        </Nav>
      </Col>
      {renderTabs()}
    </div>
  );
};

export default Customer;
