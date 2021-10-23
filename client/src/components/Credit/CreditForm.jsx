import React, { useState, useEffect } from "react";
import {
  Panel,
  Form,
  SelectPicker,
  ControlLabel,
  ButtonToolbar,
  Button,
  Row,
  DatePicker,
  InputNumber,
  AutoComplete,
} from "rsuite";
import { GRAPHQL_ENDPOINT, CREDIT_TYPE } from "../../services/constants";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { triggerTopAlert } from "../../actions/topAlertActions";
import moment from "moment";

const CreditForm = (props) => {
  // local and global props
  const { isEditActive, setIsEditActive, toUpdateCredit, triggerTopAlert } =
    props;

  // constant values
  const token = Cookies.get("sessionToken");

  // local state
  const [autheticatedUserId, setAutheticatedUserId] = useState(null);
  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState(null);
  const [type, setType] = useState(null);
  const [inputCustomerDescription, setInputCustomerDescription] =
    useState(null);
  const [customers, setCustomers] = useState([]);
  const [customers2, setCustomers2] = useState([]);
  const [foundCustomerId, setFoundCustomerId] = useState(null);

  // functions
  const getAutheticatedUserId = useQuery("getAutheticatedUserId", async () => {
    const query = `{
            verifyToken(token: "${token}") {
                userId
            }
      }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  const createCredit = useMutation((query) =>
    axios.post(GRAPHQL_ENDPOINT, { query })
  );

  const updateCredit = useMutation((query) =>
    axios.post(GRAPHQL_ENDPOINT, { query })
  );

  const create = () => {
    if (date) {
      createCredit.mutate(
        `mutation{
            createCredit(userId: "${autheticatedUserId}", customerId: "${foundCustomerId}", createdAt: "${date}", amount: ${amount}, isIn: ${type}) {
              amount
            }
        }`
      );
    } else {
      triggerTopAlert(true, "Please complete all parameters", "warning");
    }
  };

  const update = () => {
    // note. please edit cus id (_id)
    if (date) {
      updateCredit.mutate(
        `mutation{
            updateCredit(_id: "${toUpdateCredit._id}", userId: "${autheticatedUserId}", customerId: "${foundCustomerId}", createdAt: "${date}", amount: ${amount}, isIn: ${type}) {
                _id
            }
        }`
      );
    } else {
      triggerTopAlert(true, "Please complete all parameters", "warning");
    }
  };

  const getCustomers = useQuery("getCustomers", async () => {
    const query = `{
        customers {
          _id
          description
        }
      }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  useEffect(() => {
    if (isEditActive) {
      if (updateCredit.isSuccess) {
        if (!updateCredit.data?.data?.errors) {
          updateCredit.reset();
          setIsEditActive(false);
          triggerTopAlert(true, "Successfully updated", "success");
        } else {
          triggerTopAlert(
            true,
            updateCredit.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (updateCredit.isError) {
        triggerTopAlert(true, updateCredit.error.message, "danger");
      }
    }
  }, [updateCredit]);

  useEffect(() => {
    if (!isEditActive) {
      if (createCredit.isSuccess) {
        if (!createCredit.data?.data?.errors) {
          setDate(null);
          setAmount("");
          setFoundCustomerId(null);
          setInputCustomerDescription("");
          setType("");
          createCredit.reset();
          triggerTopAlert(true, "Successfully added", "success");
        } else {
          triggerTopAlert(
            true,
            createCredit.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (createCredit.isError) {
        triggerTopAlert(true, createCredit.error.message, "danger");
      }
    }
  }, [createCredit]);

  useEffect(() => {
    if (getAutheticatedUserId.isSuccess) {
      if (
        !getAutheticatedUserId.data.data?.errors &&
        getAutheticatedUserId.data.data?.data?.verifyToken
      ) {
        setAutheticatedUserId(
          getAutheticatedUserId.data.data?.data?.verifyToken?.userId
        );
      }
    }
    if (getAutheticatedUserId.isError) {
      triggerTopAlert(true, updateCredit.error.message, "warning");
    }
  }, [getAutheticatedUserId]);

  // side effects
  useEffect(() => {
    if (isEditActive && toUpdateCredit &&  customers2.length > 0) {
      setDate(
        moment.unix(toUpdateCredit?.createdAt / 1000).format("MM/DD/YYYY")
      );
      setFoundCustomerId(toUpdateCredit.customerId?._id);
      const foundCustomer = customers2?.find(
        (res) => res._id === toUpdateCredit.customerId?._id
      );
      setInputCustomerDescription(foundCustomer?.description);
      setAmount(toUpdateCredit?.amount);
      setType(toUpdateCredit?.isIn);
    }
  }, [toUpdateCredit, customers2]);

  useEffect(() => {
    if (getCustomers.isSuccess) {
      if (
        !getCustomers.data.data?.errors &&
        getCustomers.data.data?.data?.customers
      ) {
        const foundCustomers = getCustomers.data.data?.data?.customers;
        const newCustomers = foundCustomers.map((res) => {
          return {
            value: res.description,
            label: res.description,
          };
        });
        setCustomers2(foundCustomers);
        setCustomers(newCustomers);
      }
    }
  }, [getCustomers.data]);

  useEffect(() => {
    if (inputCustomerDescription) {
      const foundCustomers = getCustomers.data.data?.data?.customers;
      const foundCustomer = foundCustomers?.find(
        (res) =>
          res.description?.toLowerCase() ===
          inputCustomerDescription?.toLowerCase()
      );
      if (foundCustomer) {
        setFoundCustomerId(foundCustomer._id);
      } else {
        setFoundCustomerId(null);
      }
    } else {
      setFoundCustomerId(null);
    }
  }, [inputCustomerDescription]);

  return (
    <>
      <Panel bordered style={{ margin: "10px" }}>
        <Form onSubmit={isEditActive ? () => update() : () => create()}>
          <ControlLabel>
            Date<span style={{ color: "red" }}>*</span>
          </ControlLabel>
          <DatePicker
            block
            onChange={(e) => setDate(e)}
            value={date}
            disabled={createCredit.isLoading || updateCredit.isLoading}
          />
          <br />
          <ControlLabel>
            Customer<span style={{ color: "red" }}>*</span>
          </ControlLabel>
          <AutoComplete
            type={"string"}
            value={inputCustomerDescription}
            data={customers}
            block
            onChange={(e) => {
              setInputCustomerDescription(e);
            }}
            disabled={createCredit.isLoading}
          />
          <br />
          <ControlLabel>
            Amount<span style={{ color: "red" }}>*</span>
          </ControlLabel>
          <InputNumber
            block
            scrollable={false}
            onChange={(e) => setAmount(e)}
            value={amount}
            disabled={createCredit.isLoading || updateCredit.isLoading}
          />
          <br />
          <ControlLabel>
            Type<span style={{ color: "red" }}>*</span>
          </ControlLabel>
          <SelectPicker
            value={type}
            data={CREDIT_TYPE}
            block
            onChange={(e) => setType(e)}
            searchable={false}
            disabled={createCredit.isLoading}
          />
          <br />
          <ButtonToolbar>
            {isEditActive ? (
              <Row>
                <Button
                  appearance="primary"
                  type="submit"
                  style={{ marginRight: 10 }}
                  disabled={updateCredit.isLoading}
                >
                  Update
                </Button>
                <Button
                  appearance="danger"
                  onClick={() => setIsEditActive(false)}
                  disabled={updateCredit.isLoading}
                >
                  Back to list
                </Button>
              </Row>
            ) : (
              <Button
                appearance="primary"
                type="submit"
                disabled={createCredit.isLoading}
              >
                Add
              </Button>
            )}
          </ButtonToolbar>
          <br />
        </Form>
      </Panel>
    </>
  );
};

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(CreditForm);
