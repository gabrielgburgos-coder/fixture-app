import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"

import Front from "./pages/Front"
import Admin from "./pages/Admin"

function App() {
  const [equipos, setEquipos] = useState<any[]>([])

  // cargar datos guardados
  useEffect(() => {
    const guardados = localStorage.getItem("equipos")

    if (guardados) {
      setEquipos(JSON.parse(guardados))
    }
  }, [])

  // guardar automáticamente
  useEffect(() => {
    localStorage.setItem(
      "equipos",
      JSON.stringify(equipos)
    )
  }, [equipos])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Front />}
        />

        <Route
          path="/admin"
          element={
            <Admin
              equipos={equipos}
              setEquipos={setEquipos}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App