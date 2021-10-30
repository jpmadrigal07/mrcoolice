import React from "react";
import { useState, useEffect } from "react";
import { Table, Panel } from "rsuite";
import { useMutation, useQuery } from "react-query";
import { triggerTopAlert } from "../../actions/topAlertActions";
import { connect } from "react-redux";
import axios from "axios";
import EditCustomer from "./EditCustomer";
import { GRAPHQL_ENDPOINT } from "../../services/constants";

const CustomerList = (props) => {
  const { triggerTopAlert, userType } = props;
  const { Column, HeaderCell, Cell } = Table;
  const [isEditActive, setIsEditActive] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    if (!isEditActive) {
      getCustomerList.refetch();
    }
  }, [isEditActive]);

  const getCustomerList = useQuery("getCustomerList", async () => {
    const query = `{
        customers {
            _id,
            description,
            type,
        }
      }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  useEffect(() => {
    if (getCustomerList.isSuccess) {
      if (
        !getCustomerList.data.data?.errors &&
        getCustomerList.data.data?.data?.customers
      ) {
        const customers = getCustomerList.data.data?.data?.customers;
        const customerWithNumber = customers?.reverse().map((res, index) => {
          return {
            id: index + 1,
            ...res,
          };
        });
        setCustomerList(customerWithNumber);
      }
    }
  }, [getCustomerList.data]);

  const deleteCustomer = useMutation((query) =>
    axios.post(GRAPHQL_ENDPOINT, { query })
  );

  const remove = (id) => {
    deleteCustomer.mutate(
      `mutation{
        deleteCustomer(_id: "${id}") {
            description
        }
      }`
    );
  };

  useEffect(() => {
    if (deleteCustomer.isSuccess) {
      if (!deleteCustomer.data?.data?.errors) {
        getCustomerList.refetch();
        deleteCustomer.reset();
        triggerTopAlert(true, "Successfully deleted", "success");
      } else {
        triggerTopAlert(
          true,
          deleteCustomer.data?.data?.errors[0].message,
          "danger"
        );
      }
    }
    if (deleteCustomer.isError) {
      triggerTopAlert(true, deleteCustomer.error.message, "danger");
    }
  }, [deleteCustomer]);

  const renderEdit = () => {
    if (!isEditActive) {
      return (
        <Panel bordered style={{ margin: "10px" }}>
          <Table height={400} data={customerList}>
            <Column>
              <HeaderCell>#</HeaderCell>
              <Cell dataKey="id" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Customer Description</HeaderCell>
              <Cell dataKey="description" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Customer Type</HeaderCell>
              <Cell dataKey="type" />
            </Column>
            <Column flexGrow={100} minWidth={50} fixed="right">
              <HeaderCell>Action</HeaderCell>
              <Cell>
                {(rowData) => {
                  if(userType === "Admin") {
                    return (
                      <span style={{ cursor: "pointer" }}>
                        <a
                          onClick={() => {
                            setIsEditActive(!isEditActive);
                            setCustomerId(rowData._id);
                          }}
                        >
                          Edit
                        </a>{" "}
                        |{"  "}
                        <a onClick={() => remove(rowData._id)}>Remove</a>
                      </span>
                    );
                  } else {
                    return (
                      <span style={{ cursor: "pointer" }}>
                        <a onClick={() => remove(rowData._id)}>Remove</a>
                      </span>
                    );
                  }
                }}
              </Cell>
            </Column>
          </Table>
        </Panel>
      );
    } else {
      return (
        <EditCustomer
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
          customerId={customerId}
          customerList={customerList}
        />
      );
    }
  };
  return <div>{renderEdit()}</div>;
};

const mapStateToProps = (global) => ({
  userType: global.loggedInUser.userType
});

export default connect(mapStateToProps, { triggerTopAlert })(CustomerList);
