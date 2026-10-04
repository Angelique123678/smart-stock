import React from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import LoadingPage from '../../Loading'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectPublicRoute = ({children}) => {

    const {isAuthenticated,isLoading} = useAuth()

    if(isLoading) return <LoadingPage />

    if(isAuthenticated) return <Navigate replace to={'/admin/dashboard'} />

    return <Outlet ></Outlet>
}

export default ProtectPublicRoute