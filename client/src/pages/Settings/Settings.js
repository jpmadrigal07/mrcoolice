import React, { useState, useEffect } from "react";
import Navigation from "../../components/Navigation/Navigation";
import { Col, Nav, Row, Panel } from "rsuite";
import { useQuery } from 'react-query'
import axios from "axios";
import UserList from "../../components/User/UserList";
import AddUser from "../../components/User/AddUser";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("addUser");
    const [userList, setUserList] = useState()
    const staffUserType = "Staff";
    const getUserList = useQuery(
      "UserList",
      async () => {
        const query = `{
          users {
            _id
            username
            password
            userType
            firstName
            lastName
          }
        }`;
        return await axios.post("http://localhost:5000/mrcoolice", { query });
      },
      {
        refetchInterval: 1000,
      }
    );
    
    useEffect(() => {
      if (getUserList.isSuccess) {
        if (!getUserList.data.data?.errors && getUserList.data.data?.data?.users) {
          setUserList(getUserList.data.data?.data?.users);
        }
      }
    }, [getUserList.data, getUserList.isSuccess])

    const renderTabs = () => {
        if (activeTab === "addUser") {
          return (
            <>
                <AddUser staffUserType={staffUserType} />
            </>
          );
        } else if (activeTab === "userList") {
          return (
            <>
              <UserList userList={userList} staffUserType={staffUserType} />
            </>
          );
        }
      };
  return (
    <div>
      <Navigation currentPage={"settings"} />
      <Row>
        <Col style={{ marginBottom: 15 }}>
          <Nav
            appearance="subtle"
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
          >
            <Nav.Item eventKey="addUser">Register account</Nav.Item>
            <Nav.Item eventKey="userList">Account list</Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Panel bordered>{renderTabs()}</Panel>
    </div>
  );
};

export default Settings;
