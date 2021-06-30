import React, { useState, useEffect } from "react";
import { Table, Panel } from "rsuite";
import EditExpense from "./EditExpense";
import { useMutation, useQuery } from "react-query";
import { triggerTopAlert } from "../../actions/topAlertActions";
import axios from "axios";
import { connect } from "react-redux";
import { graphqlUrl } from "../../services/constants";

const ExpenseList = (props) => {
  const { userId, triggerTopAlert, userType } = props;
  const [isEditActive, setIsEditActive] = useState(false);
  const [expenseId, setExpenseId] = useState("");
  const [expenseList, setExpenseList] = useState([]);
  const { Column, HeaderCell, Cell } = Table;

  const getExpenseList = useQuery("getExpenseList", async () => {
    const query = `{
        expenses {
            _id
            name
            vendor
            cost
        }
      }`;
    return await axios.post(graphqlUrl, { query });
  });

  useEffect(() => {
    if (!isEditActive) {
      getExpenseList.refetch();
    }
  }, [isEditActive]);

  useEffect(() => {
    if (getExpenseList.isSuccess) {
      if (
        !getExpenseList.data.data?.errors &&
        getExpenseList.data.data?.data?.expenses
      ) {
        const expenses = getExpenseList.data.data?.data?.expenses;
        const expensesWithNumber = expenses?.reverse().map((res, index) => {
          return {
            number: index + 1,
            _id: res._id,
            name: res.name,
            vendor: res.vendor ? res.vendor : "---",
            cost: res.cost
          };
        });
        setExpenseList(expensesWithNumber);
      }
    }
  }, [getExpenseList.data]);

  

  const deleteExpense = useMutation((query) =>
    axios.post(graphqlUrl, { query })
  );

  const remove = (id) => {
    deleteExpense.mutate(
      `mutation{
        deleteExpense(_id: "${id}") {
            name
            vendor
            cost
        }
      }`
    );
  };

  useEffect(() => {
    if (deleteExpense.isSuccess) {
      if (!deleteExpense.data?.data?.errors) {
        getExpenseList.refetch();
        deleteExpense.reset();
        triggerTopAlert(true, "Successfully deleted", "success");
      } else {
        triggerTopAlert(
          true,
          deleteExpense.data?.data?.errors[0].message,
          "danger"
        );
      }
    }
    if (deleteExpense.isError) {
      triggerTopAlert(true, deleteExpense.error.message, "danger");
    }
  }, [deleteExpense]);

  const renderExpense = () => {
    if (!isEditActive) {
      return (
        <Panel bordered style={{ margin: "10px" }}>
          <Table height={400} data={expenseList}>
            <Column>
              <HeaderCell>#</HeaderCell>
              <Cell dataKey="number" />
            </Column>
            <Column flexGrow={100} minWidth={100}>
              <HeaderCell>Expense name</HeaderCell>
              <Cell dataKey="name" />
            </Column>
            <Column flexGrow={100} minWidth={100}>
              <HeaderCell>Cost (Pesos)</HeaderCell>
              <Cell dataKey="cost" />
            </Column>
            <Column flexGrow={100} minWidth={100}>
              <HeaderCell>Vendor/Client</HeaderCell>
              <Cell dataKey="vendor" />
            </Column>
            <Column flexGrow={100} minWidth={100} fixed="right">
              <HeaderCell>Action</HeaderCell>
              <Cell>
                {(rowData) => {
                  if(userType === "Admin") {
                    return (
                      <span style={{ cursor: "pointer" }}>
                        <a
                          onClick={() => {
                            setIsEditActive(!isEditActive);
                            setExpenseId(rowData._id);
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
        <EditExpense
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
          expenseId={expenseId}
          userId={userId}
          expenseList={expenseList}
        />
      );
    }
  };
  return <div>{renderExpense()}</div>;
};

const mapStateToProps = (global) => ({
  userType: global.loggedInUser.userType
});

export default connect(mapStateToProps, { triggerTopAlert })(ExpenseList);
