import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "@atlaskit/button";
import './../Styles/IdSelector.css';

const API_URL = "http://localhost:8000/text";

const IdSelector = ({ onIdSelect }) => {
  const [databaseIds, setDatabaseIds] = useState([]);
  const [texts, setTexts] = useState([]);
  const [databaseError, setDatabaseError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newDocumentId, setNewDocumentId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        setDatabaseError(true);
        throw new Error(`Error al obtener textos: ${response.statusText}`);
      }

      const data = await response.json();
      setTexts(data.texts);
      setDatabaseIds(data.texts.map((text) => text._id));
    } catch (error) {
      console.error("Error al obtener textos: ", error);
      setDatabaseError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 20000);

    return () => clearInterval(intervalId);
  }, [newDocumentId]);

  const handleIdSelect = (id) => {
    onIdSelect(id);
  };

  const handleDelete = async (databaseId, event) => {
    try {
      event.stopPropagation();

      const response = await fetch(`${API_URL}/delete/${databaseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar texto: ${response.statusText}`);
      }

      setDatabaseIds((existingIds) => existingIds.filter((existingId) => existingId !== databaseId));
      setTexts((existingTexts) => existingTexts.filter((text) => text._id !== databaseId));

      console.log("ID eliminado: ", databaseId);
    } catch (error) {
      console.error("Error al eliminar texto: ", error);
    }
  };

  const handleNewDocument = () => {
    // Muestra el modal para ingresar los detalles del tema
    const themeDetails = window.prompt("Ingrese los detalles del tema (nombre, autor, sentimiento, tipo, contenido):");
    
    if (!themeDetails) {
      return; // Sal del método si el usuario cancela
    }
  
    // Divide los detalles ingresados por el usuario
    const [themeName, author, sentiment, type,contenido] = themeDetails.split(",").map(detail => detail.trim());
  
    // Verifica que se hayan proporcionado todos los detalles necesarios
    if (!themeName || !author || !sentiment || !type || !contenido) {
      console.error("Faltan detalles del tema.");
      return;
    }
  
    const newDocumentData = {
      temas: [
        {
          tema: themeName,
          ordenTema: 1,
          elementos: [
            {
              contenido: contenido,
              autor: author,
              sentimiento: sentiment,
              tipo: type,
              orden: 1,
              date: new Date(),
            },
          ],
        },
      ],
    };
  
    // Envía la solicitud POST para crear el nuevo documento
    fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDocumentData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al crear el documento: ${response.statusText}`);
      }
      return response.json();
    })
    .then(createdDocument => {
      setNewDocumentId(createdDocument._id);
    })
    .catch(error => {
      console.error("Error al crear el documento: ", error);
    });
  };
  

  return (
    <div className="id-selector-container">
      <h3>Selecciona un ID de reunión:</h3>

      <Button
        appearance="primary"
        onClick={handleNewDocument}
        style={{ marginBottom: "16px" }}
      >
        Crear nueva reunión
      </Button>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        databaseIds.map((databaseId) => (
          <Card
            key={databaseId}
            className="id-card"
            onClick={() => handleIdSelect(databaseId)}
          >
            <Card.Body>
              <Card.Text>ID: {databaseId}</Card.Text>
              <Button
                appearance="primary"
                onClick={() => handleIdSelect(databaseId)}
              >
                Seleccionar
              </Button>

              <Button
                appearance="danger"
                onClick={(event) => handleDelete(databaseId, event)}
              >
                Eliminar
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default IdSelector;
