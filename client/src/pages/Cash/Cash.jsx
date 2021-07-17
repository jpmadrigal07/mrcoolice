import React, { useState, useEffect } from "react";
import AddCash from "../../components/Cash/AddCash";
import CashList from "../../components/Cash/CashList";
import Navigation from "../../components/Navigation/Navigation";
import { Nav } from "rsuite";
import { useLocation } from "react-router-dom";

const Cash = () => {
  const { search } = useLocation();
  const currentTab = search.replace("?tab=", "");
  const [activeTab, setActiveTab] = useState(
    currentTab !== "" ? currentTab : "cashList"
  );

  const renderTabContent = () => {
    if (activeTab === "addCash") {
      return <AddCash />;
    } else if (activeTab === "cashList") {
      return <CashList />;
    }
  };

  return (
    <>
      <Navigation currentPage={"cash"} />
      <Nav
        appearance="subtle"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item eventKey="cashList">Cash List</Nav.Item>
        <Nav.Item eventKey="addCash">Add Cash</Nav.Item>
      </Nav>
      {renderTabContent()}
    </>
  );
};

export default Cash;
