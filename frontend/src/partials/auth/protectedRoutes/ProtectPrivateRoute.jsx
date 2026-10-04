import React from 'react'


import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import LoadingPage from '../../Loading'

const ProtectPrivateRoute = ({children}) => {

    const {isAuthenticated,isLoading} = useAuth()

    if(isLoading) return <LoadingPage />

    if(!isAuthenticated) return <Navigate replace to={'/auth/login'} />


    return <Outlet />
}

export default ProtectPrivateRoute