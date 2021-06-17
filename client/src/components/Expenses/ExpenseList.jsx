import React, { useState } from 'react'
import {
  Table
} from 'rsuite'
import EditExpense from './EditExpense'
import { useMutation } from 'react-query'
import { triggerTopAlert } from '../../actions/topAlertActions';
import axios from "axios";
import { connect } from 'react-redux';

const ExpenseList = (props) => {
  const { expenseList, userId, triggerTopAlert } = props
  const [isEditActive, setIsEditActive] = useState(false)
  const [expenseId, setExpenseId] = useState("")
  const { Column, HeaderCell, Cell } = Table
  const deleteExpense = useMutation((query) =>
    axios.post("http://localhost:5000/mrcoolice", { query })
  );
  const handleRemove = (id) => {
    deleteExpense.mutate(
      `mutation{
        deleteExpense(_id: "${id}") {
            name
            cost
        }
      }`
    )
    triggerTopAlert(true, "Expense successfully deleted", "success")
  }
  const renderExpense = () => {
    if (!isEditActive) {
      return (
        <Table
          height={400}
          data={expenseList}
        >
          <Column width={70} align="center" fixed>
            <HeaderCell>#</HeaderCell>
            <Cell dataKey="number" />
          </Column>
          <Column width={200} >
            <HeaderCell>Expense name</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column width={200} >
            <HeaderCell>Cost</HeaderCell>
            <Cell dataKey="cost" />
          </Column>
          <Column width={120} fixed="right">
            <HeaderCell>Action</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <span>
                    <a onClick={() => {setIsEditActive(!isEditActive); setExpenseId(rowData._id)}}>
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
