import React, { useState, useEffect } from "react";
import { Loader } from "rsuite";
import { useQuery } from "react-query";
import axios from "axios";
import CashOnHandForm from "./CashOnHandForm";
import { GRAPHQL_ENDPOINT } from "../../services/constants";

const EditCashOnHand = (props) => {
  const { isEditActive, setIsEditActive, cashOnHandId } = props;

  const [cashOnHand, setCashOnHand] = useState({});

  const getToUpdateCashOnHand = useQuery("getToUpdateCashOnHand", async () => {
    const query = `{
            cashOnHand(_id: "${cashOnHandId}") {
                _id,
                userId {
                  _id
                },
                amount,
                createdAt
            }
          }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  useEffect(() => {
    if (getToUpdateCashOnHand.isSuccess) {
      if (
        !getToUpdateCashOnHand.data.data?.errors &&
        getToUpdateCashOnHand.data.data?.data?.cashOnHand
      ) {
        setCashOnHand(getToUpdateCashOnHand.data.data?.data?.cashOnHand);
      }
    }
  }, [getToUpdateCashOnHand]);

  return (
    <>
      {!getToUpdateCashOnHand.isLoading ? (
        <CashOnHandForm
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
          toUpdateCashOnHand={cashOnHand}
        />
      ) : (
        <Loader inverse />
      )}
    </>
  );
};

export default EditCashOnHand;
