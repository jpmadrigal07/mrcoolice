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
import { graphqlUrl, CREDIT_TYPE } from "../../services/constants";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { triggerTopAlert } from "../../actions/topAlertActions";
import moment from "moment";

const CashOnHandForm = (props) => {
  // local and global props
  const { isEditActive, setIsEditActive, toUpdateCashOnHand, triggerTopAlert } =
    props;

  // constant values
  const token = Cookies.get("sessionToken");

  // local state
  const [autheticatedUserId, setAutheticatedUserId] = useState(null);
  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState(null);

  // functions
  const getAutheticatedUserId = useQuery("getAutheticatedUserId", async () => {
    const query = `{
            verifyToken(token: "${token}") {
                userId
            }
      }`;
    return await axios.post(graphqlUrl, { query });
  });

  const createCashOnHand = useMutation((query) =>
    axios.post(graphqlUrl, { query })
  );

  const updateCashOnHand = useMutation((query) =>
    axios.post(graphqlUrl, { query })
  );

  const create = () => {
    if (date) {
      createCashOnHand.mutate(
        `mutation{
            createCashOnHand(userId: "${autheticatedUserId}", createdAt: "${date}", amount: ${amount}) {
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
      updateCashOnHand.mutate(
        `mutation{
            updateCashOnHand(_id: "${toUpdateCashOnHand._id}", userId: "${autheticatedUserId}", createdAt: "${date}", amount: ${amount}) {
                _id
            }
        }`
      );
    } else {
      triggerTopAlert(true, "Please complete all parameters", "warning");
    }
  };

  useEffect(() => {
    if (isEditActive) {
      if (updateCashOnHand.isSuccess) {
        if (!updateCashOnHand.data?.data?.errors) {
          updateCashOnHand.reset();
          setIsEditActive(false);
          triggerTopAlert(true, "Successfully updated", "success");
        } else {
          triggerTopAlert(
            true,
            updateCashOnHand.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (updateCashOnHand.isError) {
        triggerTopAlert(true, updateCashOnHand.error.message, "danger");
      }
    }
  }, [updateCashOnHand]);

  useEffect(() => {
    if (!isEditActive) {
      if (createCashOnHand.isSuccess) {
        if (!createCashOnHand.data?.data?.errors) {
          setDate(null);
          setAmount("");
          createCashOnHand.reset();
          triggerTopAlert(true, "Successfully added", "success");
        } else {
          triggerTopAlert(
            true,
            createCashOnHand.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (createCashOnHand.isError) {
        triggerTopAlert(true, createCashOnHand.error.message, "danger");
      }
    }
  }, [createCashOnHand]);

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
      triggerTopAlert(true, updateCashOnHand.error.message, "warning");
    }
  }, [getAutheticatedUserId]);

  // side effects
  useEffect(() => {
    if (isEditActive && toUpdateCashOnHand) {
      setDate(
        moment.unix(toUpdateCashOnHand?.createdAt / 1000).format("MM/DD/YYYY")
      );
      setAmount(toUpdateCashOnHand?.amount);
    }
  }, [toUpdateCashOnHand]);

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
            disabled={createCashOnHand.isLoading || updateCashOnHand.isLoading}
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
            disabled={createCashOnHand.isLoading || updateCashOnHand.isLoading}
          />
          <br />
          <ButtonToolbar>
            {isEditActive ? (
              <Row>
                <Button
                  appearance="primary"
                  type="submit"
                  style={{ marginRight: 10 }}
                  disabled={updateCashOnHand.isLoading}
                >
                  Update
                </Button>
                <Button
                  appearance="danger"
                  onClick={() => setIsEditActive(false)}
                  disabled={updateCashOnHand.isLoading}
                >
                  Back to list
                </Button>
              </Row>
            ) : (
              <Button
                appearance="primary"
                type="submit"
                disabled={createCashOnHand.isLoading}
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

export default connect(mapStateToProps, { triggerTopAlert })(CashOnHandForm);
