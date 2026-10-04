import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import {API_URL} from "../API";
import toast from "react-hot-toast";

const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start with loading true by default
    loading: false, // Start with loading false by default
    error: null,
    login: async () => {
        throw new Error('AuthContext not initialized');
    },
    logout: async () => {
        throw new Error('AuthContext not initialized');
    },
});



export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState({
        message: '',
        isErr: false
    })
    const [loading, setLoading] = useState(false)

    const login = async (data) => {
        setLoading(true)
        setError(pre => (
            { ...pre, message: '', isErr: false }
        ))

        toast.loading('please, wait moment.....', { id: "login-auth" })


        try {


            const response = await axios.post(`${API_URL}/auth/login`,  data ,{ withCredentials: true })

            if (response.data) {
                await checkAuthStatus()
                toast.success('succesfully logged in', { id: "login-auth" })
            }

        } catch (error) {

            if (error.response && error.response.data.message) {
                setError(pre => (
                    { ...pre, message: error.response.data.message, isErr: true }
                ))
                toast.error(error.response.data.message, { id: "login-auth" })
            }
            else {
                toast.error(error.message, { id: "login-auth" })
                setError(pre => (
                    { ...pre, message: error.message, isErr: true }
                ))
            }
            const errorMessage = error?.response?.data?.message || error.message;
            throw new Error(`Error occurred during login: ${errorMessage}`);

        } finally {
            setLoading(false)
        }
    }
    const logout = async (data) => {
      if(user && isAuthenticated){
        setLoading(true)
        setError(pre => (
            { ...pre, message: '', isErr: false }
        ))

        toast.loading('please, wait moment......', { id: "logout-auth" })


        try {

          
            

            const response = await axios.post(`${API_URL}/auth/logout/${user.user_id}`, { data }, { withCredentials: true })

           
                setIsAuthenticated(false)
                setUser(false)

                toast.success('succesfully logged out', { id: "logout-auth" })
            

        } catch (error) {

            if (error.response && error.response.data.message) {
                setError(pre => (
                    { ...pre, message: error.response.data.message, isErr: true }
                ))
                toast.error(error.response.data.message, { id: "logout-auth" })
            }
            else {
                toast.error(error.message, { id: "logout-auth" })
                setError(pre => (
                    { ...pre, message: error.message, isErr: true }
                ))
            }
            const errorMessage = error?.response?.data?.message || error.message;
            throw new Error(`Error occurred during login: ${errorMessage}`);

        } finally {
            setLoading(false)
        }
      }
    }



    const checkAuthStatus = async () => {
        setIsLoading(true);
        setError(pre => (
            { ...pre, message: '', isErr: false }
        ));
        try {
            const resp = await axios.get(
                `${API_URL}/auth/user-auth`,
                { withCredentials: true }
            );
            if (resp.data.authenticated) {
                setIsAuthenticated(true);
                setUser(resp.data.user);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            const status = error?.response?.status;
            const errorMessage = error?.response?.data?.message || error.message;

            if (status === 409 || status === 401 || status === 403 || status === 400) {
                setIsAuthenticated(false);
                setUser(null);
            }

            toast.error( error?.response?.data?.message || 'Something went wrong . please try again later')
            setError(pre => (
                { ...pre, message: errorMessage, isErr: true }
            ));
            throw new Error(`Error occurred during login: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        checkAuthStatus()
    }, [])


    const values = {
        login,
        user,
        logout,
        isAuthenticated,
        isLoading,
        loading,
        error,
    }


    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    )


}




export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};