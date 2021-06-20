import React, { useState, useEffect } from "react";
import "./Order.css";
import AddOrder2 from "../../components/Order/AddOrder2";
import Navigation from "../../components/Navigation/Navigation";
import { Col, Nav, Row, Panel } from "rsuite";
import { useQuery } from "react-query";
import OrderList from "../../components/Order/OrderList";
import axios from "axios";

const Order = () => {
  const [activeTab, setActiveTab] = useState("addOrder");
  const [orderList, setOrderList] = useState();
  const [customerList, setCustomerList] = useState()
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
  const getOrderList = useQuery(
    "OrderList",
    async () => {
      const query = `{
        sales {
          customerId {
              _id
              description
            }
          _id
          iceType
          weight
          scaleType
        }
      }`;
      return await axios.post("http://localhost:5000/mrcoolice", { query });
    },
    {
      refetchInterval: 1000,
    }
  );
  const getCustomerList = useQuery(
    "CustomerList",
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
    if (getCustomerList.isSuccess && getCustomerList.isFetched) {
      if (
        !getCustomerList.data.data?.errors &&
        getCustomerList.data.data?.data?.customers
      ) {
        setCustomerList(getCustomerList.data.data?.data?.customers);
      }
    }
    if (getOrderList.isSuccess) {
      if (
        !getOrderList.data.data?.errors &&
        getOrderList.data.data?.data?.sales
      ) {
        setOrderList(getOrderList.data.data?.data?.sales);
      }
    }
  }, [getOrderList.data, getOrderList.isSuccess, getCustomerList.data, getCustomerList.isSuccess]);
  const renderTabs = () => {
    if (activeTab === "addOrder") {
      return (
          <AddOrder2
            iceTypeContent={iceTypeContent}
            weightContent={weightContent}
            scaleContent={scaleContent}
            customerList={customerList}
          />
      );
    } else if (activeTab === "orderList") {
      return (
          <OrderList 
            iceTypeContent={iceTypeContent}
            weightContent={weightContent}
            scaleContent={scaleContent}
            orderList={orderList} 
            customerList={customerList} 
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
