import { useEffect, useState } from "react"
import { db } from "../firebase"
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore"

function Admin() {
  const [turnos, setTurnos] = useState<any[]>([])

  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")

  const [logueado, setLogueado] = useState(
    sessionStorage.getItem("admin") === "ok"
  )

  const ADMIN_USER = "admin"
  const ADMIN_PASS = "1234"

  const login = () => {
    if (
      usuario === ADMIN_USER &&
      password === ADMIN_PASS
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
    if (!logueado) return

    const unsubscribe = onSnapshot(
      collection(db, "turnos"),
      (snapshot) => {
        const lista: any[] = []

        snapshot.forEach((docu) => {
          lista.push({
            id: docu.id,
            ...docu.data(),
          })
        })

        lista.sort((a, b) => {
          const fechaA = new Date(
            `${a.fecha}T${a.hora}`
          ).getTime()

          const fechaB = new Date(
            `${b.fecha}T${b.hora}`
          ).getTime()

          return fechaA - fechaB
        })

        setTurnos(lista)
      }
    )

    return () => unsubscribe()
  }, [logueado])

  const eliminarTurno = async (
    id: string
  ) => {
    const confirmar = confirm(
      "¿Eliminar turno?"
    )

    if (!confirmar) return

    await deleteDoc(
      doc(db, "turnos", id)
    )
  }

  if (!logueado) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-zinc-900 p-6 rounded-xl w-80 border border-zinc-800">
          <h1 className="text-white text-2xl font-bold mb-4 text-center">
            Login Admin
          </h1>

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) =>
              setUsuario(e.target.value)
            }
            className="w-full mb-3 p-3 rounded bg-zinc-800 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full mb-4 p-3 rounded bg-zinc-800 text-white outline-none"
          />

          <button
            onClick={login}
            className="w-full bg-green-500 hover:bg-green-600 transition p-3 rounded font-bold text-white"
          >
            Ingresar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          Panel Admin
        </h1>

        <button
          onClick={logout}
          className="bg-zinc-700 hover:bg-zinc-600 transition px-4 py-2 rounded-lg font-bold"
        >
          Cerrar sesión
        </button>
      </div>

      {turnos.length === 0 && (
        <p className="text-zinc-400">
          No hay turnos cargados
        </p>
      )}

      <div className="grid gap-4">
        {turnos.map((turno) => (
          <div
            key={turno.id}
            className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800"
          >
            <p className="mb-1">
              <b>Nombre:</b> {turno.nombre}
            </p>

            <p className="mb-1">
              <b>Teléfono:</b> {turno.telefono}
            </p>

            <p className="mb-1">
              <b>Servicio:</b> {turno.servicio}
            </p>

            <p className="mb-1">
              <b>Fecha:</b> {turno.fecha}
            </p>

            <p className="mb-4">
              <b>Hora:</b> {turno.hora}
            </p>

            <button
              onClick={() =>
                eliminarTurno(turno.id)
              }
              className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg font-bold"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Admin