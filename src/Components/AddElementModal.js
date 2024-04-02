import React, { useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';

const AddElementModal = ({ show, handleClose, handleAddElement, temaNombre }) => {
    const [newElement, setNewElement] = useState({
        contenido: "",
        tipo: "acuerdo",
        autor: "",
        sentimiento: "positivo",
        date: new Date().toISOString(),

    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewElement({
            ...newElement,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddElement(newElement);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{`Elemento dialógico añadiéndose al tema: ${temaNombre}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTipo">
                        <Form.Label>Seleccionar tipo de elemento dialógico</Form.Label>
                        <Form.Control
                            as="select"
                            name="tipo"
                            value={newElement.tipo}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Acuerdo">Acuerdo</option>
                            <option value="Duda">Duda</option>
                            <option value="Compromiso">Compromiso</option>
                            <option value="Texto Libre">Texto libre</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formAutor">
                        <Form.Label>Nombre del responsable</Form.Label>
                        <Form.Control
                            type="text"
                            name="autor"
                            placeholder="Ingrese el nombre del responsable"
                            value={newElement.autor}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formContenido">
                        <Form.Label>Escribir descripción del elemento dialógico</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="contenido"
                            placeholder="Escribir descripción del elemento dialógico"
                            value={newElement.contenido}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formSentimiento">
                        <Form.Label>Sentimiento</Form.Label>
                        <Form.Control
                            as="select"
                            name="sentimiento"
                            value={newElement.sentimiento}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Positivo">Positivo</option>
                            <option value="Negativo">Negativo</option>
                        </Form.Control>
                    </Form.Group>
                    
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        Crear elemento dialogico
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddElementModal;
