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
} from "rsuite";
import { graphqlUrl } from "../../services/constants";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { triggerTopAlert } from "../../actions/topAlertActions";

const ExpenseForm = (props) => {
  const { isEditActive, setIsEditActive, toUpdateExpense, triggerTopAlert } =
    props;
  const token = Cookies.get("sessionToken");
  const [autheticatedUserId, setAutheticatedUserId] = useState(null);
  const [expenseName, setExpenseName] = useState(null);
  const [expenseCost, setExpenseCost] = useState(null);

  const getAutheticatedUserId = useQuery("getAutheticatedUserId", async () => {
    const query = `{
                verifyToken(token: "${token}") {
                    userId
                }
          }`;
    return await axios.post(graphqlUrl, { query });
  });

  const createExpense = useMutation((query) =>
    axios.post(graphqlUrl, { query })
  );

  const updateExpense = useMutation((query) =>
    axios.post(graphqlUrl, { query })
  );
  const create = () => {
    if (expenseName && expenseCost) {
      createExpense.mutate(
        `mutation{
                    createExpense(userId: "${autheticatedUserId}", name: "${expenseName}", cost: ${expenseCost}){
                        name
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
                updateExpense(_id: "${toUpdateExpense._id}", userId: "${autheticatedUserId}", name: "${expenseName}", cost: ${expenseCost}) 
                {
                  name
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
            <ControlLabel>Expense Name</ControlLabel>
            <Input
              block
              onChange={(e) => setExpenseName(e)}
              value={expenseName}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Cost</ControlLabel>
            <Input
              block
              type="number"
              onChange={(e) => setExpenseCost(e)}
              value={expenseCost}
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
