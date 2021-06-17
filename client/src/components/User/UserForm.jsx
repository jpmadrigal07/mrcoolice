import React, { useState, useEffect } from 'react'
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
} from 'rsuite';
const UserForm = (props) => {
    const {
        setInputUsername,
        setInputPassword,
        setInputFirstName,
        setInputLastName,
        setConfirmPassword,
        handleCreateUser,
        setIsEditActive,
        isEditActive,
        foundUser,
        handleEditUser
    } = props
    useEffect(() => {
        setInputUsername(foundUser?.username)
        setInputPassword(foundUser?.password)
        setInputFirstName(foundUser?.firstName)
        setInputLastName(foundUser?.lastName)
    }, [])
    return (
        <div>
            <Row gutter={16}>
                <Col style={{ margin: '10px' }} md={6}>
                    <Panel bordered style={{ backgroundColor: 'white' }}>
                        <Form onSubmit={isEditActive ? () => handleEditUser() : () => handleCreateUser()}>
                            <FormGroup>
                                <ControlLabel>Username</ControlLabel>
                                <Input
                                    block
                                    onChange={(e) => setInputUsername(e)}
                                    defaultValue={isEditActive ? foundUser?.username : null}
                                    disabled={isEditActive}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Password</ControlLabel>
                                <Input
                                    type="password"
                                    block
                                    onChange={(e) => setInputPassword(e)}
                                    defaultValue={isEditActive ? foundUser?.password : null}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Confirm Password</ControlLabel>
                                <Input
                                    type="password"
                                    block
                                    onChange={(e) => setConfirmPassword(e)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>First name</ControlLabel>
                                <Input
                                    block
                                    onChange={(e) => setInputFirstName(e)}
                                    defaultValue={isEditActive ? foundUser?.firstName : null}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Last name</ControlLabel>
                                <Input
                                    block
                                    onChange={(e) => setInputLastName(e)}
                                    defaultValue={isEditActive ? foundUser?.lastName : null}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ButtonToolbar>
                                    {
                                        isEditActive ?
                                            <Row>
                                                <Button appearance="primary" type="submit" style={{ margin: 10 }}>Add</Button>
                                                <Button appearance="default" onClick={() => setIsEditActive(!isEditActive)}>Back to list</Button>
                                            </Row>
                                            :
                                            <Button appearance="primary" type="submit">Add</Button>
                                    }
                                </ButtonToolbar>
                            </FormGroup>
                        </Form>
                    </Panel>
                </Col>
            </Row>
        </div>
    )
}

export default UserForm
