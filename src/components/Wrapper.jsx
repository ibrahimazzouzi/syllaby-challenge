import { Navigate } from "react-router-dom"
import { useAuth } from "../store/authStore"
import Navbar from "./Navbar"
import Authorize from "./Authorize"

export const AuthWrapper = ({ children }) => {
  const { user } = useAuth()
  if (user) return <Navigate to='/' />
  return children
}

export const MainWrapper = ({ children }) => {
  const user = useAuth(state => state.user)
  if (!user) return <Navigate to='/login' />

  return (
    <Authorize role={user.role}>
      <div className="container">
        <Navbar />
        {children}
      </div>
    </Authorize>
  )
}
