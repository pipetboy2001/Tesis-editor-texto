import React, { useState, useEffect } from "react";
import IdSelector from "./Components/IdSelector";
import Testing from "./Components/Testing";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [databaseIds, setDatabaseIds] = useState([]);
  const [texts, setTexts] = useState([]); 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/text");
        if (!response.ok) {
          throw new Error(`Error al obtener textos: ${response.statusText}`);
        }

        const data = await response.json();
        const ids = data.texts.map((text) => text._id);
        setDatabaseIds(ids);
        setTexts(data.texts);
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
          <DndProvider backend={HTML5Backend}>
            <Testing
              selectedId={selectedId}
              texts={texts}
              setTexts={setTexts}
            />
          </DndProvider>
          
        ) : (
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
