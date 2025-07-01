import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { navigate } from "gatsby"

const SkillsPage = () => {
  const token = useSelector(state => state.auth.token)
  const [skills, setSkills] = useState([])
  const [name, setName] = useState("")
  const [level, setLevel] = useState("")
  const [error, setError] = useState("")
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editLevel, setEditLevel] = useState("")

  useEffect(() => {
    if (!token) navigate("/login")
  }, [token])

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        console.log("Token usado:", token)

        const res = await fetch("http://localhost:4000/api/skills", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        setSkills(data)
      } catch (err) {
        console.error("Error cargando habilidades:", err.message)
      }
    }

    if (token) fetchSkills()
  }, [token])

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://localhost:4000/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, level }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.message || "Error al guardar habilidad")
        return
      }

      const nuevaSkill = await res.json()
      setSkills([...skills, nuevaSkill])
      setName("")
      setLevel("")
    } catch (err) {
      setError("Error al conectar con el servidor")
    }
  }

  const handleDelete = async id => {
    try {
      const res = await fetch(`http://localhost:4000/api/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.message || "Error al eliminar")
        return
      }

      setSkills(skills.filter(skill => skill._id !== id))
    } catch (err) {
      setError("Error al eliminar")
    }
  }

  const startEdit = skill => {
    setEditId(skill._id)
    setEditName(skill.name)
    setEditLevel(skill.level)
  }

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/skills/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, level: editLevel }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || "Error al actualizar")
        return
      }

      const updated = await res.json()
      setSkills(skills.map(s => (s._id === updated._id ? updated : s)))
      setEditId(null)
      setEditName("")
      setEditLevel("")
    } catch (err) {
      setError("Error al actualizar")
    }
  }

  return (
    <div>
      <h1>Mis habilidades</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Habilidad"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Nivel"
          value={level}
          onChange={e => setLevel(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {skills.map(skill => (
          <li key={skill._id}>
            {editId === skill._id ? (
              <>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
                <input
                  value={editLevel}
                  onChange={e => setEditLevel(e.target.value)}
                />
                <button onClick={handleUpdate}>Guardar</button>
                <button onClick={() => setEditId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {skill.name} – {skill.level}
                <button onClick={() => startEdit(skill)}>Editar</button>
                <button onClick={() => handleDelete(skill._id)}>
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SkillsPage
