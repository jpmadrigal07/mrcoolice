import React, { useState } from "react";
import Navigation from "../../components/Navigation/Navigation";
import { Nav } from "rsuite";
import UserList from "../../components/User/StaffList";
import AddUser from "../../components/User/AddStaff";
import { useLocation } from "react-router-dom";

const Staff = () => {
  const { search } = useLocation();
  const currentTab = search.replace("?tab=", "");
  const [activeTab, setActiveTab] = useState(
    currentTab !== "" ? currentTab : "staffList"
  );

  const renderTabs = () => {
    if (activeTab === "addStaff") {
      return (
        <>
          <AddUser />
        </>
      );
    } else if (activeTab === "staffList") {
      return (
        <>
          <UserList />
        </>
      );
    }
  };
  return (
    <div>
      <Navigation currentPage={"staff"} />

      <Nav
        appearance="subtle"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item eventKey="staffList">Staff List</Nav.Item>
        <Nav.Item eventKey="addStaff">Create Staff</Nav.Item>
      </Nav>

      {renderTabs()}
    </div>
  );
};

export default Staff;
