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

const ExpenseForm = (props) => {
    const {
        setInputExpenseName,
        setInputCost,
        handleCreateExpense,
        isEditActive,
        setIsEditActive,
        handleEditExpense,
        foundExpense
    } = props
    useEffect(() => {
        setInputExpenseName(foundExpense?.name)
        setInputCost(foundExpense?.cost)
    }, [])
    return (
        <>
                    <Panel bordered style={{ margin: '10px' }}>
                        <Form onSubmit={isEditActive ? () => handleEditExpense() : () => handleCreateExpense()}>
                            <FormGroup>
                                <ControlLabel>Expense Name</ControlLabel>
                                <Input
                                    block
                                    onChange={(e) => setInputExpenseName(e)}
                                    defaultValue={isEditActive ? foundExpense?.name : null}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Cost</ControlLabel>
                                <Input
                                    block
                                    type="number"
                                    onChange={(e) => setInputCost(e)}
                                    defaultValue={isEditActive ? foundExpense?.cost : null}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ButtonToolbar>
                                    {
                                        isEditActive ?
                                            <Row>
                                                <Button appearance="primary" type="submit" style={{ marginRight: 10 }}>Update</Button>
                                                <Button appearance="default" onClick={() => setIsEditActive(!isEditActive)}>Back to list</Button>
                                            </Row>
                                            :
                                            <Button appearance="primary" type="submit">Add</Button>
                                    }
                                </ButtonToolbar>
                            </FormGroup>
                        </Form>
                    </Panel>

        </>
    )
}

export default ExpenseForm
