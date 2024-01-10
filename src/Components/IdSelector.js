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
        //const response = await fetch("http://172.111.10.181:8000/text");
        const response = await fetch("http://localhost:8000/text");
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
    
  };
  const handleDelete = async (id, event) => {
    try {
      // Evita que el clic en el botón se propague al contenedor de la tarjeta
      event.stopPropagation();
  
      const response = await fetch(`http://localhost:8000/text/delete/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar texto: ${response.statusText}`);
      }
  
      // Actualiza el estado después de la eliminación
      setDatabaseIds(databaseIds.filter(existingId => existingId !== id));
      setTexts(texts.filter(text => text._id !== id));
  
      console.log("ID eliminado: ", id);
    } catch (error) {
      console.error("Error al eliminar texto: ", error);
      // Manejar el error, si es necesario
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await fetch("http://172.111.10.181:8000/text");
        const response = await fetch("http://localhost:8000/text");
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

  const handleNewDocument = async () => {
    try {
      const response = await fetch("http://localhost:8000/text/create", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error al crear el texto: ${response.statusText}`);
      }
      window.location.reload();

      const data = await response.json();
      const ids = [...databaseIds, data.text._id];
      setDatabaseIds(ids);
      setTexts([...texts, data.text]);
    } catch (error) {
      console.error("Error al crear el texto: ", error);
    }
  }

  return (
    <div>
      <h3>Selecciona un ID:</h3>

      <Button
        appearance="primary"
        onClick={handleNewDocument}
        style={{ marginBottom: "16px" }}
      >
        Crear nuevo documento
      </Button>

      {databaseIds.map((id) => (
        <Card
          key={id}
          style={{ marginBottom: "16px", cursor: "pointer" }}
          onClick={() => handleIdSelect(id)}
        >
          <Card.Body>
            <Card.Text>ID: {id}</Card.Text>
            <Button appearance="primary" onClick={() => onIdSelect(id)}>
              ¡Haz clic aquí para seleccionar!
            </Button>

            <Button
              appearance="danger"
              onClick={(event) => handleDelete(id, event)}
            >
              Eliminar
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default IdSelector;
