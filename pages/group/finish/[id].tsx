import "react"
import { useRouter } from "next/router"
import { Button } from "antd"

export default function GroupFinish() {
  const router = useRouter()

  const handleHome = () => {
    router.push("/home")
  }

  return (
    <div className="container">
      Finish!
      <Button onClick={handleHome}>Home</Button>
    </div>
  )
}