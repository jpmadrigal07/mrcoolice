import React, { useState, useEffect } from "react";
import Navigation from "../../components/Navigation/Navigation";
import { useQuery } from "react-query";
import axios from "axios";
import ExpensesReports from "../../components/Reports/ExpensesReports";
import { Col, Nav, Row, Panel } from "rsuite";
import moment from "moment";
import SalesReports from "../../components/Reports/SalesReports";

function Reports() {
  const [expenseList, setExpenseList] = useState([]);
  const [salesList, setSalesList] = useState([]);
  const [activeTab, setActiveTab] = useState("salesList");
  const getExpenseList = useQuery(
    "ExpenseList",
    async () => {
      const query = `{
            expenses {
                _id
                name
                cost
                createdAt
            }
          }`;
      return await axios.post("http://localhost:5000/mrcoolice", { query });
    },
    {
      refetchInterval: 1000,
    }
  );
  const getSalesList = useQuery(
    "SalesList",
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
          createdAt
        }
      }`;
      return await axios.post("http://localhost:5000/mrcoolice", { query });
    },
    {
      refetchInterval: 1000,
    }
  );
  useEffect(() => {
    if (getExpenseList.isSuccess) {
      if (
        !getExpenseList.data.data?.errors &&
        getExpenseList.data.data?.data?.expenses
      ) {
        setExpenseList(getExpenseList.data.data?.data?.expenses);
      }
    }
    if (getSalesList.isSuccess) {
      if (
        !getSalesList.data.data?.errors &&
        getSalesList.data.data?.data?.sales
      ) {
        setSalesList(getSalesList.data.data?.data?.sales);
      }
    }
  }, [
    getExpenseList.data,
    getExpenseList.isSuccess,
    getSalesList.data,
    getSalesList.isSuccess,
  ]);
  const renderTabs = () => {
    if (activeTab === "salesList") {
      return (
        <>
          <SalesReports salesList={salesList} />
        </>
      );
    } else if (activeTab === "expenseList") {
      return (
        <>
          <ExpensesReports expenseList={expenseList} />
        </>
      );
    }
  };
  return (
    <div>
      <Navigation currentPage={"reports"} />

      <Row>
        <Col style={{ marginBottom: 15 }}>
          <Nav
            appearance="subtle"
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
          >
            <Nav.Item eventKey="salesList">Sales list</Nav.Item>
            <Nav.Item eventKey="expenseList">Expense list</Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Panel bordered>{renderTabs()}</Panel>
    </div>
  );
}

export default Reports;
