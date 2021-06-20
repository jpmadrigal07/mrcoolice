import React, { useState, useEffect } from 'react'
import {
    Panel,
    Form,
    FormGroup,
    ControlLabel,
    Input,
    ButtonToolbar,
    Button,
    Row
} from 'rsuite';
import { graphqlUrl } from "../../services/constants";
import { useMutation } from "react-query";
import axios from "axios";
import { connect } from "react-redux";
import { triggerTopAlert } from "../../actions/topAlertActions";

const StaffForm = (props) => {
    const {
        triggerTopAlert,
        setIsEditActive,
        isEditActive,
        toUpdateStaff
    } = props
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const staff = "Staff"
    const createStaff = useMutation((query) =>
        axios.post(graphqlUrl, { query })
    );

    const updateStaff = useMutation((query) =>
        axios.post(graphqlUrl, { query })
    );

    const create = () => {
        if (username && password && firstName && lastName && confirmPassword) {
            if (confirmPassword === password) {
                createStaff.mutate(
                    `mutation{
                        createUser(
                            username: "${username}"
                            password: "${password}"
                            userType: "${staff}"
                            firstName: "${firstName}"
                            lastName: "${lastName}"
                        ) {
                          username
                          password
                          userType
                          firstName
                          lastName
                        }
                      }`
                )
            } else {
                triggerTopAlert(true, "Passwords do not match", "warning")
            }
        } else {
            triggerTopAlert(true, "Please complete all parameters", "warning")
        }
    }

    const update = async () => {
        if (username && password && firstName && lastName) {
            updateStaff.mutate(
                `mutation{
                        updateUser(
                            _id: "${toUpdateStaff._id}"
                            username: "${username}"
                            password: "${password}"
                            userType: "${staff}"
                            firstName: "${firstName}"
                            lastName: "${lastName}"
                        ) {
                          username
                          password
                          userType
                          firstName
                          lastName
                        }
                      }`
            )

        } else {
            triggerTopAlert(true, "Please complete all parameters", "warning")
        }
    }

    useEffect(() => {
        if (isEditActive && toUpdateStaff) {
            setUsername(toUpdateStaff?.username)
            setPassword(toUpdateStaff?.password)
            setFirstName(toUpdateStaff?.firstName)
            setLastName(toUpdateStaff?.lastName)
        }
    }, [toUpdateStaff])

    useEffect(() => {
        if (!isEditActive) {
            if (createStaff.isSuccess) {
                if (!createStaff.data?.data?.errors) {
                    setUsername("")
                    setPassword("")
                    setFirstName("")
                    setLastName("")
                    setConfirmPassword("")
                    createStaff.reset();
                    triggerTopAlert(true, "Successfully added", "success");
                } else {
                    triggerTopAlert(true, createStaff.data?.data?.errors[0].message, "danger");
                }
            }
            if (createStaff.isError) {
                triggerTopAlert(true, createStaff.error.message, "danger");
            }
        }
    }, [createStaff]);

    useEffect(() => {
        if (isEditActive) {
            if (updateStaff.isSuccess) {
                if (!updateStaff.data?.data?.errors) {
                    updateStaff.reset();
                    setIsEditActive(false);
                    triggerTopAlert(true, "Successfully updated", "success");
                } else {
                    triggerTopAlert(true, updateStaff.data?.data?.errors[0].message, "danger");
                }
            }
            if (updateStaff.isError) {
                triggerTopAlert(true, updateStaff.error.message, "danger");
            }
        }
    }, [updateStaff]);

    return (
        <>

            <Panel bordered style={{ margin: '10px' }}>
                <Form onSubmit={isEditActive ? () => update() : () => create()}>
                    <FormGroup>
                        <ControlLabel>Username</ControlLabel>
                        <Input
                            block
                            onChange={(e) => setUsername(e)}
                            value={username}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Password</ControlLabel>
                        <Input
                            type="password"
                            block
                            onChange={(e) => setPassword(e)}
                            value={password}
                        />
                    </FormGroup>
                    {
                        !isEditActive ?
                            <FormGroup>
                                <ControlLabel>Confirm Password</ControlLabel>
                                <Input
                                    type="password"
                                    block
                                    onChange={(e) => setConfirmPassword(e)}
                                    value={confirmPassword}
                                />
                            </FormGroup>
                            :
                            null
                    }

                    <FormGroup>
                        <ControlLabel>First name</ControlLabel>
                        <Input
                            block
                            onChange={(e) => setFirstName(e)}
                            value={firstName}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Last name</ControlLabel>
                        <Input
                            block
                            onChange={(e) => setLastName(e)}
                            value={lastName}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ButtonToolbar>
                            {
                                isEditActive ?
                                    <Row>
                                        <Button appearance="primary" type="submit" style={{ margin: 10 }}>Update</Button>
                                        <Button appearance="default" onClick={() => setIsEditActive(!isEditActive)}>Back to list</Button>
                                    </Row>
                                    :
                                    <Button appearance="primary" type="submit" disabled={createStaff.isLoading}>Add</Button>
                            }
                        </ButtonToolbar>
                    </FormGroup>
                </Form>
            </Panel>
        </>
    )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(StaffForm);