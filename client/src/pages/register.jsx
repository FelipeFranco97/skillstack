import React, { useState } from "react"
import { navigate } from "gatsby"

const RegisterPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleRegister = async e => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Error en el registro")
        return
      }

      navigate("/login")
    } catch (err) {
      setError("Error de conexión con el servidor")
      console.error(err)
    }
  }

  return (
    <>
      <h1>Registro</h1>
      <form onSubmit={handleRegister}>
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
        <button type='submit'>Registrarse</button>
      </form>
      {error && <p>{error}</p>}
    </>
  )
}

export default RegisterPage
