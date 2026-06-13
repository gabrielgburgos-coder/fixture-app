import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, onSnapshot } from "firebase/firestore"
import escudo from "../assets/escudo.png"
import mascota from "../assets/mascota.png"

function Front() {
  const [equipos, setEquipos] = useState<any[]>([])
  const [tabla, setTabla] = useState<any[]>([])
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null)

  // 🔥 EQUIPOS (cards principales)
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

  // 📊 TABLA (ranking separado)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tabla"), (snapshot) => {
      const items: any[] = []

      snapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      // orden automático por puntaje
      items.sort((a, b) => b.score - a.score)

      setTabla(items)
    })

    return () => unsub()
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
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "30px",
          marginBottom: "20px",
          flexWrap: "nowrap",
        }}
      >
        <img
          src={escudo}
          alt="Escudo"
          style={{ width: "90px", height: "90px", objectFit: "contain" }}
        />

        <div style={{ textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "42px" }}>
            Registro de puntos
          </h1>

          <h2 style={{ marginTop: "10px", color: "#d4d4d8" }}>
            Puntaje total Olivos:{" "}
            {equipos.reduce(
              (total, equipo) => total + (equipo.puntos || 0),
              0
            )}{" "}
            pts
          </h2>
        </div>

        <img
          src={mascota}
          alt="Mascota"
          style={{ width: "110px", height: "110px", objectFit: "contain" }}
        />
      </div>

      {/* LISTA DE EQUIPOS */}
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
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
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

              {/* ESCUDO */}
              {equipo.escudo ? (
                <img
                  src={equipo.escudo}
                  alt={equipo.nombre}
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
              ) : (
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "#3f3f46",
                    border: "2px solid #52525b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "32px",
                    color: "#fff",
                  }}
                >
                  {equipo.nombre?.charAt(0)?.toUpperCase()}
                </div>
              )}

              <div>
                <h2 style={{ margin: 0 }}>{equipo.nombre}</h2>
              </div>
            </div>

            <h2 style={{ fontSize: "22px" }}>{equipo.puntos} pts</h2>
          </div>
        ))}
      </div>

      {/* 📊 TABLA FINAL */}
      <div style={{ marginTop: "60px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Tabla de posiciones
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#27272a",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#3f3f46" }}>
              <th style={{ padding: "12px" }}>Pos</th>
              <th style={{ padding: "12px" }}>Equipo</th>
              <th style={{ padding: "12px" }}>Puntaje</th>
            </tr>
          </thead>

          <tbody>
            {tabla.map((item, index) => (
              <tr key={item.id} style={{ textAlign: "center" }}>
                <td style={{ padding: "10px" }}>{index + 1}</td>
                <td style={{ padding: "10px" }}>{item.name}</td>
                <td style={{ padding: "10px" }}>{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
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