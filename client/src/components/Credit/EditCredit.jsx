import React, { useState, useEffect } from "react";
import { Loader } from "rsuite";
import { useQuery } from "react-query";
import axios from "axios";
import CreditForm from "./CreditForm";
import { GRAPHQL_ENDPOINT } from "../../services/constants";

const EditCredit = (props) => {
  const { isEditActive, setIsEditActive, creditId } = props;

  const [credit, setCredit] = useState({});

  const getToUpdateCredit = useQuery("getToUpdateCredit", async () => {
    const query = `{
            credit(_id: "${creditId}") {
                _id,
                userId {
                  _id
                },
                customerId {
                  _id
                },
                amount,
                isIn,
                createdAt
            }
          }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  useEffect(() => {
    if (getToUpdateCredit.isSuccess) {
      if (
        !getToUpdateCredit.data.data?.errors &&
        getToUpdateCredit.data.data?.data?.credit
      ) {
        setCredit(getToUpdateCredit.data.data?.data?.credit);
      }
    }
  }, [getToUpdateCredit]);

  return (
    <>
      {!getToUpdateCredit.isLoading ? (
        <CreditForm
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
          toUpdateCredit={credit}
        />
      ) : (
        <Loader inverse />
      )}
    </>
  );
};

export default EditCredit;
