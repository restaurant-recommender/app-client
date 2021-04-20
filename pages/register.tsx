import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { Button, Input } from "antd";
import { Loading, Spacer } from "../components";
import { useFormatter } from "../utils";
import { authenticationService, RegisterBody, trackingService } from "../services";
import { setToken } from "../utils/auth";
import { AuthenticationToken } from "../types";
import { ActivityEvent } from "../utils/constant";

export default function Register() {
  const router = useRouter()
  const f = useFormatter()

  const [username, setUsername] = useState<string>(null)
  const [password, setPassword] = useState<string>(null)
  const [loading, setLoading] = useState<string>('')

  const handleInputUsername = (e) => { e.preventDefault(); setUsername(e.target.value) }
  const handleInputPassword = (e) => { e.preventDefault(); setPassword(e.target.value) }

  useEffect(() => {
    trackingService.track(ActivityEvent.REGISTER_PAGE)
  })

  const handleRegister = () => {
    if (!username || !password) {
      alert('Please fill your new username and password')
    } else {
      authenticationService.hasUsername(username).then((response) => {
        if (response.data) {
          // username existed
          alert('This username is already taken')
        } else {
          const body: RegisterBody = { username, password }
          setLoading(f('loading_creatingNewAccount'))
          authenticationService.register(body).then((response) => {
            const result = response.data
            if (!result.status) throw(result.code)
            else {
              const token: AuthenticationToken = { 
                token: result.data.token, 
                username: result.data.username,
                id: result.data.id,
              }
              setToken(token)
              setLoading('')
              trackingService.track(ActivityEvent.REGISTER_COMPLETE)
              router.push('/preference')
            }
          }).catch((error) => {
            alert(f(error))
            setLoading('')
          })
        }
      })
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="container middle register-page">
      <Loading message={loading} />
      <h3 style={{marginBottom: 0, color: 'gray'}}>{f('register_topWelcome')}</h3>
      <div><span className="title">{f('appName')}</span> <span className="tag">(BETA)</span></div>
      <Spacer />
      <p style={{marginBottom: "0.5rem"}}>{f('register_description')}</p>
      <Input onChange={handleInputUsername} size="large" placeholder="New Username"/>
      <Spacer rem={0.75} />
      <Input.Password onChange={handleInputPassword} size="large" placeholder="New Password"/>
      <Spacer rem={0.75} />
      <Button onClick={handleRegister} type="primary" size="large">{f('btn_next')}</Button>
      <Spacer />
      <p>{f('register_login1')}<a onClick={handleLogin}>{f('btn_login')}</a>{f('register_login2')}</p>
    </div>
  )
}