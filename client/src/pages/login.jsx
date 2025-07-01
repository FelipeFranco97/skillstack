import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { loginSuccess } from "../redux/authSlice"
import { navigate } from "gatsby"

const LoginPage = () => {

  const API_URL = process.env.GATSBY_API_URL || "http://localhost:4000"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const dispatch = useDispatch()

  const handleLogin = async e => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Error en el login")
        return
      }

      dispatch(loginSuccess({ token: data.token, user: data.user }))
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      navigate("/dashboard")
    } catch (err) {
      setError("Error de conexión")
      console.error(err)
    }
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Iniciar sesión</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  )
}

export default LoginPage
