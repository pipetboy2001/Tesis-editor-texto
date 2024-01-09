// App.js
import React, { useState, useEffect } from "react";
import IdSelector from "./Components/IdSelector";
import TextEditor from "./Components/EditorTexto";

const App = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [databaseIds, setDatabaseIds] = useState([]);
  const [texts, setTexts] = useState([]); // Agrega un estado para almacenar los textos

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await fetch("http://172.111.10.181:8000/text");
        const response = await fetch("http://localhost:8000/text");
        if (!response.ok) {
          throw new Error(`Error al obtener textos: ${response.statusText}`);
        }

        const data = await response.json();
        const ids = data.texts.map((text) => text._id);
        setDatabaseIds(ids);
        setTexts(data.texts); // Almacena los textos en el estado
      } catch (error) {
        console.error("Error al obtener textos: ", error);
      }
    };

    fetchData();
  }, []);

  const handleIdSelect = (id) => {
    setSelectedId(id);
  };

  return (
    <>
      <div className="App">
        {selectedId ? (
          // Modo de edición con el ID seleccionado
          <TextEditor selectedId={selectedId} texts={texts} />
        ) : (
          // Modo de selección de ID
          <IdSelector
            databaseIds={databaseIds}
            onIdSelect={handleIdSelect}
          />
        )}
      </div>
    </>
  );
};

export default App;
