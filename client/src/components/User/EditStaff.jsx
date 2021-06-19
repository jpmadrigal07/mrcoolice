import React, { useState, useEffect } from 'react'
import UserForm from './StaffForm'
import axios from "axios";
import { useQuery } from 'react-query'
import { graphqlUrl } from '../../services/constants';

function EditUser(props) {
    const {
        setIsEditActive,
        isEditActive,
        staffId
    } = props
    const [staff, setStaff] = useState("")

    const getToUpdateStaff = useQuery("getToUpdateStaff", async () => {
        const query = `{
            user(_id: "${staffId}") {
                _id
                username
                password
                userType
                firstName
                lastName
            }
          }`;
        return await axios.post(graphqlUrl, { query });
    });

    useEffect(() => {
        if (getToUpdateStaff.isSuccess) {
            if (
                !getToUpdateStaff.data.data?.errors &&
                getToUpdateStaff.data.data?.data?.user
            ) {
                setStaff(getToUpdateStaff.data.data?.data?.user);
            }
        }
    }, [getToUpdateStaff]);

    return (
        <div>
            <UserForm
                isEditActive={isEditActive}
                setIsEditActive={setIsEditActive}
                toUpdateStaff={staff}
            />
        </div>
    )
}

export default EditUser;