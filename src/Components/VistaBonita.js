import React, { useState, useEffect } from "react";
import "./../Styles/VistaBonita.css";
import CompromisoIcon from "./../Assets/png/i__Compromiso.png";
import AcuerdoIcon from "./../Assets/png/i__Acuerdo.png";
import DudaIcon from "./../Assets/png/i__Duda.png";
import DesacuerdoIcon from "./../Assets/png/i__Desacuerdo.png";

const VistaBonita = ({ selectedText }) => {
  const [paragraphs, setParagraphs] = useState([]);

  useEffect(() => {
    loadParagraphs();
  }, []);

  const loadParagraphs = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/text/${selectedText._id}`
      );
      const data = await response.json();
      setParagraphs(data.elementos);
    } catch (error) {
      handleDataError(error);
    }
  };

  const handleDataError = (error) => {
    console.error("Error loading data:", error);
    alert("Error loading data");
  };

  const getIconByTipo = (tipo) => {
    const iconMap = {
      compromiso: CompromisoIcon,
      acuerdo: AcuerdoIcon,
      duda: DudaIcon,
      desacuerdo: DesacuerdoIcon,
    };
    return iconMap[tipo] || null;
  };

  const renderGroupedParagraphs = () => {

    const orderedTypes = ["compromiso", "acuerdo", "duda", "desacuerdo"];
    
    return orderedTypes.map((tipo) => (
      <div key={tipo} className="grouped-paragraphs">
        <div className="Titulo-tipo">
          <h3>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h3>
          <img
            src={getIconByTipo(tipo)}
            alt={tipo}
            style={{ width: "20px", height: "20px" }} // Ajusta el tamaño del ícono
          />
        </div>
        
      </div>
    ));
  };

  return (
    <div className="vista-bonita">
      {renderGroupedParagraphs()}
    </div>
  );
};

export default VistaBonita;
