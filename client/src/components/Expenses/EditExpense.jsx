import React, { useState } from 'react'
import ExpenseForm from './ExpenseForm'
import axios from "axios";
import { connect } from 'react-redux';
import { useMutation } from 'react-query'

const EditExpense = (props) => {
    const { 
        isEditActive, 
        setIsEditActive, 
        expenseId, 
        userId,
        expenseList
    } = props
    const [inputExpenseName, setInputExpenseName] = useState("")
    const [inputCost, setInputCost] = useState()
    const foundExpense = expenseList?.find((expense) => expense._id === expenseId)

    const editExpense = useMutation((query) =>
        axios.post("http://localhost:5000/mrcoolice", { query })
    );
    const handleEditExpense = async () => {
        editExpense.mutate(
            `mutation{
                updateExpense(_id: "${expenseId}",userId: "${userId}", name: "${inputExpenseName}", cost: ${inputCost}) 
                {
                  name
                  cost
                }
              }`
        )
        console.log(expenseId)
        console.log(userId)
        console.log(inputExpenseName)
        console.log(inputCost)
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
                inputExpenseName={inputExpenseName}
                inputCost={inputCost}
            />
        </div>
    )
}

export default EditExpense
