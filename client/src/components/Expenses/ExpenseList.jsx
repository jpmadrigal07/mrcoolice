import React, { useState, useEffect } from 'react'
import {
  Table,
  Panel
} from 'rsuite'
import EditExpense from './EditExpense'
import { useMutation, useQuery } from "react-query";
import { triggerTopAlert } from '../../actions/topAlertActions';
import axios from "axios";
import { connect } from 'react-redux';
import { graphqlUrl } from "../../services/constants";

const ExpenseList = (props) => {
  const { userId, triggerTopAlert } = props
  const [isEditActive, setIsEditActive] = useState(false)
  const [expenseId, setExpenseId] = useState("")
  const [expenseList, setExpenseList] = useState([]);
  const { Column, HeaderCell, Cell } = Table

  const getExpenseList = useQuery(
    "getExpenseList",
    async () => {
      const query = `{
        expenses {
            _id
            name
            cost
        }
      }`;
      return await axios.post("http://localhost:5000/mrcoolice", { query });
    }
  );

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
            id: index + 1,
            ...res,
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
        <Panel bordered style={{ margin: '10px' }}>
        <Table
          height={400}
          data={expenseList}
        >
          <Column>
            <HeaderCell>#</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column flexGrow={100} minWidth={100} >
            <HeaderCell>Expense name</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={100} minWidth={100} >
            <HeaderCell>Cost</HeaderCell>
            <Cell dataKey="cost" />
          </Column>
          <Column flexGrow={100} minWidth={100} fixed="right">
            <HeaderCell>Action</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <span style={{ cursor: 'pointer' }}>
                    <a onClick={() => {
                      setIsEditActive(!isEditActive); 
                      setExpenseId(rowData._id)
                      }}>
                      Edit
                    </a> {'  '}|{'  '}
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
      return <EditExpense
        isEditActive={isEditActive}
        setIsEditActive={setIsEditActive}
        expenseId={expenseId}
        userId={userId}
        expenseList={expenseList}
      />
    }
  }
  return (
    <div>
      {renderExpense()}
    </div>
  )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(ExpenseList);
