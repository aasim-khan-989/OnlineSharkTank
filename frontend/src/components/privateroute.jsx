import {Navigate} from "react-router-dom" 

const  privateRoute = ({childern})=>{
    const isAuthneticated = localStorage.getItem("authToken");

    return isAuthneticated?childern :<Navigate to ="/login"></Navigate>

} 

export default privateRoute;