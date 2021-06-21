import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
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
import { useHistory } from "react-router-dom";
import { graphqlUrl } from "../../services/constants";

const EditOrder = (props) => {
  const {
    triggerTopAlert,
    isEditActive,
    setIsEditActive,
    orderId,
    orderList,
    customerList,
    iceTypeContent,
    weightContent,
    scaleContent,
  } = props;
  const foundOrder = orderList?.find((order) => order._id === orderId);
  const [inputCustomer, setInputCustomer] = useState(foundOrder.customerId._id);
  const [inputIceType, setInputIceType] = useState(foundOrder.iceType);
  const [inputWeight, setInputWeight] = useState();
  const [inputScaleType, setInputScaleType] = useState("");
  const [inputCustomWeight, setInputCustomWeight] = useState();
  const [inputCustomScaleType, setInputCustomScaleType] = useState("");
  const [userId, setUserId] = useState();
  const history = useHistory();
  const token = Cookies.get("sessionToken");
  const createSales = useMutation((query) =>
    axios.post(graphqlUrl, { query })
  );
  console.log(iceTypeContent, weightContent, scaleContent);
  const getId = useQuery(
    "getId",
    async () => {
      const query = `{
            verifyToken(token: "${token}") {
            userId
            }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      refetchInterval: 1000,
    }
  );

  useEffect(() => {
    if (
      weightContent.find((value) => value.value === foundOrder?.weight) ===
      undefined
    ) {
      setInputCustomWeight(foundOrder?.weight);
    } else {
      setInputWeight(foundOrder?.weight);
    }

    if (
      scaleContent.find((value) => value.value === foundOrder?.scaleType) ===
      undefined
    ) {
      setInputCustomScaleType(foundOrder?.scaleType);
    } else {
      setInputScaleType(foundOrder?.scaleType);
    }
  }, []);

  useEffect(() => {
    if (getId.isSuccess) {
      if (!getId.data.data?.errors && getId.data.data?.data?.verifyToken) {
        setUserId(getId.data.data?.data?.verifyToken?.userId);
      }
    }
  }, [getId.data, getId.isSuccess]);

  const customerContent = customerList?.map((customer) => ({
    value: customer._id,
    label: customer.description,
  }));

  const handleEditOrder = async () => {
    if (
      inputCustomer &&
      inputIceType &&
      (inputWeight || inputCustomWeight) &&
      (inputScaleType || inputCustomScaleType)
    ) {
      createSales.mutate(`mutation{
        updateSale(
          _id: "${orderId}",
          userId: "${userId}",
          customerId: "${inputCustomer}",
          iceType: "${inputIceType}",
          weight: ${inputWeight ? inputWeight : inputCustomWeight}, 
          scaleType: "${inputScaleType ? inputScaleType : inputCustomScaleType}"
        ) {
          iceType
          weight
          scaleType
        }
      }`);
      triggerTopAlert(true, "Order success", "success");
    } else {
      triggerTopAlert(true, "Please complete all parameters", "warning");
    }
  };

  const handleReset = () => {
    setInputCustomer("");
    setInputIceType("Tube");
    setInputWeight("");
    setInputScaleType("");
    setInputCustomWeight("");
    setInputCustomScaleType("");
  };

  return (
    <div className="login-bg">
      <Row gutter={16}>
        <Col style={{ margin: "10px" }} md={6}>
          <Panel bordered style={{ backgroundColor: "white" }}>
            <Form onSubmit={() => handleEditOrder()}>
              <FormGroup>
                <ControlLabel>Cashier</ControlLabel>
                <h4>Trixie C. Aguila</h4>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Customer</ControlLabel>
                <SelectPicker
                  data={customerContent}
                  block
                  onChange={(e) => setInputCustomer(e)}
                  value={inputCustomer}
                />
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => history.push("/customer")}
                >
                  Add new customer?
                </a>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Ice Type</ControlLabel>
                <InputPicker
                  data={iceTypeContent}
                  block
                  onChange={(e) => setInputIceType(e)}
                  value={inputIceType}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Weight</ControlLabel>
                <InputPicker
                  data={weightContent}
                  block
                  onChange={(e) => setInputWeight(e)}
                  disabled={inputCustomWeight ? true : false}
                  value={inputWeight}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Scale Type</ControlLabel>
                <SelectPicker
                  data={scaleContent}
                  block
                  onChange={(e) => setInputScaleType(e)}
                  disabled={inputCustomScaleType ? true : false}
                  value={inputScaleType}
                />
              </FormGroup>
              <hr />
              <ControlLabel>
                Custom
                <Whisper
                  placement="top"
                  trigger="hover"
                  speaker={
                    <Tooltip>
                      Custom is only applicable if you want to customize weight
                      and scale type
                    </Tooltip>
                  }
                >
                  <Icon
                    icon="info"
                    style={{
                      cursor: "pointer",
                      marginLeft: 3,
                      marginBottom: 10,
                    }}
                  />
                </Whisper>
              </ControlLabel>
              <FormGroup>
                <ControlLabel>Weight</ControlLabel>
                <Input
                  type="number"
                  block
                  onChange={(e) => setInputCustomWeight(e)}
                  disabled={inputWeight ? true : false}
                  value={inputCustomWeight}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Scale Type</ControlLabel>
                <Input
                  type="text"
                  block
                  onChange={(e) => setInputCustomScaleType(e)}
                  disabled={inputScaleType ? true : false}
                  value={inputCustomScaleType}
                />
              </FormGroup>
              <FormGroup>
                <ButtonToolbar>
                  <Row>
                    <Button
                      appearance="primary"
                      type="submit"
                      style={{ marginRight: 10 }}
                    >
                      Update order
                    </Button>
                    <Button
                      appearance="default"
                      onClick={() => handleReset()}
                      style={{ marginRight: 10 }}
                    >
                      Reset
                    </Button>
                    <Button
                      appearance="default"
                      onClick={() => setIsEditActive(!isEditActive)}
                    >
                      Back to list
                    </Button>
                  </Row>
                </ButtonToolbar>
              </FormGroup>
            </Form>
          </Panel>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(EditOrder);
