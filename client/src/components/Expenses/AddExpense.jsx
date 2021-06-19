import React,{ useState } from 'react'
import { useMutation } from 'react-query'
import axios from "axios";
import ExpenseForm from './ExpenseForm';
import { connect } from 'react-redux';
import { triggerTopAlert } from '../../actions/topAlertActions';

const AddExpense = (props) => {
    const { userId, triggerTopAlert } = props
    const [inputExpenseName, setInputExpenseName] = useState("")
    const [inputCost, setInputCost] = useState()
    const createExpenses = useMutation((query) =>
        axios.post("http://localhost:5000/mrcoolice", { query })
    );
    const handleCreateExpense = () => {
        if(inputExpenseName && inputCost) {
            createExpenses.mutate(
                `mutation{
                    createExpense(userId: "${userId}", name: "${inputExpenseName}", cost: ${inputCost}){
                        name
                        cost
                    }
                }`
            )
            triggerTopAlert(true, "Expense added successfully", "success")
        } else {
            triggerTopAlert(true, "Please complete all parameters", "warning")
        }
    }
    return (
            <ExpenseForm 
                setInputExpenseName={setInputExpenseName} 
                setInputCost={setInputCost} 
                inputExpenseName={inputExpenseName}
                inputCost={inputCost}
                handleCreateExpense={handleCreateExpense}
            />
    )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(AddExpense);
