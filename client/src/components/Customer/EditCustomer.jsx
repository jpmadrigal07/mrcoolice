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
import { triggerTopAlert } from '../../actions/topAlertActions';
import { useQuery, useMutation } from 'react-query'
import axios from "axios";
import { connect } from 'react-redux';
import Cookies from "js-cookie";
import CustomerForm from './CustomerForm';

const EditCustomer = (props) => {
    const { triggerTopAlert, isEditActive, setIsEditActive, customerId, customerList } = props
    const [inputCustomerDescription, setInputCustomerDescription] = useState("")
    const [userId, setUserId] = useState()
    const token = Cookies.get("sessionToken")
    const foundCustomer = customerList?.find((customer) => customer._id === customerId)
    const getId = useQuery(
        "getId",
        async () => {
            const query = `{
                verifyToken(token: "${token}") {
                userId
                }
          }`;
            return await axios.post("http://localhost:5000/mrcoolice", { query });
        },
        {
            refetchInterval: 1000,
        }
    );
    useEffect(() => {
        if (getId.isSuccess) {
            if (!getId.data.data?.errors && getId.data.data?.data?.verifyToken) {
                setUserId(getId.data.data?.data?.verifyToken?.userId)
            }
        }
    }, [getId.data, getId.isSuccess])
    
    const editSales = useMutation((query) =>
        axios.post("http://localhost:5000/mrcoolice", { query })
    );
    const handleEditCustomer = async () => {
        if (inputCustomerDescription) {
            editSales.mutate(
                `mutation{
                    updateCustomer(_id: "${customerId}", userId: "${userId}", description: "${inputCustomerDescription}") {
                        description
                    }
                }`
            )
            triggerTopAlert(true, "Customer updated successfully", "success")
        } else {
            triggerTopAlert(true, "Please add customer description", "warning")
        }
    }
    return (
        <CustomerForm 
            handleEditCustomer={handleEditCustomer} 
            setInputCustomerDescription={setInputCustomerDescription} 
            isEditActive={isEditActive}
            setIsEditActive={setIsEditActive}
            foundCustomer={foundCustomer}
            inputCustomerDescription={inputCustomerDescription}
        />
    )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(EditCustomer);