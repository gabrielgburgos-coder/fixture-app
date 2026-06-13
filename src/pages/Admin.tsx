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
  // =====================
  // EQUIPOS
  // =====================
  const [equipos, setEquipos] = useState<any[]>([])

  const [nombre, setNombre] = useState("")
  const [puntos, setPuntos] = useState("")
  const [archivo, setArchivo] = useState<any>(null)

  // =====================
  // TABLA
  // =====================
  const [tabla, setTabla] = useState<any[]>([])
  const [nombreTabla, setNombreTabla] = useState("")
  const [puntosTabla, setPuntosTabla] = useState("")

  // =====================
  // LOGIN
  // =====================
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")

  const [logueado, setLogueado] = useState(
    sessionStorage.getItem("admin") === "ok"
  )

  const login = () => {
    if (usuario === "admin" && password === "4754") {
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

  // =====================
  // CARGA EQUIPOS
  // =====================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "equipos"), (snapshot) => {
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

    return () => unsub()
  }, [])

  // =====================
  // CARGA TABLA
  // =====================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tabla"), (snapshot) => {
      const lista: any[] = []

      snapshot.forEach((docu) => {
        lista.push({
          id: docu.id,
          ...docu.data(),
        })
      })

      setTabla(lista)
    })

    return () => unsub()
  }, [])

  // =====================
  // EQUIPOS CRUD
  // =====================
  const agregarEquipo = async (e: any) => {
    e.preventDefault()

    if (!nombre || !puntos) return

    try {
      let imageUrl = ""

      if (archivo) {
        imageUrl = await uploadImage(archivo)
      }

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

  // =====================
  // TABLA CRUD
  // =====================
  const agregarFilaTabla = async () => {
    if (!nombreTabla || !puntosTabla) return

    await addDoc(collection(db, "tabla"), {
      nombre: nombreTabla,
      puntos: Number(puntosTabla),
    })

    setNombreTabla("")
    setPuntosTabla("")
  }

  const editarFilaTabla = async (id: string, valor: number) => {
    await updateDoc(doc(db, "tabla", id), {
      puntos: Number(valor),
    })
  }

  const eliminarFilaTabla = async (id: string) => {
    await deleteDoc(doc(db, "tabla", id))
  }

  // =====================
  // LOGIN SCREEN
  // =====================
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
          <h2 style={{ color: "white", marginBottom: "20px" }}>
            Login Admin
          </h2>

          <input
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
          />

          <button
            onClick={login}
            style={{
              width: "100%",
              background: "#22c55e",
              color: "white",
              padding: "12px",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            Ingresar
          </button>
        </div>
      </div>
    )
  }

  // =====================
  // ADMIN MAIN
  // =====================
  return (
    <div
      style={{
        background: "#18181b",
        minHeight: "100vh",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>Admin general</h1>

      <button
        onClick={logout}
        style={{
          background: "#ef4444",
          padding: "10px 15px",
          borderRadius: "10px",
          border: "none",
          marginBottom: "20px",
        }}
      >
        Cerrar sesión
      </button>

      {/* ===================== */}
      {/* EQUIPOS */}
      {/* ===================== */}
      <h2>Equipos</h2>

      <form
        onSubmit={agregarEquipo}
        style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}
      >
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="number"
          placeholder="Puntos"
          value={puntos}
          onChange={(e) => setPuntos(e.target.value)}
        />

        <input type="file" onChange={(e: any) => setArchivo(e.target.files[0])} />

        <button type="submit">Agregar equipo</button>
      </form>

      <div style={{ marginTop: "20px" }}>
        {equipos.map((e) => (
          <div key={e.id} style={{ marginBottom: "10px" }}>
            <b>{e.nombre}</b> - {e.puntos} pts

            <button onClick={() => cambiarPuntos(e.id, e.puntos, 1)}>+1</button>
            <button onClick={() => cambiarPuntos(e.id, e.puntos, 10)}>+10</button>
            <button onClick={() => cambiarPuntos(e.id, e.puntos, -1)}>-1</button>

            <button onClick={() => eliminarEquipo(e.id)}>Eliminar</button>
          </div>
        ))}
      </div>

      {/* ===================== */}
      {/* TABLA EDITABLE */}
      {/* ===================== */}
      <hr style={{ margin: "40px 0" }} />

      <h2>Tabla de posiciones</h2>

      <input
        placeholder="Nombre"
        value={nombreTabla}
        onChange={(e) => setNombreTabla(e.target.value)}
      />

      <input
        type="number"
        placeholder="Puntos"
        value={puntosTabla}
        onChange={(e) => setPuntosTabla(e.target.value)}
      />

      <button onClick={agregarFilaTabla}>Agregar a tabla</button>

      <div style={{ marginTop: "20px" }}>
        {tabla.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ width: "150px" }}>{t.nombre}</span>

            <input
              type="number"
              value={t.puntos}
              onChange={(e) => editarFilaTabla(t.id, Number(e.target.value))}
            />

            <button onClick={() => eliminarFilaTabla(t.id)}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Admin