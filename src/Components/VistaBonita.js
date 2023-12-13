// VistaBonita.jsx
import React from "react";
import "./../Styles/VistaBonita.css"; // Importa el archivo de estilos

/* Añadir los iconos png */
import CompromisoIcon from "./../Assets/png/i__Compromiso.png";
import AcuerdoIcon from "./../Assets/png/i__Acuerdo.png";
import DudaIcon from "./../Assets/png/i__Duda.png";
import DesacuerdoIcon from "./../Assets/png/i__Desacuerdo.png";

const VistaBonita = ({ paragraphs }) => {
  // Agrupar párrafos por tipo
  const groupedParagraphs = paragraphs.reduce((acc, paragraph) => {
    if (!acc[paragraph.tipo]) {
      acc[paragraph.tipo] = [];
    }
    acc[paragraph.tipo].push(paragraph);
    return acc;
  }, {});

  // Ordenar grupos por un orden específico (Compromiso, Acuerdo, Duda, Desacuerdo)
  const orderedTypes = ["compromiso", "acuerdo", "duda", "desacuerdo"];
  const orderedGroups = orderedTypes.map((tipo) => ({
    tipo,
    paragraphs: groupedParagraphs[tipo] || [],
  }));

  return (
    <div className="vista-bonita">
      <div className="paragraph-list">
        {orderedGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="grouped-paragraphs">
            <div className="Titulo-tipo">
            <h3>{group.tipo.charAt(0).toUpperCase() + group.tipo.slice(1)}</h3>
            <img
                    src={
                      group.tipo === "compromiso"
                        ? CompromisoIcon
                        : group.tipo === "acuerdo"
                        ? AcuerdoIcon
                        : group.tipo === "duda"
                        ? DudaIcon
                        : DesacuerdoIcon
                    }
                    alt={group.tipo}
                    style={{ width: '20px', height: '20px' }} // Ajusta el tamaño del icono
                  />
                  </div>
            {group.paragraphs.map((paragraph, index) => (
              <div key={index} className="formatted-paragraph">
                <span className="paragraph-author">{paragraph.autor}</span>
                <span className="paragraph-content">{paragraph.contenido}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VistaBonita;
