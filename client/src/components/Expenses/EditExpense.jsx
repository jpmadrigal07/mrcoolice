import React, { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import axios from "axios";
import { useQuery } from "react-query";
import { GRAPHQL_ENDPOINT } from "../../services/constants";

const EditExpense = (props) => {
  const { isEditActive, setIsEditActive, expenseId } = props;
  const [expense, setExpense] = useState({});

  const getToUpdateExpense = useQuery("getToUpdateExpense", async () => {
    const query = `{
            expense(_id: "${expenseId}") {
                _id
                name
                cost
            }
          }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  useEffect(() => {
    if (getToUpdateExpense.isSuccess) {
      if (
        !getToUpdateExpense.data.data?.errors &&
        getToUpdateExpense.data.data?.data?.expense
      ) {
        setExpense(getToUpdateExpense.data.data?.data?.expense);
      }
    }
  }, [getToUpdateExpense]);
  return (
    <div>
      <ExpenseForm
        isEditActive={isEditActive}
        setIsEditActive={setIsEditActive}
        toUpdateExpense={expense}
      />
    </div>
  );
};

export default EditExpense;
