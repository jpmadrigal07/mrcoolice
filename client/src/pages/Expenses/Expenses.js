import React, { useState } from "react";
import Navigation from "../../components/Navigation/Navigation";
import { Nav } from "rsuite";
import ExpenseList from "../../components/Expenses/ExpenseList";
import AddExpense from "../../components/Expenses/AddExpense";
import { useLocation } from "react-router-dom";

const Expenses = () => {
  const { search } = useLocation();
  const currentTab = search.replace("?tab=", "");
  const [activeTab, setActiveTab] = useState(
    currentTab !== "" ? currentTab : "expenseList"
  );
  
  const renderTabs = () => {
    if (activeTab === "addExpense") {
      return (
        <>
          <AddExpense />
        </>
      );
    } else if (activeTab === "expenseList") {
      return (
        <>
          <ExpenseList />
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
        <Nav.Item eventKey="expenseList">Expense List</Nav.Item>
        <Nav.Item eventKey="addExpense">Add Expense</Nav.Item>
      </Nav>

      {renderTabs()}
    </div>
  );
};

export default Expenses;
