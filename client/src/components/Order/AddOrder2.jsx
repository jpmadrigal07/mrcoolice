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
  AutoComplete,
  InputNumber
} from "rsuite";
import {
  graphqlUrl,
  LOCATION_ITEMS,
  VEHICLE_TYPE_ITEMS,
  YES_NO_ITEMS,
} from "../../services/constants";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import ReceiptNew from "../Receipt/ReceiptNew";
import moment from "moment";

const AddOrder2 = (props) => {
  const history = useHistory();
  const { triggerTopAlert } = props;
  const [order, setOrder] = useState([]);
  const [orders, setOrders] = useState([]);
  const [autheticatedUserId, setAutheticatedUserId] = useState(null);
  const [autheticatedUserFullName, setAutheticatedUserFullName] =
    useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [inputCustomerDescription, setInputCustomerDescription] =
    useState(null);
  const [drNumber, setDrNumber] = useState(null);
  const [selectedCustomerDescription, setSelectedCustomerDescription] =
    useState(null);
  const [foundCustomerId, setFoundCustomerId] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsWithId, setProductsWithId] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [birNumber, setBirNumber] = useState(null);
  const token = Cookies.get("sessionToken");
  const [receiptNumber, setReceiptNumber] = useState(null);
  const [dayCount, setDayCount] = useState(null);
  const [location, setLocation] = useState(null);
  const [vehicleType, setVehicleType] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const [orderList, setOrderList] = useState([]);

  const getOrderList = useQuery("OrderList", async () => {
    const query = `{
        sales {
          customerId {
              _id
              description
            },
          _id,
          productId {
            _id,
            iceType,
            weight,
            scaleType,
            cost
          },
          receiptNumber,
          dayCount,
          birNumber,
          drNumber,
          createdAt
        }
      }`;
    return await axios.post(graphqlUrl, { query });
  });

  useEffect(() => {
    if (getOrderList.isSuccess) {
      if (
        !getOrderList.data.data?.errors &&
        getOrderList.data.data?.data?.sales
      ) {
        const sales = getOrderList.data.data?.data?.sales;
        setOrderList(sales);
      }
    }
  }, [getOrderList.data]);

  useEffect(() => {
    if (order.length === 0) {
      addNewProduct();
    }
    if (orderList.length > 0) {
      const receiptIncrement =
        orderList[orderList?.length - 1]?.receiptNumber + 1;
      setReceiptNumber(receiptIncrement);
    } else {
      setReceiptNumber(1);
    }
    const startDay = moment().startOf("day").unix() * 1000;
    const endDay = moment().endOf("day").unix() * 1000;
    const orderListFilteredByCurrentDay = orderList.filter(
      (res) =>
        parseInt(res.createdAt) > parseInt(startDay) &&
        parseInt(res.createdAt) < parseInt(endDay)
    );
    if (orderListFilteredByCurrentDay.length > 0) {
      const receiptIncrement =
        orderListFilteredByCurrentDay[orderListFilteredByCurrentDay?.length - 1]
          ?.dayCount + 1;
      setDayCount(receiptIncrement);
    } else {
      setDayCount(1);
    }
  }, [orderList]);

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
            value: res.description,
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
        const remappedNewProducts = foundProducts.map((res) => {
          return {
            value: `(P${res.cost}) - ${res.weight} ${res.scaleType} ${res.iceType} ice`,
            label: `(P${res.cost}) - ${res.weight} ${res.scaleType} ${res.iceType} ice`,
          };
        });
        const remappedNewProductsWithId = foundProducts.map((res) => {
          return {
            id: res._id,
            label: `(P${res.cost}) - ${res.weight} ${res.scaleType} ${res.iceType} ice`,
          };
        });
        setProducts(remappedNewProducts);
        setProductsWithId(remappedNewProductsWithId);
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
        const receiptIncrement =
          orderList[orderList?.length - 1]?.receiptNumber;
        setReceiptNumber(receiptIncrement);
        const startDay = moment().startOf("day").unix() * 1000;
        const endDay = moment().endOf("day").unix() * 1000;
        const orderListFilteredByCurrentDay = orderList.filter(
          (res) =>
            parseInt(res.createdAt) > parseInt(startDay) &&
            parseInt(res.createdAt) < parseInt(endDay)
        );
        const receiptIncrement2 =
          orderListFilteredByCurrentDay[orderListFilteredByCurrentDay?.length - 1]
            ?.dayCount;
        setDayCount(receiptIncrement2);
        setBirNumber("");
        setFoundCustomerId("");
        setDrNumber("");
        setLocation(null);
        setVehicleType(null);
        setRemarks("");
        setInputCustomerDescription("");
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
    if (order.length > 0 && originalProducts.length > 0) {
      const newOrder = order
        .map((res) => {
          if (res.productId) {
            const newOrderArr = Array(res.quantity ? res.quantity : 1);
            newOrderArr.fill({ productId: res.productId });
            return newOrderArr;
          }
        })
        .filter((res) => res);
      const flattenNewOrder = newOrder.reduce(
        (acc, curVal) => acc.concat(curVal),
        []
      );
      const allOrders = flattenNewOrder
        .map((res) => {
          return originalProducts.find((res2) => res.productId === res2._id);
        })
        .filter((res3) => res3);
      setOrders(allOrders);
    }
  }, [products, order]);

  const submit = () => {
    if (foundCustomerId) {
      const newOrder = order
        .map((res) => {
          if (res.productId && res.quantity) {
            const newOrderArr = Array(res?.quantity);
            newOrderArr.fill({ productId: res?.productId });
            return newOrderArr;
          }
        })
        .filter((res) => res);
      const flattenNewOrder = newOrder.reduce(
        (acc, curVal) => acc.concat(curVal),
        []
      );
      const toInsert = flattenNewOrder
        .map((res) => {
          if (res.productId) {
            return {
              ...res,
              customerId: foundCustomerId,
              userId: autheticatedUserId,
              birNumber: birNumber ? birNumber : null,
              drNumber: drNumber ? drNumber : null,
              location: location,
              vehicleType: vehicleType,
              remarks: remarks,
              receiptNumber,
              dayCount,
            };
          }
        })
        .filter((res2) => res2);
      if (toInsert.length > 0) {
        toInsert.map((res) => {
          createSales.mutate(`mutation {
              createSale(
                customerId: "${res.customerId}", 
                userId: "${res.userId}", 
                receiptNumber: ${res.receiptNumber}, 
                dayCount: ${res.dayCount}, 
                productId: "${res.productId}", 
                birNumber: ${res.birNumber},
                location: "${res.location}",
                drNumber: ${res.drNumber},
                vehicleType: "${res.vehicleType}",
                remarks: "${res.remarks}",
              ) 
              {
                receiptNumber,
                dayCount
            }
          }
          `);
        });
      } else {
        triggerTopAlert(true, "Please complete all the parameters", "warning");
      }
    } else {
      triggerTopAlert(true, "Please select a registered customer", "warning");
    }
  };

  const addNewProduct = () => {
    const toUpdate = order;
    setOrder([...toUpdate, { productId: "", quantity: 1 }]);
  };

  const updateProduct = (value, index) => {
    const product = productsWithId.find(res => res.label === value);
    const toUpdate = order;
    toUpdate[index].productId = product?.id;
    setOrder([...toUpdate]);
  };

  const updateProductQuantity = (value, index) => {
    const toUpdate = order;
    toUpdate[index].quantity = parseInt(value);
    setOrder([...toUpdate]);
  };

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
                  <AutoComplete
                    type={"string"}
                    value={inputCustomerDescription}
                    data={customers}
                    block
                    onChange={(e) => {
                      setInputCustomerDescription(e);
                    }}
                    disabled={createSales.isLoading}
                  />
                </FormGroup>
                <ControlLabel>BIR Receipt #</ControlLabel>
                <InputNumber
                  block
                  scrollable={false}
                  value={birNumber}
                  onChange={(e) => setBirNumber(e)}
                  disabled={createSales.isLoading}
                />
                <br/>
                <ControlLabel>DR #</ControlLabel>
                <InputNumber
                  block
                  scrollable={false}
                  value={drNumber}
                  onChange={(e) => setDrNumber(e)}
                  disabled={createSales.isLoading}
                />
                <br/>
                <FormGroup>
                  <ControlLabel>Location</ControlLabel>
                  <SelectPicker
                    value={location}
                    data={LOCATION_ITEMS}
                    block
                    onChange={(e) => setLocation(e)}
                    disabled={createSales.isLoading}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Vehicle Type</ControlLabel>
                  <SelectPicker
                    value={vehicleType}
                    data={VEHICLE_TYPE_ITEMS}
                    block
                    onChange={(e) => setVehicleType(e)}
                    disabled={createSales.isLoading}
                    searchable={false}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Remarks</ControlLabel>
                  <Input
                    block
                    value={remarks}
                    onChange={(e) => setRemarks(e)}
                    disabled={createSales.isLoading}
                  />
                </FormGroup>
                <hr />
                {order.map((res, i) => {
                  return (
                    <>
                      <FormGroup>
                        <ControlLabel>Product {i + 1}<span style={{ color: "red" }}>*</span></ControlLabel>
                        <AutoComplete
                          type={"string"}
                          data={products}
                          block
                          onChange={(e) => updateProduct(e, i)}
                          disabled={createSales.isLoading}
                        />
                      </FormGroup>
                      <ControlLabel>Quantity<span style={{ color: "red" }}>*</span></ControlLabel>
                      <InputNumber
                        scrollable={false}
                        onChange={(e) => updateProductQuantity(e, i)}
                        value={res.quantity ? res.quantity : null}
                        disabled={createSales.isLoading}
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
                  inputCustomerDescription ? inputCustomerDescription : "---"
                }
                staff={
                  autheticatedUserFullName ? autheticatedUserFullName : "---"
                }
                orders={orders ? orders : updateProduct}
                birNumber={birNumber ? birNumber : "---"}
                dayCount={dayCount ? dayCount : "---"}
                location={location ? location : "---"}
                vehicleType={vehicleType ? vehicleType : "---"}
                drNumber={drNumber ? drNumber : "---"}
                receiptNumber={receiptNumber ? receiptNumber : "---"}
                remarks={remarks ? remarks : "---"}
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