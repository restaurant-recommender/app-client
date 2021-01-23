import React, { useState } from "react";
import { useRouter } from "next/router"
import { Button, Input } from "antd";
import { Spacer } from "../components";
import { authenticationService } from "../services";
import { useFormatter } from "../utils";
import { setToken } from "../utils/auth";

export default function Login() {
  const router = useRouter()
  const f = useFormatter()

  const [username, setUsername] = useState<string>(null)
  const [password, setPassword] = useState<string>(null)

  const handleInputUsername = (e) => { e.preventDefault(); setUsername(e.target.value) }
  const handleInputPassword = (e) => { e.preventDefault(); setPassword(e.target.value) }

  const handleLogin = () => {
    if (!username || !password) {
      alert(f('login_missingForm'))
      return
    }
    authenticationService.login({ username, password }).then((response) => {
      if (response.data.status) {
        const token = response.data.data
        setToken(token)
        router.push("/home")
      } else { throw(f('auth_invalidUser')) }
    }).catch((error) => { alert(error) })
  }

  const handleRegister = () => {
    router.push('/register')
  }

  return (
    <div className="container middle register-page">
      <div><span className="title">{f('appName')}</span> <span className="tag">(BETA)</span></div>
      <Spacer />
      <p style={{marginBottom: "0.5rem"}}>{f('login_description')}</p>
      <Input size="large" onChange={handleInputUsername} placeholder="Username"/>
      <Spacer rem={0.75} />
      <Input size="large" onChange={handleInputPassword} placeholder="Password"/>
      <Spacer rem={0.75} />
      <Button onClick={handleLogin} type="primary" size="large">{f('btn_login')}</Button>
      <Spacer />
      <p>{f('login_register1')}<a onClick={handleRegister}>{f('btn_register')}</a></p>
    </div>
  )
}