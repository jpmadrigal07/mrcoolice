import React, { useState, useEffect } from 'react'
import {
  Table,
  Panel
} from 'rsuite'
import { useQuery, useMutation } from 'react-query'
import { triggerTopAlert } from '../../actions/topAlertActions';
import { connect } from 'react-redux';
import axios from "axios";
import EditUser from './EditStaff';

const UserList = (props) => {
  const { triggerTopAlert } = props
  const [isEditActive, setIsEditActive] = useState(false)
  const [staffId, setStaffId] = useState("")
  const [staffList, setStaffList] = useState([]);
  const { Column, HeaderCell, Cell } = Table

  const getStaffList = useQuery(
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
    }
  );

  useEffect(() => {
    if (!isEditActive) {
      getStaffList.refetch();
    }
  }, [isEditActive]);

  useEffect(() => {
    if (getStaffList.isSuccess) {
      if (
        !getStaffList.data.data?.errors &&
        getStaffList.data.data?.data?.users
      ) {
        const staffs = getStaffList.data.data?.data?.users;
        const staffsWithNumber = staffs?.reverse().map((res, index) => {
          return {
            id: index + 1,
            ...res,
          };
        });
        setStaffList(staffsWithNumber);
      }
    }
  }, [getStaffList.data]);

  const deleteStaff = useMutation((query) =>
    axios.post("http://localhost:5000/mrcoolice", { query })
  );

  const remove = (id) => {
    deleteStaff.mutate(
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
  }

  useEffect(() => {
    if (deleteStaff.isSuccess) {
      if (!deleteStaff.data?.data?.errors) {
        getStaffList.refetch();
        deleteStaff.reset();
        triggerTopAlert(true, "Successfully deleted", "success");
      } else {
        triggerTopAlert(
          true,
          deleteStaff.data?.data?.errors[0].message,
          "danger"
        );
      }
    }
    if (deleteStaff.isError) {
      triggerTopAlert(true, deleteStaff.error.message, "danger");
    }
  }, [deleteStaff]);

  const renderStaffs = () => {
    if (!isEditActive) {
      return (
        <Panel bordered style={{ margin: 10 }}>
          <Table
            height={300}
            data={staffList}
          >
            <Column>
              <HeaderCell>#</HeaderCell>
              <Cell dataKey="id" />
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
                      <a onClick={() => { setIsEditActive(!isEditActive); setStaffId(rowData._id) }}>
                        Edit
                      </a> |{'  '}
                      <a onClick={() => remove(rowData._id)}>
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
        staffId={staffId}
        staffList={staffList}
      />
    }
  }
  return (
    <div>
      {renderStaffs()}
    </div>
  )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(UserList);