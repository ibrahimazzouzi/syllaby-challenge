import { Button } from "antd"
import { useAuth } from "../store/authStore"

function Home () {

  const { user, clearUser } = useAuth()

  return (
    <div>
      <div>Welcome : {user.name}</div>
      <div>Email : {user.email}</div>
      <div>Role : {user.role}</div>
      <Button onClick={() => clearUser()}>logout</Button>
    </div>
  )
}

export default Home
