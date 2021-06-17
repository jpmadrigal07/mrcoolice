import React, { useState, useEffect } from 'react'
import { triggerTopAlert } from '../../actions/topAlertActions';
import { useQuery, useMutation } from 'react-query'
import axios from "axios";
import { connect } from 'react-redux';
import Cookies from "js-cookie";
import CustomerForm from './CustomerForm';

const AddCustomer = (props) => {
    const { triggerTopAlert } = props
    const [inputCustomerDescription, setInputCustomerDescription] = useState("")
    const [userId, setUserId] = useState()
    const token = Cookies.get("sessionToken")
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
    const createSales = useMutation((query) =>
        axios.post("http://localhost:5000/mrcoolice", { query })
    );
    const handleCreateCustomer = async () => {
        if (inputCustomerDescription) {
            createSales.mutate(
                `mutation{
                    createCustomer(userId: "${userId}", description: "${inputCustomerDescription}") {
                        description
                    }
                }`
            )
            triggerTopAlert(true, "Customer successfully added", "success")
        } else {
            triggerTopAlert(true, "Please add customer description", "warning")
        }
    }
    return (
        <CustomerForm handleCreateCustomer={handleCreateCustomer} setInputCustomerDescription={setInputCustomerDescription} />
    )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(AddCustomer);
