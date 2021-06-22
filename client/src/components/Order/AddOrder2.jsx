import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { triggerTopAlert } from "../../actions/topAlertActions";
import {
  Panel,
  Form,
  FormGroup,
  ControlLabel,
  ButtonToolbar,
  Button,
  SelectPicker,
  Loader
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
  const [products, setProducts] = useState([]);
  const token = Cookies.get("sessionToken");

  useEffect(() => {
    addNewProduct();
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
    },  {
      enabled: false
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

  const getProducts = useQuery("getProducts", async () => {
    const query = `{
        products {
          _id
          iceType,
          weight,
          scaleType,
          cost
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
      }
    }
    if (getAutheticatedUserId.isError) {
      triggerTopAlert(true, getAutheticatedUserId.error.message, "warning");
    }
  }, [getAutheticatedUserId.data]);

  useEffect(() => {
    if(autheticatedUserId) {
      getAutheticatedUserData.refetch()
    }
  }, [autheticatedUserId])

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
  }, [getAutheticatedUserData.data, getAutheticatedUserData.isLoading]);

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
    if (getProducts.isSuccess) {
      if (
        !getProducts.data.data?.errors &&
        getProducts.data.data?.data?.products
      ) {
        const foundProducts = getProducts.data.data?.data?.products;
        const newProducts = foundProducts.map((res) => {
          return {
            value: res._id,
            label: `${res.weight} ${res.scaleType} ${res.iceType} ice`,
          };
        });
        setProducts(newProducts);
      }
    }
  }, [getProducts.data]);

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
      triggerTopAlert(true, createSales.error.message, "warning");
    }
  }, [createSales.data]);

  const submit = () => {
    if (selectedCustomerId) {
      const receiptNumber = Math.floor(Math.random() * 90000) + 10000;
      const toInsert = order
        .map((res) => {
          if (res.productId) {
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
              createSale(customerId: "${res.customerId}", userId: "${res.userId}", receiptNumber: ${res.receiptNumber}, productId: "${res.productId}") {
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

  const addNewProduct = () => {
    const toUpdate = order;
    setOrder([...toUpdate, {productId: ""}]);
  };

  const updateProduct = (value, index) => {
    const toUpdate = order;
    toUpdate[index].productId = value;
    setOrder(toUpdate);
  };

  return (
    <>
      <Panel bordered style={{ margin: 10 }}>
        <Form onSubmit={() => submit()}>
          <FormGroup>
            <ControlLabel>Cashier</ControlLabel>
            <h4>{!getAutheticatedUserData.isLoading ? autheticatedUserFullName : <Loader/>}</h4>
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
                  <FormGroup>
                    <ControlLabel>Product {i + 1}</ControlLabel>
                    <SelectPicker
                      data={products}
                      block
                      onChange={(e) => updateProduct(e, i)}
                    />
                  </FormGroup>
                  <hr />
              </>
            );
          })}
          <FormGroup>
            <a
              onClick={() => addNewProduct()}
              style={{ cursor: "pointer", marginBottom: 15 }}
            >
              Add New Product
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
