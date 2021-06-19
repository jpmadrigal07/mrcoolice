import React, { useState, useEffect } from "react";
import Navigation from "../../components/Navigation/Navigation";
import { Col, Nav, Row, Panel } from "rsuite";
import ExpenseList from "../../components/Expenses/ExpenseList";
import Cookies from "js-cookie";
import { useQuery } from "react-query";
import axios from "axios";
import AddExpense from "../../components/Expenses/AddExpense";

const Expenses = () => {
  const [activeTab, setActiveTab] = useState("addExpense");
  const [userId, setUserId] = useState("");
  const [expenseList, setExpenseList] = useState();
  const token = Cookies.get("sessionToken");
  const getId = useQuery(
    "getId",
    async () => {
      const query = `{
            verifyToken(token: "${token}") {
            userId
            }
      }`;
      return await axios.post("http://localhost:5000/mrcoolice", { query });
    },
    {
      refetchInterval: 1000,
    }
  );

  const getExpenseList = useQuery(
    "ExpenseList",
    async () => {
      const query = `{
        expenses {
            _id
            name
            cost
        }
      }`;
      return await axios.post("http://localhost:5000/mrcoolice", { query });
    },
    {
      refetchInterval: 1000,
    }
  );

  useEffect(() => {
    if (getId.isSuccess) {
      if (!getId.data.data?.errors && getId.data.data?.data?.verifyToken) {
        setUserId(getId.data.data?.data?.verifyToken?.userId);
      }
    }
    if (getExpenseList.isSuccess) {
      if (
        !getExpenseList.data.data?.errors &&
        getExpenseList.data.data?.data?.expenses
      ) {
        setExpenseList(getExpenseList.data.data?.data?.expenses);
      }
    }
  }, [
    getId.data,
    getId.isSuccess,
    getExpenseList.data,
    getExpenseList.isSuccess,
  ]);
  const renderTabs = () => {
    if (activeTab === "addExpense") {
      return (
        <>
          <AddExpense userId={userId} />
        </>
      );
    } else if (activeTab === "expenseList") {
      return (
        <>
          <ExpenseList expenseList={expenseList} userId={userId} />
        </>
      );
    }
  };
  return (
    <div>
      <Navigation currentPage={"expenses"} />

          <Nav
            appearance="subtle"
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
          >
            <Nav.Item eventKey="addExpense">Add Expense</Nav.Item>
            <Nav.Item eventKey="expenseList">Expense List</Nav.Item>
          </Nav>

      {renderTabs()}
    </div>
  );
};

export default Expenses;
