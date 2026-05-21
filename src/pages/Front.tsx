import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, onSnapshot } from "firebase/firestore"

function Front() {
  const [equipos, setEquipos] = useState<any[]>([])
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null)

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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
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
                }}
              >
                #{index + 1}
              </div>

              {/* ESCUDO CLICKABLE */}
              <img
                src={equipo.escudo}
                alt="escudo"
                onClick={() => setImagenSeleccionada(equipo.escudo)}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #52525b",
                  cursor: "pointer",
                }}
              />

              <div>
                <h2 style={{ margin: 0 }}>{equipo.nombre}</h2>
              </div>
            </div>

            <h2 style={{ fontSize: "22px" }}>
              {equipo.puntos} pts
            </h2>
          </div>
        ))}
      </div>

      {/* MODAL IMAGEN */}
      {imagenSeleccionada && (
        <div
          onClick={() => setImagenSeleccionada(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <img
            src={imagenSeleccionada}
            alt="grande"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "20px",
              boxShadow: "0 0 20px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Front