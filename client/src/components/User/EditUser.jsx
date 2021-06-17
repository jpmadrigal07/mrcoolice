import React, { useState } from 'react'
import UserForm from './UserForm'
import axios from "axios";
import { connect } from 'react-redux';
import { useMutation } from 'react-query'
import { triggerTopAlert } from '../../actions/topAlertActions';

function EditUser(props) {
    const {
        triggerTopAlert,
        setIsEditActive,
        isEditActive,
        userId,
        userList,
        staffUserType
    } = props
    const [inputUsername, setInputUsername] = useState("")
    const [inputPassword, setInputPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [inputFirstName, setInputFirstName] = useState("")
    const [inputLastName, setInputLastName] = useState("")
    const foundUser = userList?.find((user) => user._id === userId)
    const mutateUser = useMutation((query) =>
        axios.post("http://localhost:5000/mrcoolice", { query })
    );
    const handleEditUser = async () => {
        console.log("asdas")
        if (inputUsername && inputPassword && inputFirstName && inputLastName) {
            if(inputPassword === confirmPassword) {
                mutateUser.mutate(
                    `mutation{
                        updateUser(
                            _id: "${userId}"
                            username: "${inputUsername}"
                            password: "${inputPassword}"
                            userType: "${staffUserType}"
                            firstName: "${inputFirstName}"
                            lastName: "${inputLastName}"
                        ) {
                          username
                          password
                          userType
                          firstName
                          lastName
                          createdAt
                          updatedAt
                          deletedAt
                        }
                    }`
                )
                triggerTopAlert(true, "User updated successfully", "success")
            } else {
                triggerTopAlert(true, "Confirm password do not match, try again", "warning")
            }
        } else {
            triggerTopAlert(true, "Please complete all parameters", "warning")
        }
    }
    return (
        <div>
            <UserForm
                setIsEditActive={setIsEditActive}
                isEditActive={isEditActive}
                setInputUsername={setInputUsername}
                setInputPassword={setInputPassword}
                setInputFirstName={setInputFirstName}
                setInputLastName={setInputLastName}
                handleEditUser={handleEditUser}
                foundUser={foundUser}
                setConfirmPassword={setConfirmPassword}
            />
        </div>
    )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(EditUser);