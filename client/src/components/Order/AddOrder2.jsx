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
  Loader,
  Input,
  Col,
  Row,
  Grid,
} from "rsuite";
import { graphqlUrl } from "../../services/constants";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import ReceiptNew from "../Receipt/ReceiptNew";
import Receipt from "../Receipt/Receipt";

const AddOrder2 = (props) => {
  const history = useHistory();
  const { triggerTopAlert } = props;
  const [order, setOrder] = useState([]);
  const [orders, setOrders] = useState([]);
  const [autheticatedUserId, setAutheticatedUserId] = useState(null);
  const [autheticatedUserFullName, setAutheticatedUserFullName] =
    useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [newOrder, setNewOrder] = useState([])
  const [remappedNewOrder, setRemappedNewOrder] = useState([])
  const [birNumber, setBirNumber] = useState(null);
  const [selectedCustomerDescription, setSelectedCustomerDescription] = useState(null);
  const token = Cookies.get("sessionToken");
  const [receiptNumber, setReceiptNumber] = useState(null);

  useEffect(() => {
    addNewProduct();
    setReceiptNumber(Math.floor(Math.random() * 90000) + 10000);
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
    if (selectedCustomerId) {
      const foundCustomers = getCustomers.data.data?.data?.customers;
      const foundCustomer = foundCustomers.find(
        (res) => res._id === selectedCustomerId
      );
      setSelectedCustomerDescription(foundCustomer.description);
    }
  }, [selectedCustomerId]);

  useEffect(() => {
    if (autheticatedUserId) {
      getAutheticatedUserData.refetch();
    }
  }, [autheticatedUserId]);

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
        setOriginalProducts(foundProducts);
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
        setSelectedCustomerDescription(null);
        setReceiptNumber(Math.floor(Math.random() * 90000) + 10000);
        setBirNumber("");
        const toUpdate = [];
        setOrder(toUpdate);
        setOrders(toUpdate);
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

  useEffect(() => {
    if(newOrder.length > 0 && originalProducts.length > 0) {
      const newOrders = newOrder.map((res) => {
        const foundProduct = originalProducts.find(element => element._id === res[0].productId)
        return {
          _id: res[0].productId,
          iceType: foundProduct.iceType,
          weight: foundProduct.weight,
          scaleType: foundProduct.scaleType,
          quantity: res.length, 
          cost: foundProduct.cost * res.length
        }
      })
      setRemappedNewOrder(newOrders)
    }
  }, [originalProducts])

  useEffect(() => {
    if (order.length > 0 && originalProducts.length > 0) {
      const newOrder = order.map((res) => {
        if (res.productId) {
          const newOrderArr = Array(res.quantity ? res.quantity : 1)
          newOrderArr.fill({ productId: res.productId })
          return newOrderArr
        }
      }).filter(res => res)
      const flattenNewOrder = newOrder.reduce((acc, curVal) => acc.concat(curVal), []);
      const allOrders = flattenNewOrder
        .map((res) => {
          return originalProducts.find((res2) => res.productId === res2._id);
        })
        .filter((res3) => res3);
      setOrders(allOrders);
    }
  }, [products, order]);
  
  const submit = () => {
    if (selectedCustomerId) {
      const newOrder = order.map((res) => {
        if (res.productId) {
          const newOrderArr = Array(res.quantity)
          newOrderArr.fill({ productId: res.productId })
          return newOrderArr
        }
      }).filter(res => res);
      const flattenNewOrder = newOrder.reduce((acc, curVal) => acc.concat(curVal), []);
      const toInsert = flattenNewOrder
        .map((res) => {
          if (res.productId) {
            return {
              ...res,
              customerId: selectedCustomerId,
              userId: autheticatedUserId,
              birNumber: birNumber,
              receiptNumber,
            };
          }
        })
        .filter((res2) => res2);
      if (toInsert.length > 0) {
        toInsert.map((res) => {
          createSales.mutate(`mutation {
              createSale(customerId: "${res.customerId}", userId: "${res.userId}", receiptNumber: ${res.receiptNumber}, productId: "${res.productId}", birNumber: ${res.birNumber}) {
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
    setOrder([...toUpdate, { productId: "", quantity: 1 }]);
  };

  const updateProduct = (value, index) => {
    const toUpdate = order;
    toUpdate[index].productId = value;
    setOrder([...toUpdate]);
  };

  const updateProductQuantity = (value, index) => {
    const toUpdate = order;
    toUpdate[index].quantity = parseInt(value);
    setOrder([...toUpdate]);
  };


  return (
    <>
      <Grid fluid>
        <Row>
          <Col xs={18}>
            <Panel bordered style={{ marginTop: 10 }} header="Order">
              <Form onSubmit={() => submit()}>
                <FormGroup>
                  <ControlLabel>Staff</ControlLabel>
                  <h4>
                    {!getAutheticatedUserData.isLoading ? (
                      autheticatedUserFullName
                    ) : (
                      <Loader />
                    )}
                  </h4>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    Customer<span style={{ color: "red" }}>*</span>
                  </ControlLabel>
                  <SelectPicker
                    value={selectedCustomerId}
                    data={customers}
                    block
                    onChange={(e) => {
                      setSelectedCustomerId(e);
                      setSelectedCustomerDescription(e);
                    }}
                    disabled={createSales.isLoading}
                  />
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => history.push("/customer?tab=addCustomer")}
                  >
                    Add new customer?
                  </a>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>BIR Receipt #</ControlLabel>
                  <Input
                    block
                    type="number"
                    value={birNumber}
                    onChange={(e) => setBirNumber(e)}
                  />
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
                          disabled={createSales.isLoading}
                        />
                      </FormGroup>
                      <ControlLabel>Quantity</ControlLabel>
                      <Input
                        block
                        type="number"
                        onChange={(e) => updateProductQuantity(e, i)}
                        value={res.quantity}
                      />
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
                      disabled={createSales.isLoading}
                    >
                      Create
                    </Button>
                  </ButtonToolbar>
                </FormGroup>
              </Form>
            </Panel>
          </Col>
          <Col xs={6}>
            <Panel bordered style={{ marginTop: 10 }} header="Receipt Preview">
              <ReceiptNew
                cust={
                  selectedCustomerDescription
                    ? selectedCustomerDescription
                    : "---"
                }
                staff={
                  autheticatedUserFullName ? autheticatedUserFullName : "---"
                }
                remappedNewOrder={remappedNewOrder}
                orders={orders}
                birNumber={birNumber ? birNumber : "---"}
                receiptNumber={receiptNumber ? receiptNumber : "---"}
              />
            </Panel>
          </Col>
        </Row>
      </Grid>
    </>
  );
};

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(AddOrder2);
