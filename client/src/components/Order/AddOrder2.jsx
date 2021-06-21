import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { triggerTopAlert } from "../../actions/topAlertActions";
import {
  Panel,
  Form,
  FormGroup,
  ControlLabel,
  Input,
  ButtonToolbar,
  Button,
  Col,
  Row,
  SelectPicker,
  InputPicker,
  Whisper,
  Icon,
  Tooltip,
} from "rsuite";
import { graphqlUrl } from "../../services/constants";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";

const AddOrder2 = (props) => {
  const { triggerTopAlert } = props;
  const [order, setOrder] = useState([]);
  const [autheticatedUserId, setAutheticatedUserId] = useState(null);
  const [autheticatedUserFullName, setAutheticatedUserFullName] =
    useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const token = Cookies.get("sessionToken");

  useEffect(() => {
    addNewOrder();
  }, []);

  const createSales = useMutation((query) => axios.post(graphqlUrl, { query }));

  const getAutheticatedUserId = useQuery("getAutheticatedUserId", async () => {
    const query = `{
            verifyToken(token: "${token}") {
                userId
            }
      }`;
    return await axios.post(graphqlUrl, { query });
  });

  const getAutheticatedUserData = useQuery(
    "getAutheticatedUserData",
    async () => {
      const query = `{
            user(_id: "${autheticatedUserId}") {
                firstName,
                lastName
            }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const getCustomers = useQuery("getCustomers", async () => {
    const query = `{
        customers {
          _id
          description
        }
      }`;
    return await axios.post(graphqlUrl, { query });
  });

  useEffect(() => {
    if (getAutheticatedUserId.isSuccess) {
      if (
        !getAutheticatedUserId.data.data?.errors &&
        getAutheticatedUserId.data.data?.data?.verifyToken
      ) {
        setAutheticatedUserId(
          getAutheticatedUserId.data.data?.data?.verifyToken?.userId
        );
        getAutheticatedUserData.refetch();
      }
    }
    if (getAutheticatedUserId.isError) {
      triggerTopAlert(true, getAutheticatedUserId.error.message, "warning");
    }
  }, [getAutheticatedUserId.data]);

  useEffect(() => {
    if (getAutheticatedUserData.isSuccess) {
      if (
        !getAutheticatedUserData.data.data?.errors &&
        getAutheticatedUserData.data.data?.data?.user
      ) {
        const foundUser = getAutheticatedUserData.data.data?.data?.user;
        setAutheticatedUserFullName(
          `${foundUser.firstName} ${foundUser.lastName}`
        );
      }
    }
    if (getAutheticatedUserData.isError) {
      triggerTopAlert(true, getAutheticatedUserData.error.message, "warning");
    }
  }, [getAutheticatedUserData.data]);

  useEffect(() => {
    if (getCustomers.isSuccess) {
      if (
        !getCustomers.data.data?.errors &&
        getCustomers.data.data?.data?.customers
      ) {
        const foundCustomers = getCustomers.data.data?.data?.customers;
        const newCustomers = foundCustomers.map((res) => {
          return {
            value: res._id,
            label: res.description,
          };
        });
        setCustomers(newCustomers);
      }
    }
  }, [getCustomers.data]);

  useEffect(() => {
    if (createSales.isSuccess) {
      if (
        !createSales.data.data?.errors &&
        createSales.data.data?.data?.createSale
      ) {
        const receiptNumber =
          createSales.data.data?.data?.createSale?.receiptNumber;
        setSelectedCustomerId(null);
        const toUpdate = [];
        setOrder(toUpdate);
        createSales.reset();
        window.open(`/receipt?receiptNumber=${receiptNumber}`, "_blank");
        triggerTopAlert(true, "Success creating orders", "success");
      } else {
        triggerTopAlert(true, "Server error", "warning");
      }
    }
    if (createSales.isError) {
      triggerTopAlert(true, getAutheticatedUserData.error.message, "warning");
    }
  }, [createSales.data]);

  const submit = () => {
    if (selectedCustomerId) {
      const receiptNumber = Math.floor(Math.random() * 90000) + 10000;
      const toInsert = order
        .map((res) => {
          if (res.weight) {
            return {
              ...res,
              customerId: selectedCustomerId,
              userId: autheticatedUserId,
              receiptNumber,
            };
          }
        })
        .filter((res2) => res2);
      if (toInsert.length > 0) {
        toInsert.map((res) => {
          createSales.mutate(`mutation {
              createSale(customerId: "${res.customerId}", userId: "${res.userId}", receiptNumber: ${res.receiptNumber}, iceType: "${res.iceType}", weight: ${res.weight}, scaleType: "${res.scaleType}") {
                receiptNumber
            }
          }
          `);
        });
      } else {
        triggerTopAlert(true, "Please complete all the parameters", "warning");
      }
    } else {
      triggerTopAlert(true, "Please select customer", "warning");
    }
  };

  const addNewOrder = () => {
    const toUpdate = order;
    toUpdate.push({
      iceType: "tube",
      weight: null,
      scaleType: "kg",
    });
    setOrder(toUpdate);
  };

  const updateIceType = (value, index) => {
    const toUpdate = order;
    toUpdate[index].iceType = value;
    setOrder(toUpdate);
  };

  const updateWeight = (value, index) => {
    const toUpdate = order;
    toUpdate[index].weight = value;
    setOrder(toUpdate);
  };

  const updateScaleType = (value, index) => {
    const toUpdate = order;
    toUpdate[index].scaleType = value;
    setOrder(toUpdate);
  };

  const iceTypes = [
    {
      label: "Tube",
      value: "tube",
    },
    {
      label: "Crushed",
      value: "crushed",
    },
  ];

  const scaleTypes = [
    {
      label: "Kilogram",
      value: "kg",
    },
    {
      label: "Grams",
      value: "g",
    },
  ];

  return (
    <>
      <Panel bordered style={{ margin: 10 }}>
        <Form onSubmit={() => submit()}>
          <FormGroup>
            <ControlLabel>Cashier</ControlLabel>
            <h4>{autheticatedUserFullName}</h4>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Customer</ControlLabel>
            <SelectPicker
              value={selectedCustomerId}
              data={customers}
              block
              onChange={(e) => setSelectedCustomerId(e)}
            />
            <a style={{ cursor: "pointer" }} onClick={() => {}}>
              Add new customer?
            </a>
          </FormGroup>
          <hr />
          {order.map((res, i) => {
            return (
              <>
                <h5 style={{ marginBottom: 5 }}>Order {i + 1}</h5>
                <FormGroup>
                  <ControlLabel>Ice Type</ControlLabel>
                  <SelectPicker
                    defaultValue={"tube"}
                    data={iceTypes}
                    block
                    onChange={(e) => updateIceType(e, i)}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Weight</ControlLabel>
                  <Input block onChange={(e) => updateWeight(e, i)} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Scale Type</ControlLabel>
                  <SelectPicker
                    defaultValue={"kg"}
                    data={scaleTypes}
                    block
                    onChange={(e) => updateScaleType(e, i)}
                  />
                </FormGroup>
                <hr />
              </>
            );
          })}
          <FormGroup>
            <a
              onClick={() => addNewOrder()}
              style={{ cursor: "pointer", marginBottom: 15 }}
            >
              Add New Order
            </a>
          </FormGroup>
          <FormGroup>
            <ButtonToolbar>
              <Button
                appearance="primary"
                type="submit"
                style={{ marginRight: 10 }}
              >
                Create
              </Button>
              <Button appearance="default">Reset</Button>
            </ButtonToolbar>
          </FormGroup>
        </Form>
      </Panel>
    </>
  );
};

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(AddOrder2);
