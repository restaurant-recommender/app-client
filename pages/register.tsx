import React from "react";
import { useRouter } from 'next/router'
import { Button, Input } from "antd";
import { Spacer } from "../components";

export default function Register() {
  const router = useRouter()

  return (
    <div className="container middle register-page">
      <h3 style={{marginBottom: 0, color: 'gray'}}>Welcome</h3>
      <div><span className="title">Kinraidee</span> <span className="tag">(BETA)</span></div>
      <Spacer />
      <p style={{marginBottom: "0.5rem"}}>Please enter your new username.</p>
      <Input placeholder="New Username"/>
      <Spacer rem={0.75} />
      <Button onClick={() => {router.push("/preference")}} type="primary" size="large">Next</Button>
      <Spacer />
      <p>Already have an account? <a href="/login">Login</a> instead</p>
    </div>
  )
}