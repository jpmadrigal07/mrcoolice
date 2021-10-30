import React, { useState, useEffect } from "react";
import "./Order.css";
import AddOrder2 from "../../components/Order/AddOrder2";
import Navigation from "../../components/Navigation/Navigation";
import { Col, Nav, Row, Panel } from "rsuite";
import { useQuery } from "react-query";
import OrderList from "../../components/Order/OrderList";
import axios from "axios";
import { GRAPHQL_ENDPOINT } from "../../services/constants";

const Order = () => {
  const [activeTab, setActiveTab] = useState("addOrder");
  const iceTypeContent = [
    {
      label: "Tube",
      value: "Tube",
      role: "Master",
    },
    {
      label: "Crushed",
      value: "Crushed",
      role: "Master",
    },
  ];
  const weightContent = [
    {
      label: "2",
      value: 2,
    },
    {
      label: "4",
      value: 4,
    },
    {
      label: "5",
      value: 5,
    },
    {
      label: "30",
      value: 30,
    },
    {
      label: "50",
      value: 50,
    },
  ];

  const scaleContent = [
    {
      label: "kg",
      value: "kg",
    },
    {
      label: "g",
      value: "g",
    },
  ];
  
  const renderTabs = () => {
    if (activeTab === "addOrder") {
      return (
        <AddOrder2
          iceTypeContent={iceTypeContent}
          weightContent={weightContent}
          scaleContent={scaleContent}
        />
      );
    } else if (activeTab === "orderList") {
      return (
        <OrderList
          iceTypeContent={iceTypeContent}
          weightContent={weightContent}
          scaleContent={scaleContent}
        />
      );
    }
  };
  return (
    <>
      <Navigation currentPage={"order"} />

      <Nav
        appearance="subtle"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item eventKey="addOrder">Add Order</Nav.Item>
        <Nav.Item eventKey="orderList">Order List</Nav.Item>
      </Nav>

      {renderTabs()}
    </>
  );
};

export default Order;
