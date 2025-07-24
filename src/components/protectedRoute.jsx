import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const ProtectedRoutes = ({children})=>{
    const {user} = useAuth()

    if (!user) {
        return <Navigate to= "/signin" />
    }
    return children;
}

export default ProtectedRoutes;