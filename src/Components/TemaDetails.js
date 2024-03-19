import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import AddCircleIcon from "@atlaskit/icon/glyph/add";
import EditIcon from "@atlaskit/icon/glyph/edit";
import EditModal from "./EditModal";
import "./../Styles/TemaDetails.css";

const BASE_URL = "http://localhost:8000";

const TemaDetails = ({ tema, selectedText }) => {
  const [elementos, setElementos] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [allowDrag, setAllowDrag] = useState(false);
  const idText = selectedText._id;
  const idTema = tema._id;
  const [editingElemento, setEditingElemento] = useState(null);
  const [editOrderMode, setEditOrderMode] = useState(false); // Estado para el modo de edición de orden

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setAllowDrag(false);
  };

  useEffect(() => {
    let intervalId; // Declarar el intervalId fuera del alcance de useEffect
    
    const fetchData = async () => {
      const endpoint = `${BASE_URL}/text/temas/${idText}/${idTema}`;
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.tema && data.tema.elementos) {
          setElementos(data.tema.elementos);
        } else {
          console.error("La propiedad 'tema' o 'elementos' es undefined en la respuesta del servidor.");
        }
      } catch (error) {
        console.error("Error al obtener datos:", error.message);
      }
    };
    
    const startDataFetching = () => {
      fetchData(); // Llamar a fetchData inmediatamente al iniciar
      intervalId = setInterval(fetchData, 1000); // Establecer intervalo para llamar a fetchData cada 1000ms
    };
    
    const stopDataFetching = () => {
      clearInterval(intervalId); // Detener la actualización automática de datos
    };
  
    if (!editOrderMode) {
      startDataFetching(); // Iniciar la actualización automática de datos solo si no estás en modo de edición de orden
    } else {
      stopDataFetching(); // Detener la actualización automática de datos si estás en modo de edición de orden
    }
  
    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  }, [idText, idTema, editOrderMode]); // Dependencia editOrderMode agregada al arreglo de dependencias
  

  const handleDeleteElement = async (elementId) => {
    try {
      const response = await fetch(`${BASE_URL}/text/temas/${idText}/${idTema}/${elementId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar el elemento: ${response.statusText}`);
      }
      const deletedElementIndex = elementos.findIndex(elemento => elemento._id === elementId);
      if (deletedElementIndex !== -1) {
        const updatedElementos = [...elementos];
        updatedElementos.splice(deletedElementIndex, 1); // Elimina el elemento del array
        // Actualiza los órdenes de los elementos restantes
        updatedElementos.forEach((elemento, index) => {
          elemento.orden = index + 1;
        });
        setElementos(updatedElementos);
  
        // Envía una solicitud para actualizar los valores de orden en la base de datos
        await Promise.all(updatedElementos.map(async (elemento) => {
          await fetch(`${BASE_URL}/text/temas/${idText}/${idTema}/${elemento._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orden: elemento.orden }),
          });
        }));
      }
    } catch (error) {
      console.error("Error al eliminar el elemento:", error.message);
    }
  };
  
  const handleEditElement = (elemento) => {
    setEditingElemento(elemento); // Al hacer clic en "Editar", establecemos el elemento a editar en el estado
    setShowEditModal(true); // Abrimos el modal de edición
  };

  const handleSaveElement = async (editedElemento) => {
    try {
      const response = await fetch(`${BASE_URL}/text/temas/${idText}/${idTema}/${editedElemento._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedElemento),
      });
      if (!response.ok) {
        throw new Error(`Error al guardar el elemento editado: ${response.statusText}`);
      }
      const updatedElemento = await response.json();
      const updatedElementos = elementos.map((element) =>
        element._id === updatedElemento._id ? updatedElemento : element
      );
      setElementos(updatedElementos);
      console.log("Elemento editado:", updatedElemento);
    } catch (error) {
      console.error("Error al guardar el elemento editado:", error.message);
    } finally {
      setEditingElemento(null); // Limpiamos el estado de edición después de guardar los cambios
      setShowEditModal(false); // Cerramos el modal de edición
    }
  };

  const updateElementosAfterDelete = (deletedElementId) => {
    setElementos(elementos.filter((elemento) => elemento._id !== deletedElementId));
  };

  const handleAddElement = async () => {
    try {
      const response = await fetch(`${BASE_URL}/text/temas/${idText}/${idTema}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido: "Texto por defecto", tipo: "Duda", alineacion: "left", bold: false, italic: true, underline: false, autor: "Pipet", sentimiento: "positivo", orden: elementos.length + 1, date: new Date() }),
      });
      if (!response.ok) {
        throw new Error(`Error al agregar el elemento: ${response.statusText}`);
      }
      const addedElemento = await response.json();
      setElementos([...elementos, addedElemento]);
      console.log("Elemento agregado", addedElemento);
    } catch (error) {
      console.error("Error al agregar el elemento:", error.message);
    }
  };

  const handleDeleteTema = async () => {
    try {
      const response = await fetch(`${BASE_URL}/text/temas/${idText}/${idTema}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar el tema: ${response.statusText}`);
      }
      console.log("Tema eliminado");
      setElementos([]);
    } catch (error) {
      console.error("Error al eliminar el tema:", error.message);
    }
  };

  const handleEditOrder = () => {
    setEditOrderMode(true); // Activar modo de edición de orden
  };

  const handleSaveOrder = async () => {
    setEditOrderMode(false); // Desactivar modo de edición de orden
    try {
      // Envía una solicitud para actualizar los valores de orden en la base de datos
      await Promise.all(elementos.map(async (elemento) => {
        await fetch(`${BASE_URL}/text/temas/${idText}/${idTema}/${elemento._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orden: elemento.orden }),
        });
      }));
    } catch (error) {
      console.error("Error al guardar el orden de los elementos:", error.message);
    }
  };

  const handleFormatDate = (dateString) => {
    const date = new Date(dateString);
    // Formatea la fecha como "dd/mm/yyyy hh:mm:ss"
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return formattedDate;
  };

  return (
    <div className="tema-details-container">
      <div className="tema-container row">
        <div className="col-md-6">
          <h3 style={{ color: "#0052CC" }}>Tema {tema.id_tema} {tema.tema}</h3>
        </div>
        <div className="col-md-6">
          <Button variant="outline-primary" className="edit-button" onClick={handleAddElement} style={{ backgroundColor: "#0052CC", borderColor: "#0052CC" }}>
            <AddCircleIcon size="small" /> Añadir Elemento
          </Button>
          <Button variant="danger" className="delete-button" onClick={handleDeleteTema} style={{ backgroundColor: "#ff5630", borderColor: "#ff5630" }}>
            <TrashIcon size="small" /> Borrar Tema
          </Button>
          {!editOrderMode && (
            <Button variant="primary" className="edit-order-button" onClick={handleEditOrder}>Editar Orden</Button>
          )}
          {editOrderMode && (
            <Button variant="success" className="save-order-button" onClick={handleSaveOrder}>Guardar Orden</Button>
          )}
        </div>
      </div>
      <div className="tema-informacion">
        {elementos.map((elemento, index) => (
          <div key={elemento._id} className="elemento-container">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="d-flex align-items-center"> {/* Contenedor para alinear horizontalmente los elementos */}
                  <div className="orden-circle mr-3">{editOrderMode ? <input type="number" value={elemento.orden} onChange={(e) => {
                    const newOrden = parseInt(e.target.value);
                    const updatedElementos = [...elementos];
                    updatedElementos[index].orden = newOrden;
                    setElementos(updatedElementos);
                  }} /> : elemento.orden}</div> {/* Coloca el valor dentro del círculo */}
                  <Button variant="primary" className="edit-button mr-3" onClick={() => handleEditElement(elemento)}>
                    <EditIcon size="small" /> Editar
                  </Button>
                  <Button variant="danger" className="delete-button" onClick={() => handleDeleteElement(elemento._id)}>
                    <TrashIcon size="small" /> Eliminar
                  </Button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <p><strong>Autor: </strong>{elemento.autor}</p>
                <p><strong>Tipo: </strong>{elemento.tipo}</p>
              </div>
              <div className="col-md-6 col-sm-12">
                <p><strong>Sentimiento: </strong>{elemento.sentimiento}</p>
                <p><strong>Fecha: </strong>{handleFormatDate(elemento.date)}</p>
              </div>
            </div>
            <div className="row contenido-section">
              <div className="col-md-12">
                <p>{elemento.contenido}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showEditModal && (
        <EditModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          elemento={editingElemento} // Pasar editingElemento en lugar de elemento
          onSave={handleSaveElement} // Pasar handleSaveElement directamente
        />
      )}
    </div>
  );
};

export default TemaDetails;
