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
import { graphqlUrl } from "../../services/constants";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { triggerTopAlert } from "../../actions/topAlertActions";

const ExpenseForm = (props) => {
  const { isEditActive, setIsEditActive, toUpdateProduct, triggerTopAlert } = props;
  const [iceType, setIceType] = useState("tube");
  const [weight, setWeight] = useState(null);
  const [scaleType, setScaleType] = useState("kg");
  const [cost, setCost] = useState(null);

  const createProduct = useMutation((query) =>
    axios.post(graphqlUrl, { query })
  );

  const updateProduct = useMutation((query) =>
    axios.post(graphqlUrl, { query })
  );

  const create = () => {
    if (iceType && weight > 0 && scaleType && cost > 0) {
      createProduct.mutate(
        `mutation{
          createProduct(iceType: "${iceType}", weight: ${weight}, scaleType: "${scaleType}", cost: ${cost}){
                        iceType
                        cost
                    }
                }`
      );
    } else {
      triggerTopAlert(true, "Please complete all parameters", "warning");
    }
  };

  const update = async () => {
    if (iceType && weight > 0 && scaleType && cost > 0) {
      updateProduct.mutate(
        `mutation{
                updateProduct(_id: "${toUpdateProduct._id}", iceType: "${iceType}", weight: ${weight}, scaleType: "${scaleType}", cost: ${cost}) 
                {
                  iceType
                  cost
                }
              }`
      );
    } else {
      triggerTopAlert(true, "Please complete all parameters", "warning");
    }
  };

  useEffect(() => {
    if (isEditActive && toUpdateProduct) {
      setIceType(toUpdateProduct?.iceType);
      setWeight(toUpdateProduct?.weight);
      setScaleType(toUpdateProduct?.scaleType);
      setCost(toUpdateProduct?.cost);
    }
  }, [toUpdateProduct]);

  useEffect(() => {
    if (isEditActive) {
      if (updateProduct.isSuccess) {
        if (!updateProduct.data?.data?.errors) {
          updateProduct.reset();
          setIsEditActive(false);
          triggerTopAlert(true, "Successfully updated", "success");
        } else {
          triggerTopAlert(
            true,
            updateProduct.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (updateProduct.isError) {
        triggerTopAlert(true, updateProduct.error.message, "danger");
      }
    }
  }, [updateProduct]);

  useEffect(() => {
    if (!isEditActive) {
      if (createProduct.isSuccess) {
        if (!createProduct.data?.data?.errors) {
          setIceType("tube");
          setWeight("");
          setScaleType("kg");
          setCost("");
          createProduct.reset();
          triggerTopAlert(true, "Successfully added", "success");
        } else {
          triggerTopAlert(
            true,
            createProduct.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (createProduct.isError) {
        triggerTopAlert(true, createProduct.error.message, "danger");
      }
    }
  }, [createProduct]);

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
      <Panel bordered style={{ margin: "10px" }}>
        <Form onSubmit={isEditActive ? () => update() : () => create()}>
          <FormGroup>
            <ControlLabel>Ice Type</ControlLabel>
            <SelectPicker
              defaultValue={"tube"}
              value={iceType}
              data={iceTypes}
              block
              onChange={(e) => setIceType(e)}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Weight</ControlLabel>
            <Input type="number" block value={weight} onChange={(e) => setWeight(e)} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Scale Type</ControlLabel>
            <SelectPicker
              defaultValue={"kg"}
              data={scaleTypes}
              value={scaleType}
              block
              onChange={(e) => setScaleType(e)}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Cost (Pesos)</ControlLabel>
            <Input type="number" block value={cost} onChange={(e) => setCost(e)} />
          </FormGroup>
          <FormGroup>
            <ButtonToolbar>
              {isEditActive ? (
                <Row>
                  <Button
                    appearance="primary"
                    type="submit"
                    style={{ marginRight: 10 }}
                    disabled={updateProduct.isLoading}
                  >
                    Update
                  </Button>
                  <Button
                    appearance="default"
                    onClick={() => setIsEditActive(!isEditActive)}
                    disabled={updateProduct.isLoading}
                  >
                    Back to list
                  </Button>
                </Row>
              ) : (
                <Button
                  appearance="primary"
                  type="submit"
                  disabled={createProduct.isLoading}
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
