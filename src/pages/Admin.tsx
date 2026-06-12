import { useEffect, useState } from "react"

import { db } from "../firebase"

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"

import { uploadImage } from "../utils/uploadImage"

function Admin() {
  const [equipos, setEquipos] = useState<any[]>([])

  const [nombre, setNombre] = useState("")
  const [puntos, setPuntos] = useState("")
  const [archivo, setArchivo] = useState<any>(null)

  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")

  const [logueado, setLogueado] = useState(
    sessionStorage.getItem("admin") === "ok"
  )

  const login = () => {
    if (
      usuario === "admin" &&
      password === "4754"
    ) {
      sessionStorage.setItem("admin", "ok")
      setLogueado(true)
    } else {
      alert("Usuario o contraseña incorrectos")
    }
  }

  const logout = () => {
    sessionStorage.removeItem("admin")
    setLogueado(false)
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "equipos"), (snapshot) => {
      const lista: any[] = []

      snapshot.forEach((docu) => {
        lista.push({
          id: docu.id,
          ...docu.data(),
        })
      })

      lista.sort((a, b) => b.puntos - a.puntos)

      setEquipos(lista)
    })

    return () => unsubscribe()
  }, [])

  const agregarEquipo = async (e: any) => {
    e.preventDefault()

    if (!nombre || !puntos) return
    if (!archivo) return

    try {
      const imageUrl = await uploadImage(archivo)

      await addDoc(collection(db, "equipos"), {
        nombre,
        puntos: Number(puntos),
        escudo: imageUrl,
      })

      setNombre("")
      setPuntos("")
      setArchivo(null)
    } catch (err) {
      console.error(err)
      alert("Error agregando equipo")
    }
  }

  const cambiarPuntos = async (
    id: string,
    puntosActuales: number,
    delta: number
  ) => {
    const nuevoValor = puntosActuales + delta

    await updateDoc(doc(db, "equipos", id), {
      puntos: nuevoValor < 0 ? 0 : nuevoValor,
    })
  }

  const eliminarEquipo = async (id: string) => {
    await deleteDoc(doc(db, "equipos", id))
  }

  if (!logueado) {
    return (
      <div
        style={{
          background: "#18181b",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#27272a",
            padding: "30px",
            borderRadius: "15px",
            width: "320px",
          }}
        >
          <h2
            style={{
              color: "white",
              marginBottom: "20px",
            }}
          >
            Login Admin
          </h2>

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "10px",
              border: "none",
            }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "none",
            }}
          />

          <button
            onClick={login}
            style={{
              width: "100%",
              background: "#22c55e",
              color: "white",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Ingresar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: "#18181b",
        minHeight: "100vh",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>Carga de equipos y puntajes</h1>

      <button
        onClick={logout}
        style={{
          background: "#ef4444",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        Cerrar sesión
      </button>

      <form
        onSubmit={agregarEquipo}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
          marginTop: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "none",
          }}
        />

        <input
          type="number"
          placeholder="Puntos"
          value={puntos}
          onChange={(e) => setPuntos(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "none",
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e: any) => setArchivo(e.target.files[0])}
        />

        <button
          type="submit"
          style={{
            background: "#22c55e",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Agregar equipo
        </button>
      </form>

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "700px",
        }}
      >
        {equipos.map((equipo) => (
          <div
            key={equipo.id}
            style={{
              background: "#27272a",
              padding: "15px",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <img
                src={equipo.escudo}
                alt="escudo"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div>
                <h2>{equipo.nombre}</h2>
                <p>{equipo.puntos} pts</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={() => cambiarPuntos(equipo.id, equipo.puntos, 1)}>+1</button>
              <button onClick={() => cambiarPuntos(equipo.id, equipo.puntos, 10)}>+10</button>
              <button onClick={() => cambiarPuntos(equipo.id, equipo.puntos, 100)}>+100</button>

              <button onClick={() => cambiarPuntos(equipo.id, equipo.puntos, -1)}>-1</button>
              <button onClick={() => cambiarPuntos(equipo.id, equipo.puntos, -10)}>-10</button>
              <button onClick={() => cambiarPuntos(equipo.id, equipo.puntos, -100)}>-100</button>

              <button onClick={() => eliminarEquipo(equipo.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Admin