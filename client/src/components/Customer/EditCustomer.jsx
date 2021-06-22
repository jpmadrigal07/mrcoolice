import React, { useState, useEffect } from "react";
import { Loader } from "rsuite";
import { useQuery } from "react-query";
import axios from "axios";
import CustomerForm from "./CustomerForm";
import { graphqlUrl } from "../../services/constants";

const EditCustomer = (props) => {
  const { isEditActive, setIsEditActive, customerId } = props;

  const [customer, setCustomer] = useState({});

  const getToUpdateCustomer = useQuery("getToUpdateCustomer", async () => {
    const query = `{
            customer(_id: "${customerId}") {
                _id
                description
            }
          }`;
    return await axios.post(graphqlUrl, { query });
  });

  useEffect(() => {
    if (getToUpdateCustomer.isSuccess) {
      if (
        !getToUpdateCustomer.data.data?.errors &&
        getToUpdateCustomer.data.data?.data?.customer
      ) {
        setCustomer(getToUpdateCustomer.data.data?.data?.customer);
      }
    }
  }, [getToUpdateCustomer]);

  return (
    <>
      {!getToUpdateCustomer.isLoading ? (
        <CustomerForm
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
          toUpdateCustomer={customer}
        />
      ) : (
        <Loader inverse />
      )}
    </>
  );
};

export default EditCustomer;
