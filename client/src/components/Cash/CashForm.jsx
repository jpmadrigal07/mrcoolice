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
  DatePicker,
} from "rsuite";
import { graphqlUrl } from "../../services/constants";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { triggerTopAlert } from "../../actions/topAlertActions";
import moment from "moment";

const CashForm = (props) => {
  // local and global props
  const { isEditActive, setIsEditActive, toUpdateCash, triggerTopAlert } =
    props;

  // constant values
  const token = Cookies.get("sessionToken");

  // local state
  const [autheticatedUserId, setAutheticatedUserId] = useState(null);
  const [date, setDate] = useState(null);
  const [onePeso, setOnePeso] = useState(null);
  const [fivePeso, setFivePeso] = useState(null);
  const [tenPeso, setTenPeso] = useState(null);
  const [twentyPeso, setTwentyPeso] = useState(null);
  const [fiftyPeso, setFiftyPeso] = useState(null);
  const [oneHundredPeso, setOneHundredPeso] = useState(null);
  const [twoHundredPeso, setTwoHundredPeso] = useState(null);
  const [fiveHundredPeso, setFiveHundredPeso] = useState(null);
  const [oneThousandPeso, setOneThousandPeso] = useState(null);

  // functions
  const getAutheticatedUserId = useQuery("getAutheticatedUserId", async () => {
    const query = `{
            verifyToken(token: "${token}") {
                userId
            }
      }`;
    return await axios.post(graphqlUrl, { query });
  });

  const createCash = useMutation((query) => axios.post(graphqlUrl, { query }));

  const updateCash = useMutation((query) => axios.post(graphqlUrl, { query }));

  const create = () => {
    if (date) {
      createCash.mutate(
        `mutation{
            createCash(userId: "${autheticatedUserId}", createdAt: "${date}", onePeso: ${onePeso}, fivePeso: ${fivePeso}, tenPeso: ${tenPeso}, twentyPeso: ${twentyPeso}, fiftyPeso: ${fiftyPeso}, oneHundredPeso: ${oneHundredPeso}, twoHundredPeso: ${twoHundredPeso}, fiveHundredPeso: ${fiveHundredPeso}, oneThousandPeso: ${oneThousandPeso}) {
              userId {
                firstName
              }
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
      updateCash.mutate(
        `mutation{
            updateCash(_id: "${toUpdateCash._id}", userId: "${autheticatedUserId}", createdAt: "${date}", onePeso: ${onePeso}, fivePeso: ${fivePeso}, tenPeso: ${tenPeso}, twentyPeso: ${twentyPeso}, fiftyPeso: ${fiftyPeso}, oneHundredPeso: ${oneHundredPeso}, twoHundredPeso: ${twoHundredPeso}, fiveHundredPeso: ${fiveHundredPeso}, oneThousandPeso: ${oneThousandPeso}) {
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
      if (updateCash.isSuccess) {
        if (!updateCash.data?.data?.errors) {
          updateCash.reset();
          setIsEditActive(false);
          triggerTopAlert(true, "Successfully updated", "success");
        } else {
          triggerTopAlert(
            true,
            updateCash.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (updateCash.isError) {
        triggerTopAlert(true, updateCash.error.message, "danger");
      }
    }
  }, [updateCash]);

  useEffect(() => {
    if (!isEditActive) {
      if (createCash.isSuccess) {
        if (!createCash.data?.data?.errors) {
          setDate(null);
          setOnePeso("");
          setFivePeso("");
          setTenPeso("");
          setTwentyPeso("");
          setFiftyPeso("");
          setOneHundredPeso("");
          setTwoHundredPeso("");
          setFiveHundredPeso("");
          setOneThousandPeso("");
          createCash.reset();
          triggerTopAlert(true, "Successfully added", "success");
        } else {
          triggerTopAlert(
            true,
            createCash.data?.data?.errors[0].message,
            "danger"
          );
        }
      }
      if (createCash.isError) {
        triggerTopAlert(true, createCash.error.message, "danger");
      }
    }
  }, [createCash]);

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
      triggerTopAlert(true, updateCash.error.message, "warning");
    }
  }, [getAutheticatedUserId]);

  // side effects
  useEffect(() => {
    if (isEditActive && toUpdateCash) {
      setDate(moment.unix(toUpdateCash?.createdAt / 1000).format("MM/DD/YYYY"));
      setOnePeso(toUpdateCash?.onePeso);
      setFivePeso(toUpdateCash?.fivePeso);
      setTenPeso(toUpdateCash?.tenPeso);
      setTwentyPeso(toUpdateCash?.twentyPeso);
      setFiftyPeso(toUpdateCash?.fiftyPeso);
      setOneHundredPeso(toUpdateCash?.oneHundredPeso);
      setTwoHundredPeso(toUpdateCash?.twoHundredPeso);
      setFiveHundredPeso(toUpdateCash?.fiveHundredPeso);
      setOneThousandPeso(toUpdateCash?.oneThousandPeso);
    }
  }, [toUpdateCash]);

  return (
    <>
      <Panel bordered style={{ margin: "10px" }}>
        <Form onSubmit={isEditActive ? () => update() : () => create()}>
          <FormGroup>
            <ControlLabel>Date</ControlLabel>
            <DatePicker
              block
              onChange={(e) => setDate(e)}
              value={date}
              disabled={createCash.isLoading || updateCash.isLoading}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>One Peso</ControlLabel>
            <Input
              block
              type={"number"}
              onChange={(e) => setOnePeso(e)}
              value={onePeso}
              disabled={createCash.isLoading || updateCash.isLoading}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Five Peso</ControlLabel>
            <Input
              block
              type={"number"}
              onChange={(e) => setFivePeso(e)}
              value={fivePeso}
              disabled={createCash.isLoading || updateCash.isLoading}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Ten Peso</ControlLabel>
            <Input
              block
              type={"number"}
              onChange={(e) => setTenPeso(e)}
              value={tenPeso}
              disabled={createCash.isLoading || updateCash.isLoading}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Twenty Peso</ControlLabel>
            <Input
              block
              type={"number"}
              onChange={(e) => setTwentyPeso(e)}
              value={twentyPeso}
              disabled={createCash.isLoading || updateCash.isLoading}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Fifty Peso</ControlLabel>
            <Input
              block
              type={"number"}
              onChange={(e) => setFiftyPeso(e)}
              value={fiftyPeso}
              disabled={createCash.isLoading || updateCash.isLoading}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>One Hundred Peso</ControlLabel>
            <Input
              block
              type={"number"}
              onChange={(e) => setOneHundredPeso(e)}
              value={oneHundredPeso}
              disabled={createCash.isLoading || updateCash.isLoading}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Two Hundred Peso</ControlLabel>
            <Input
              block
              type={"number"}
              onChange={(e) => setTwoHundredPeso(e)}
              value={twoHundredPeso}
              disabled={createCash.isLoading || updateCash.isLoading}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Five Hundred Peso</ControlLabel>
            <Input
              block
              type={"number"}
              onChange={(e) => setFiveHundredPeso(e)}
              value={fiveHundredPeso}
              disabled={createCash.isLoading || updateCash.isLoading}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>One Thousand Peso</ControlLabel>
            <Input
              block
              type={"number"}
              onChange={(e) => setOneThousandPeso(e)}
              value={oneThousandPeso}
              disabled={createCash.isLoading || updateCash.isLoading}
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
                    disabled={updateCash.isLoading}
                  >
                    Update
                  </Button>
                  <Button
                    appearance="danger"
                    onClick={() => setIsEditActive(false)}
                    disabled={updateCash.isLoading}
                  >
                    Back to list
                  </Button>
                </Row>
              ) : (
                <Button
                  appearance="primary"
                  type="submit"
                  disabled={createCash.isLoading}
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

export default connect(mapStateToProps, { triggerTopAlert })(CashForm);
