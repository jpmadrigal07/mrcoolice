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
    Row
  } from 'rsuite';

const CustomerForm = (props) => {
    const { 
        handleCreateCustomer, 
        handleEditCustomer, 
        setInputCustomerDescription,
        isEditActive, 
        setIsEditActive,
        foundCustomer
    } = props
    useEffect(() => {
        setInputCustomerDescription(foundCustomer?.description)
    }, [])
    return (
        <div className="login-bg">
            <Row gutter={16}>
                <Col style={{ margin: '10px' }} md={6}>
                    <Panel bordered style={{ backgroundColor: 'white' }}>
                        <Form onSubmit={isEditActive ? () => handleEditCustomer() : () => handleCreateCustomer()}>
                            <FormGroup>
                                <ControlLabel>Customer description</ControlLabel>
                                <Input
                                    block
                                    onChange={(e) => setInputCustomerDescription(e)}
                                    defaultValue={isEditActive ? foundCustomer?.description : null}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ButtonToolbar>
                                    {
                                        isEditActive ?
                                        <Row>
                                            <Button appearance="primary" type="submit" style={{ marginRight: 10 }}>Update customer</Button>
                                            <Button appearance="primary" onClick={() => setIsEditActive(!isEditActive)}>Back to list</Button>
                                        </Row>
                                        :
                                        <Button appearance="primary" type="submit">Add customer</Button>
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

export default CustomerForm
