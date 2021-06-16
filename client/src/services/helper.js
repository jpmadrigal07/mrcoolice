import Cookies from "js-cookie";

export const getToken = () => {
    return Cookies.get("sessionToken");
};

export const logOut = () => {
    // Login component has a function to remove the token
    // everytime it has been mounted so, we just need
    // to redirect the user to login
    window.location.href = "/";
};