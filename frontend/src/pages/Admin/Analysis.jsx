import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
const Analysis = () => {

    const {user} = useAuth()
    
  return (
    <div>
        <h1>{user.name}</h1>
        <h1>{user.email}</h1>
        <h1>{user.createdAt}</h1>
       
    </div>
  )
}

export default Analysis