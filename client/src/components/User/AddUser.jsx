import React, { useState } from 'react'
import UserForm from './UserForm'
import { useMutation } from 'react-query'
import axios from "axios";
import { connect } from 'react-redux';
import { triggerTopAlert } from '../../actions/topAlertActions';

const AddUser = (props) => {
    const { userTypeContent, triggerTopAlert, staffUserType } = props
    const [inputUsername, setInputUsername] = useState("")
    const [inputPassword, setInputPassword] = useState("")
    const [inputFirstName, setInputFirstName] = useState("")
    const [inputLastName, setInputLastName] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const userMutation = useMutation((query) =>
        axios.post("http://localhost:5000/mrcoolice", { query })
    );
    const handleCreateUser = () => {
        if(inputUsername && inputPassword && inputFirstName && inputLastName) {
            if(inputPassword === confirmPassword) {
                console.log("pasok")
                userMutation.mutate(
                    `mutation{
                        createUser(
                            username: "${inputUsername}"
                            password: "${inputPassword}"
                            userType: "${staffUserType}"
                            firstName: "${inputFirstName}"
                            lastName: "${inputLastName}"
                            ){
                            username,
                            password,
                            userType,
                            firstName,
                            lastName
                        }
                    }`
                )
                triggerTopAlert(true, "Account added successfully", "success")
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
                userTypeContent={userTypeContent}
                setInputUsername={setInputUsername}
                setInputPassword={setInputPassword}
                setInputFirstName={setInputFirstName}
                setInputLastName={setInputLastName}
                setConfirmPassword={setConfirmPassword}
                handleCreateUser={handleCreateUser}
            />
        </div>
    )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(AddUser);
