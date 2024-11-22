import { Link } from "react-router-dom"
import { useAuth } from "../store/authStore"

const navbarLinks = [
  { label: 'Home', path: '/', roles: ['author', 'collaborator'] },
  { label: 'Books', path: '/books', roles: ['author', 'collaborator'] },
  { label: 'Collaborators', path: '/collaborators', roles: ['author'] },
]

function Navbar () {

  const { user } = useAuth()
  const links = navbarLinks.filter(link => link.roles.includes(user.role))

  return (
    <div className="navbar">
      {links.map(link => (
        <Link key={link.path} to={link.path}>{link.label}</Link>
      ))}
    </div>
  )
}

export default Navbar
