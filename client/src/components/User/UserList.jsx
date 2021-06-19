import React, { useState } from 'react'
import {
  Table,
  Panel
} from 'rsuite'
import { useMutation } from 'react-query'
import { triggerTopAlert } from '../../actions/topAlertActions';
import { connect } from 'react-redux';
import axios from "axios";
import EditUser from './EditUser';

const UserList = (props) => {
  const { userList, triggerTopAlert, staffUserType } = props
  const [isEditActive, setIsEditActive] = useState(false)
  const [userId, setUserId] = useState("")
  const { Column, HeaderCell, Cell } = Table

  const deleteUser = useMutation((query) =>
    axios.post("http://localhost:5000/mrcoolice", { query })
  );
  const handleRemove = (id) => {
    console.log(id)
    deleteUser.mutate(
      `mutation{
        deleteUser(_id: "${id}") {
          username,
          password,
          userType,
          firstName,
          lastName
        }
      }`
    )
    triggerTopAlert(true, "Expense successfully deleted", "success")
  }

  const renderAccounts = () => {
    if (!isEditActive) {
      return (
        <Panel bordered style={{margin: 10}}>
        <Table
          data={userList}
        >
          <Column>
            <HeaderCell>#</HeaderCell>
            <Cell dataKey="number" />
          </Column>
          <Column flexGrow={100} minWidth={200}>
            <HeaderCell>Username</HeaderCell>
            <Cell dataKey="username" />
          </Column>
          <Column flexGrow={100} minWidth={200}>
            <HeaderCell>User Type</HeaderCell>
            <Cell dataKey="userType" />
          </Column>
          <Column flexGrow={100} minWidth={200}>
            <HeaderCell>First name</HeaderCell>
            <Cell dataKey="firstName" />
          </Column>
          <Column flexGrow={100} minWidth={200}>
            <HeaderCell>Last name</HeaderCell>
            <Cell dataKey="lastName" />
          </Column>
          <Column flexGrow={100} minWidth={120} fixed="right">
            <HeaderCell>Action</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <span>
                    <a onClick={() => {setIsEditActive(!isEditActive); setUserId(rowData._id)}}>
                      Edit
                    </a> |{'  '}
                    <a onClick={() => handleRemove(rowData._id)}>
                      Remove
                    </a>
                  </span>
                );
              }}
            </Cell>
          </Column>
        </Table>
        </Panel>
      )
    } else {
      return <EditUser 
      setIsEditActive={setIsEditActive}
      isEditActive={isEditActive}
      userId={userId}
      userList={userList}
      staffUserType={staffUserType}
      />
    }
  }
  return (
    <div>
      {renderAccounts()}
    </div>
  )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(UserList);
