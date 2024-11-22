import { Navigate, useLocation } from "react-router-dom"
import { appRoutes } from "../App"

function Authorize ({ role, children }) {
  const location = useLocation()

  const currentRoute = (
    appRoutes.find(route => route.path === location.pathname) || {}
  )

  if (!currentRoute.access) return children

  return !currentRoute.access.includes(role)
    ? <Navigate to='/' />
    : children
}

export default Authorize
