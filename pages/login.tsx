import React from "react";
import { useRouter } from "next/router"
import { Button, Input } from "antd";
import { Spacer } from "../components";

export default function Login() {
  const router = useRouter()
  return (
    <div className="container middle register-page">
      <div><span className="title">Kinraidee</span> <span className="tag">(BETA)</span></div>
      <Spacer />
      <p style={{marginBottom: "0.5rem"}}>Please login.</p>
      <Input placeholder="Username"/>
      <Spacer rem={0.75} />
      <Button onClick={() => {router.push("/home")}} type="primary" size="large">Login</Button>
      <Spacer />
      <p>Don't have an account yet? <a href="/register">Register</a></p>
    </div>
  )
}