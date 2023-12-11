// IdSelector.js
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "@atlaskit/button";

const IdSelector = ({ onIdSelect }) => {
  const [databaseIds, setDatabaseIds] = useState([]);
  const [databaseError, setDatabaseError] = useState(false);
    const [texts, setTexts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://172.111.10.181:8000/text");
        if (!response.ok) {
          throw new Error(`Error al obtener textos: ${response.statusText}`);
        }

        const data = await response.json();
        const ids = data.texts.map((text) => text._id);
        setDatabaseIds(ids);
      } catch (error) {
        console.error("Error al obtener textos: ", error);
      }
    };

    fetchData();
  }, []);

  const handleIdSelect = (id) => {
    onIdSelect(id);
    console.log("ID seleccionado: ", id);
  };


useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://172.111.10.181:8000/text");
        if (!response.ok) {
          setDatabaseError(true);
          throw new Error(`Error al obtener textos: ${response.statusText}`);
        }
  
        const data = await response.json();
        setTexts(data.texts);
  
        // Resto del código...
      } catch (error) {
        console.error("Error al obtener textos: ", error);
        setDatabaseError(true);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div>
      <h3>Selecciona un ID:</h3>
      {databaseIds.map((id) => (
        <Card
          key={id}
          style={{ marginBottom: "16px", cursor: "pointer" }}
          onClick={() => handleIdSelect(id)}
        >
          <Card.Body>
            <Card.Text>ID: {id}</Card.Text>
            <Button
              appearance="primary"
              onClick={() => onIdSelect(id)}
            >
              ¡Haz clic aquí para seleccionar!
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default IdSelector;
