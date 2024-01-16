import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "@atlaskit/button";

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

    // Establece un intervalo para volver a cargar los datos cada cierto tiempo
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000); // Cada 30 segundos

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [newDocumentId]);

  const handleIdSelect = (id) => {
    onIdSelect(id);
  };

  const handleDelete = async (id, event) => {
    try {
      event.stopPropagation();

      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar texto: ${response.statusText}`);
      }

      setDatabaseIds((existingIds) => existingIds.filter((existingId) => existingId !== id));
      setTexts((existingTexts) => existingTexts.filter((text) => text._id !== id));

      console.log("ID eliminado: ", id);
    } catch (error) {
      console.error("Error al eliminar texto: ", error);
      // Manejar el error, si es necesario
    }
  };

  const handleNewDocument = async () => {
    try {
      const newDocumentData = {
        temas: [
          // Contenido del nuevo documento
          {
            tema: "1",
            elementos: [
              {
                contenido: "Contenido por defecto",
                alineacion: "left",
                bold: false,
                italic: false,
                underline: false,
                tipo: "Compromiso",
                autor: "Pipet",
                sentimiento: "positivo",
                orden: 1,
                date: new Date(),
              },
            ],
          },
        ],
      };

      const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDocumentData),
      });

      if (!response.ok) {
        throw new Error(`Error al crear el documento: ${response.statusText}`);
      }

      const createdDocument = await response.json();

      // Establece el nuevo ID para desencadenar la recarga automática
      setNewDocumentId(createdDocument._id);

    } catch (error) {
      console.error("Error al crear el documento: ", error);
      // Manejar el error, si es necesario
    }
  };

  return (
    <div>
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
        databaseIds.map((id) => (
          <Card
            key={id}
            style={{ marginBottom: "16px", cursor: "pointer" }}
            onClick={() => handleIdSelect(id)}
          >
            <Card.Body>
              <Card.Text>ID: {id}</Card.Text>
              <Button appearance="primary" onClick={() => handleIdSelect(id)}>
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
        ))
      )}
    </div>
  );
};

export default IdSelector;
