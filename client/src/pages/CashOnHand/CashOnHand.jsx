import React, { useState, useEffect } from "react";
import AddCashOnHand from "../../components/CashOnHand/AddCashOnHand";
import CashOnHandList from "../../components/CashOnHand/CashOnHandList";
import Navigation from "../../components/Navigation/Navigation";
import { Nav } from "rsuite";
import { useLocation } from "react-router-dom";

const CashOnHand = () => {
  const { search } = useLocation();
  const currentTab = search.replace("?tab=", "");
  const [activeTab, setActiveTab] = useState(
    currentTab !== "" ? currentTab : "cashList"
  );

  const renderTabContent = () => {
    if (activeTab === "addCashOnHand") {
      return <AddCashOnHand />;
    } else if (activeTab === "cashList") {
      return <CashOnHandList />;
    }
  };

  return (
    <>
      <Navigation currentPage={"cashOnHand"} />
      <Nav
        appearance="subtle"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item eventKey="cashList">Cash On Hand List</Nav.Item>
        <Nav.Item eventKey="addCashOnHand">Add Cash On Hand</Nav.Item>
      </Nav>
      {renderTabContent()}
    </>
  );
};

export default CashOnHand;
