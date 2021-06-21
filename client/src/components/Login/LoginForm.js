import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Row,
  Col,
  Panel,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  ButtonToolbar,
  Button,
  Loader,
  Alert,
} from "rsuite";
import { graphqlUrl } from "../../services/constants";
import axios from "axios";
import { useMutation } from "react-query";
import { triggerTopAlert } from "../../actions/topAlertActions";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import "./Login.css";

const LoginForm = (props) => {
  const history = useHistory();
  const { triggerTopAlert } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, mutate, data, isError, isSuccess } = useMutation((query) =>
    axios.post(graphqlUrl, { query })
  );

  const handleLogin = () => {
    if (username && password) {
      mutate(`mutation {
                login(username: "${username}", password: "${password}") {
                    token
                }
            }`);
    } else {
      triggerTopAlert(true, "Please complete all parameters", "warning");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (!data.data.errors) {
        Cookies.set("sessionToken", data.data.data.login.token);
        history.push("/order");
      } else {
        triggerTopAlert(true, data.data.errors[0].message, "danger");
      }
    }
    if (isError) {
      triggerTopAlert(true, "Unknown error occured", "danger");
    }
  }, [data, isError, isSuccess]);

  return (
    <Grid>
      <Col xs={24} md={10} mdPush={7} style={{ marginTop: "50px" }}>
        <Panel
          className="login-panel"
          header={
            <Row>
              <Col>
                <h2>Login</h2>
              </Col>
            </Row>
          }
          shaded
        >
          <Row>
            <Col>
              <Form fluid onSubmit={() => handleLogin()}>
                <FormGroup>
                  <ControlLabel>Username</ControlLabel>
                  <FormControl
                    type="text"
                    onChange={(e) => setUsername(e)}
                    value={username}
                    disabled={isLoading}
                    autoFocus
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    type="password"
                    onChange={(e) => setPassword(e)}
                    value={password}
                    disabled={isLoading}
                  />
                </FormGroup>
                <FormGroup>
                  <ButtonToolbar>
                    <Button
                      appearance="primary"
                      type="submit"
                      disabled={isLoading}
                    >
                      {!isLoading ? "Sign in" : <Loader inverse />}
                    </Button>
                  </ButtonToolbar>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Panel>
      </Col>
    </Grid>
  );
};

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(LoginForm);
