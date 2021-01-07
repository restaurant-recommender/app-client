import "react";
import { useRouter } from "next/router"
import { Button } from "antd"

export default function Home() {
  const router = useRouter()

  const handleCreateGroup = () => {
    const pin = "543123"
    router.push(`/group/${pin}`)
  }

  const handleLogout= () => {
    // TODO: remove user from session
    router.push(`/register`)
  }

  return (
    <div className="container middle">
      <Button>Individual Eating</Button>
      <Button onClick={handleCreateGroup}>Create Group</Button>
      <Button>Join Group</Button>
      <Button danger onClick={handleLogout}>Logout</Button>
    </div>
  )
}