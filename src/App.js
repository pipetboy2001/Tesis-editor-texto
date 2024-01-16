// App.js
import React, { useState, useEffect } from "react";
import IdSelector from "./Components/IdSelector";
import Testing from "./Components/Testing";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [databaseIds, setDatabaseIds] = useState([]);
  const [texts, setTexts] = useState([]);

  const fetchData = async () => {
    try {
      const apiUrl =
        process.env.REACT_APP_API_URL || "http://localhost:8000/text";
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Error al obtener textos: ${response.statusText}`);
      }

      const data = await response.json();
      const ids = data.texts.map((text) => text._id);
      setDatabaseIds(ids);
      setTexts(data.texts);
    } catch (error) {
      console.error("Error al obtener textos: ", error);
      // Realiza acciones adicionales en caso de error, como mostrar un mensaje al usuario
    }
  };

  useEffect(() => {
    // Llama a fetchData al montar el componente
    fetchData();

    // Establece un intervalo para llamar a fetchData cada X milisegundos
    const intervalId = setInterval(() => {
      fetchData();
    }, 3000); // Actualiza cada 60 segundos (ajusta según tus necesidades)

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []); // El segundo parámetro es un array vacío para que se ejecute solo al montar y desmontar

  const handleIdSelect = (id) => {
    setSelectedId(id);
  };

  return (
    <>
      <div className="App">
        {selectedId ? (
          <DndProvider backend={HTML5Backend}>
            <Testing
              selectedId={selectedId}
              texts={texts}
              setTexts={setTexts}
            />
          </DndProvider>
        ) : (
          <IdSelector databaseIds={databaseIds} onIdSelect={setSelectedId} />
        )}
      </div>
    </>
  );
};

export default App;
