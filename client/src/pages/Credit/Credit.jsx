import React, { useState, useEffect } from "react";
import AddCredit from "../../components/Credit/AddCredit";
import CreditList from "../../components/Credit/CreditList";
import Navigation from "../../components/Navigation/Navigation";
import { Nav } from "rsuite";
import { useLocation } from "react-router-dom";

const Credit = () => {
  const { search } = useLocation();
  const currentTab = search.replace("?tab=", "");
  const [activeTab, setActiveTab] = useState(
    currentTab !== "" ? currentTab : "cashList"
  );

  const renderTabContent = () => {
    if (activeTab === "addCredit") {
      return <AddCredit />;
    } else if (activeTab === "cashList") {
      return <CreditList />;
    }
  };

  return (
    <>
      <Navigation currentPage={"credit"} />
      <Nav
        appearance="subtle"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item eventKey="cashList">Credit List</Nav.Item>
        <Nav.Item eventKey="addCredit">Add Credit</Nav.Item>
      </Nav>
      {renderTabContent()}
    </>
  );
};

export default Credit;
