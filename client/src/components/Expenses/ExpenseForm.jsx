import React, { useState, useEffect } from "react";
import {
  Panel,
  Form,
  FormGroup,
  ControlLabel,
  Input,
  ButtonToolbar,
  Button,
  Row,
  InputNumber
} from "rsuite";
import { GRAPHQL_ENDPOINT } from "../../services/constants";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { triggerTopAlert } from "../../actions/topAlertActions";
import Asterisk from "../Asterisk/Asterisk"

const ExpenseForm = (props) => {
  const { isEditActive, setIsEditActive, toUpdateExpense, triggerTopAlert } = props;
  const token = Cookies.get("sessionToken");
  const [autheticatedUserId, setAutheticatedUserId] = useState(null);
  const [expenseName, setExpenseName] = useState(null);
  const [expenseCost, setExpenseCost] = useState(null);
  const [vendor, setVendor] = useState(null);
  useState(null);

  const getAutheticatedUserId = useQuery("getAutheticatedUserId", async () => {
    const query = `{
                verifyToken(token: "${token}") {
                    userId
                }
          }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  const createExpense = useMutation((query) =>
    axios.post(GRAPHQL_ENDPOINT, { query })
  );
  
  const updateExpense = useMutation((query) =>
    axios.post(GRAPHQL_ENDPOINT, { query })
  );
  const create = () => {
    if (expenseName && expenseCost) {
      createExpense.mutate(
        `mutation{
                    createExpense(userId: "${autheticatedUserId}", name: "${expenseName}", vendor: "${vendor}", cost: ${expenseCost}){
                        name
                        vendor
                        cost
                    }
                }`
      );
    } else {
      triggerTopAlert(true, "Please complete all parameters", "warning");
    }
  };

  const update = async () => {
    if (expenseName && expenseCost) {
      updateExpense.mutate(
        `mutation{
                updateExpense(_id: "${toUpdateExpense._id}", userId: "${autheticatedUserId}", name: "${expenseName}", vendor: "${vendor}", cost: ${expenseCost}) 
                {
                  name
                  vendor
                  cost
                }
              }`
      );
    } else {
      triggerTopAlert(true, "Please complete all parameters", "warning");
    }
  };

  useEffect(() => {
    if (isEditActive && toUpdateExpense) {
      setExpenseName(toUpdateExpense?.name);
      setExpenseCost(toUpdateExpense?.cost);
    }
  }, [toUpdateExpense]);

  useEffect(() => {
    if (isEditActive) {
      if (updateExpense.isSuccess) {
        if (!updateExpense.data?.data?.errors) {
          updateExpense.reset();
          setIsEditActive(false);
          triggerTopAlert(true, "Successfully updated", "success");
        } else {
          triggerTopAlert(
            true,
            updateExpense.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (updateExpense.isError) {
        triggerTopAlert(true, updateExpense.error.message, "danger");
      }
    }
  }, [updateExpense]);

  useEffect(() => {
    if (!isEditActive) {
      if (createExpense.isSuccess) {
        if (!createExpense.data?.data?.errors) {
          setExpenseCost("");
          setExpenseName("");
          setVendor("")
          createExpense.reset();
          triggerTopAlert(true, "Successfully added", "success");
        } else {
          triggerTopAlert(
            true,
            createExpense.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (createExpense.isError) {
        triggerTopAlert(true, createExpense.error.message, "danger");
      }
    }
  }, [createExpense]);

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
    if (updateExpense.isError) {
      triggerTopAlert(true, updateExpense.error.message, "warning");
    }
  }, [getAutheticatedUserId]);

  return (
    <>
      <Panel bordered style={{ margin: "10px" }}>
        <Form onSubmit={isEditActive ? () => update() : () => create()}>
          <FormGroup>
            <ControlLabel>Expense Name<Asterisk/></ControlLabel>
            <Input
              block
              onChange={(e) => setExpenseName(e)}
              value={expenseName}
              disabled={createExpense.isLoading || updateExpense.isLoading}
            />
          </FormGroup>
          <ControlLabel>Cost (Pesos)<Asterisk/></ControlLabel>
          <InputNumber
            block
            scrollable={false}
            onChange={(e) => setExpenseCost(e)}
            value={expenseCost}
            disabled={createExpense.isLoading || updateExpense.isLoading}
          />
          <br/>
          <FormGroup>
            <ControlLabel>Vendor/Client</ControlLabel>
            <Input
              block
              onChange={(e) => setVendor(e)}
              value={vendor}
              disabled={createExpense.isLoading || updateExpense.isLoading}
            />
          </FormGroup>
          <FormGroup>
            <ButtonToolbar>
              {isEditActive ? (
                <Row>
                  <Button
                    appearance="primary"
                    type="submit"
                    style={{ marginRight: 10 }}
                  >
                    Update
                  </Button>
                  <Button
                    appearance="default"
                    onClick={() => setIsEditActive(!isEditActive)}
                  >
                    Back to list
                  </Button>
                </Row>
              ) : (
                <Button
                  appearance="primary"
                  type="submit"
                  disabled={createExpense.isLoading}
                >
                  Add
                </Button>
              )}
            </ButtonToolbar>
          </FormGroup>
        </Form>
      </Panel>
    </>
  );
};

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(ExpenseForm);
