import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, onSnapshot } from "firebase/firestore"

function Front() {
  const [equipos, setEquipos] = useState<any[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "equipos"), (snapshot) => {
      const lista: any[] = []

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      lista.sort((a, b) => b.puntos - a.puntos)

      setEquipos(lista)
    })

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
      <h1>Tabla de posiciones</h1>

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
              padding: "18px",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* IZQUIERDA */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              {/* POSICIÓN MÁS VISIBLE */}
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  background: "#3f3f46",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#fff",
                  boxShadow: "0 0 10px rgba(0,0,0,0.4)",
                }}
              >
                #{index + 1}
              </div>

              {/* ESCUDO MÁS GRANDE */}
              <img
                src={equipo.escudo}
                alt="escudo"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #52525b",
                }}
              />

              <div>
                <h2 style={{ margin: 0 }}>{equipo.nombre}</h2>
              </div>
            </div>

            {/* PUNTOS */}
            <h2 style={{ fontSize: "22px" }}>
              {equipo.puntos} pts
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Front