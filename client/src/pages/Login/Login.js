import React, {useEffect} from 'react'
import "./Login.css";
import LoginForm from "../../components/Login/LoginForm"
import Cookies from "js-cookie";

const Login = () => {

    useEffect(() => {
        Cookies.remove("sessionToken");
    }, []);

    return (
        <div className="login-bg">
            <LoginForm/>
        </div>
    )
}

export default Login
