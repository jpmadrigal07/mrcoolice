import React, { useState } from 'react'
import ExpenseForm from './ExpenseForm'
import axios from "axios";
import { connect } from 'react-redux';
import { useMutation } from 'react-query'
import { triggerTopAlert } from '../../actions/topAlertActions';

const EditExpense = (props) => {
    const {
        isEditActive,
        setIsEditActive,
        expenseId,
        userId,
        expenseList,
        triggerTopAlert
    } = props
    const [inputExpenseName, setInputExpenseName] = useState("")
    const [inputCost, setInputCost] = useState()
    const foundExpense = expenseList?.find((expense) => expense._id === expenseId)

    const editExpense = useMutation((query) =>
        axios.post("http://localhost:5000/mrcoolice", { query })
    );
    const handleEditExpense = async () => {
        if (inputExpenseName && inputCost)
        {
            editExpense.mutate(
                `mutation{
                updateExpense(_id: "${expenseId}",userId: "${userId}", name: "${inputExpenseName}", cost: ${inputCost}) 
                {
                  name
                  cost
                }
              }`
            )
            triggerTopAlert(true, "Expense updated successfully", "success")
        } else {
            triggerTopAlert(true, "Please complete all parameters", "warning")
        }
    }

    return (
        <div>
            <ExpenseForm
                isEditActive={isEditActive}
                setIsEditActive={setIsEditActive}
                expenseId={expenseId}
                userId={userId}
                setInputExpenseName={setInputExpenseName}
                setInputCost={setInputCost}
                handleEditExpense={handleEditExpense}
                foundExpense={foundExpense}
            />
        </div>
    )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(EditExpense);