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
  SelectPicker,
} from "rsuite";
import { CUSTOMER_TYPE_ITEMS, GRAPHQL_ENDPOINT } from "../../services/constants";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { triggerTopAlert } from "../../actions/topAlertActions";

const CustomerForm = (props) => {
  // local and global props
  const { isEditActive, setIsEditActive, toUpdateCustomer, triggerTopAlert } =
    props;

  // constant values
  const token = Cookies.get("sessionToken");

  // local state
  const [autheticatedUserId, setAutheticatedUserId] = useState(null);
  const [customerDescription, setCustomerDescription] = useState(null);
  const [customerType, setCustomerType] = useState("Regular");

  // functions
  const getAutheticatedUserId = useQuery("getAutheticatedUserId", async () => {
    const query = `{
            verifyToken(token: "${token}") {
                userId
            }
      }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  const createCustomer = useMutation((query) =>
    axios.post(GRAPHQL_ENDPOINT, { query })
  );

  const updateCustomer = useMutation((query) =>
    axios.post(GRAPHQL_ENDPOINT, { query })
  );

  const create = () => {
    if (customerDescription) {
      createCustomer.mutate(
        `mutation{
            createCustomer(userId: "${autheticatedUserId}", description: "${customerDescription}", type: "${customerType}") {
                description
            }
        }`
      );
    } else {
      triggerTopAlert(true, "Please complete all parameters", "warning");
    }
  };

  const update = () => {
    // note. please edit cus id (_id)
    if (customerDescription) {
      updateCustomer.mutate(
        `mutation{
            updateCustomer(_id: "${toUpdateCustomer._id}", userId: "${autheticatedUserId}", description: "${customerDescription}", type: "${customerType}") {
                description
            }
        }`
      );
    } else {
      triggerTopAlert(true, "Please complete all parameters", "warning");
    }
  };

  // side effects
  useEffect(() => {
    if (isEditActive && toUpdateCustomer) {
      setCustomerDescription(toUpdateCustomer?.description);
    }
  }, [toUpdateCustomer]);

  useEffect(() => {
    if (isEditActive) {
      if (updateCustomer.isSuccess) {
        if (!updateCustomer.data?.data?.errors) {
          updateCustomer.reset();
          setIsEditActive(false);
          triggerTopAlert(true, "Successfully updated", "success");
        } else {
          triggerTopAlert(
            true,
            updateCustomer.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (updateCustomer.isError) {
        triggerTopAlert(true, updateCustomer.error.message, "danger");
      }
    }
  }, [updateCustomer]);

  useEffect(() => {
    if (!isEditActive) {
      if (createCustomer.isSuccess) {
        if (!createCustomer.data?.data?.errors) {
          setCustomerDescription("");
          setCustomerType("Regular")
          createCustomer.reset();
          triggerTopAlert(true, "Successfully added", "success");
        } else {
          triggerTopAlert(
            true,
            createCustomer.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (createCustomer.isError) {
        triggerTopAlert(true, createCustomer.error.message, "danger");
      }
    }
  }, [createCustomer]);

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
      triggerTopAlert(true, updateCustomer.error.message, "warning");
    }
  }, [getAutheticatedUserId]);

  return (
    <>
      <Panel bordered style={{ margin: "10px" }}>
        <Form onSubmit={isEditActive ? () => update() : () => create()}>
          <FormGroup>
            <ControlLabel>Customer Description</ControlLabel>
            <Input
              block
              onChange={(e) => setCustomerDescription(e)}
              value={customerDescription}
              disabled={createCustomer.isLoading || updateCustomer.isLoading}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Customer Type</ControlLabel>
            <SelectPicker
              value={customerType}
              data={CUSTOMER_TYPE_ITEMS}
              block
              onChange={(e) => setCustomerType(e)}
              disabled={createCustomer.isLoading || updateCustomer.isLoading}
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
                    disabled={updateCustomer.isLoading}
                  >
                    Update
                  </Button>
                  <Button
                    appearance="danger"
                    onClick={() => setIsEditActive(false)}
                    disabled={updateCustomer.isLoading}
                  >
                    Back to list
                  </Button>
                </Row>
              ) : (
                <Button
                  appearance="primary"
                  type="submit"
                  disabled={createCustomer.isLoading}
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

export default connect(mapStateToProps, { triggerTopAlert })(CustomerForm);
