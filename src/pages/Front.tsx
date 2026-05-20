import { useEffect, useState } from "react"

import { db } from "../firebase"

import {
  collection,
  onSnapshot,
} from "firebase/firestore"

function Front() {
  const [equipos, setEquipos] = useState<any[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "equipos"),
      (snapshot) => {
        const lista: any[] = []

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        lista.sort(
          (a, b) => b.puntos - a.puntos
        )

        setEquipos(lista)
      }
    )

    return () => unsubscribe()
  }, [])

  return (
    <div
      style={{
        background: "#18181b",
        minHeight: "100vh",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>Tabla ⚽</h1>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {equipos.map((equipo, index) => (
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
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
                <p>#{index + 1}</p>
              </div>
            </div>

            <h2>{equipo.puntos} pts</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Front