import React, { useState, useEffect } from "react";
import { Loader } from "rsuite";
import { useQuery } from "react-query";
import axios from "axios";
import CashForm from "./CashForm";
import { graphqlUrl } from "../../services/constants";

const EditCash = (props) => {
  const { isEditActive, setIsEditActive, cashId } = props;

  const [cash, setCash] = useState({});

  const getToUpdateCash = useQuery("getToUpdateCash", async () => {
    const query = `{
            cash(_id: "${cashId}") {
                _id,
                onePeso,
                fivePeso,
                tenPeso,
                twentyPeso,
                fiftyPeso,
                oneHundredPeso,
                twoHundredPeso,
                fiveHundredPeso,
                oneThousandPeso,
                createdAt
            }
          }`;
    return await axios.post(graphqlUrl, { query });
  });

  useEffect(() => {
    if (getToUpdateCash.isSuccess) {
      if (
        !getToUpdateCash.data.data?.errors &&
        getToUpdateCash.data.data?.data?.cash
      ) {
        setCash(getToUpdateCash.data.data?.data?.cash);
      }
    }
  }, [getToUpdateCash]);

  return (
    <>
      {!getToUpdateCash.isLoading ? (
        <CashForm
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
          toUpdateCash={cash}
        />
      ) : (
        <Loader inverse />
      )}
    </>
  );
};

export default EditCash;
