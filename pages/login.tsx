import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"
import { Button, Input } from "antd";
import { Spacer, Loading, Box } from "../components";
import { authenticationService, trackingService } from "../services";
import { Color, useFormatter } from "../utils";
import { setToken } from "../utils/auth";
import { ActivityEvent } from "../utils/constant";

export default function Login() {
  const router = useRouter()
  const f = useFormatter()

  const [username, setUsername] = useState<string>(null)
  const [password, setPassword] = useState<string>(null)
  const [loading, setLoading] = useState<string>('')

  const handleInputUsername = (e) => { e.preventDefault(); setUsername(e.target.value) }
  const handleInputPassword = (e) => { e.preventDefault(); setPassword(e.target.value) }

  useEffect(() => {
    trackingService.track(ActivityEvent.LOGIN_PAGE)
  })

  const handleLogin = () => {
    if (!username || !password) {
      alert(f('alert_missingForm'))
      return
    }
    setLoading(f('loading_loggingIn'))
    authenticationService.login({ username, password }).then((response) => {
      if (response.data.status) {
        const token = response.data.data
        setToken(token)
        router.push("/home").then(_ => {
          setLoading('')
        })
      } else { throw(f('auth_invalidUser')) }
    }).catch((error) => { alert(error); setLoading(''); })
  }

  const handleRegister = () => {
    router.push('/register')
  }

  const handleChangeLanguge= () => {
    trackingService.track(ActivityEvent.CHANGE_LANGUAGE_CLICK)
    router.push('/login', '/login', { locale: router.locale === 'th' ? 'en' : 'th' })
  }

  return (
    <div className="container middle register-page">
      <Loading message={loading} />
      <div><span className="title">{f('appName')}</span> <span className="tag">(BETA)</span></div>
      <Spacer />
      <p style={{marginBottom: "0.5rem"}}>{f('login_description')}</p>
      <Input size="large" onChange={handleInputUsername} placeholder="Username"/>
      <Spacer rem={0.75} />
      <Input.Password size="large" onChange={handleInputPassword} placeholder="Password"/>
      <Spacer rem={0.75} />
      <Button onClick={handleLogin} type="primary" size="large">{f('btn_login')}</Button>
      <Spacer />
      <p>{f('login_register1')}<a onClick={handleRegister}>{f('btn_register')}</a></p>
      <Box position="fixed" top="1rem" right="1rem" color={Color.orange} fontWeight="bold">
        <Button onClick={handleChangeLanguge}>{router.locale === 'th' ? 'EN' : 'ไทย'}</Button>
      </Box>
    </div>
  )
}