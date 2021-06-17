import React, { useState } from 'react'
import {
  Table
} from 'rsuite'
import EditExpense from './EditExpense'

const ExpenseList = (props) => {
  const { expenseList, userId } = props
  const [isEditActive, setIsEditActive] = useState(false)
  const [expenseId, setExpenseId] = useState("")
  const { Column, HeaderCell, Cell } = Table
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
          <Column width={200} fixed>
            <HeaderCell>Expense name</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column width={200} fixed>
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
                    <a >
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

export default ExpenseList
