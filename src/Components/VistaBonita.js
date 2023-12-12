// VistaBonita.jsx
import React from "react";
import "./../Styles/VistaBonita.css"; // Importa el archivo de estilos

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
            <h3>{group.tipo.charAt(0).toUpperCase() + group.tipo.slice(1)}</h3>
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
