import React, { useRef } from "react";
import "./../Styles/VistaBonita.css";
import CompromisoIcon from "./../Assets/png/i__Compromiso.png";
import AcuerdoIcon from "./../Assets/png/i__Acuerdo.png";
import DudaIcon from "./../Assets/png/i__Duda.png";
import DesacuerdoIcon from "./../Assets/png/i__Desacuerdo.png";
import ArrowDownIcon from "@atlaskit/icon/glyph/arrow-down";
import PageIcon from "@atlaskit/icon/glyph/page";
import jsPDF from "jspdf";

const IconoPredeterminado = "./../Assets/png/i__Acuerdo.png";

const VistaBonita = ({ selectedText }) => {
  const orderedTypes = ["Compromiso", "Acuerdo", "Duda", "Desacuerdo"];

  const getIconByTipo = (tipo) => {
    const iconMap = {
      compromiso: CompromisoIcon,
      Acuerdo: AcuerdoIcon,
      Duda: DudaIcon,
      Desacuerdo: DesacuerdoIcon,
    };

    return iconMap[tipo] || IconoPredeterminado;
  };

  // Utiliza useRef para crear la referencia mutable
  const contentRef = useRef(null);

  const renderGroupedParagraphs = () => {
    let totalCompromiso = 0;
    let totalDuda = 0;
    let totalAcuerdo = 0;
    let totalDesacuerdo = 0;
    let totalPositivo = 0;
    let totalNegativo = 0;
    let totalNeutral = 0;

    selectedText.forEach((tema) => {
      tema.elementos.forEach((elemento) => {
        switch (elemento.tipo) {
          case "Compromiso":
            totalCompromiso++;
            break;
          case "Duda":
            totalDuda++;
            break;
          case "Acuerdo":
            totalAcuerdo++;
            break;
          case "Desacuerdo":
            totalDesacuerdo++;
            break;
          default:
            break;
        }

        switch (elemento.sentimiento) {
          case "positivo":
            totalPositivo++;
            break;
          case "negativo":
            totalNegativo++;
            break;
          case "neutral":
            totalNeutral++;
            break;
          default:
            break;
        }
      });
    });

    const porcentajePositivo =
      (totalPositivo / (totalPositivo + totalNegativo + totalNeutral)) * 100;
    const porcentajeNegativo =
      (totalNegativo / (totalPositivo + totalNegativo + totalNeutral)) * 100;
    const porcentajeNeutral =
      (totalNeutral / (totalPositivo + totalNegativo + totalNeutral)) * 100;

    return (
      <div>
        <div className="summary-section">
          <h2 className="text-center">
            <PageIcon />
            Resumen del Informe
          </h2>
          <div className="d-flex justify-content-around">
            <div>
              <p className="mb-1">Compromisos: {totalCompromiso}</p>
              <p className="mb-1">Dudas: {totalDuda}</p>
              <p className="mb-1">Acuerdos: {totalAcuerdo}</p>
              <p>Desacuerdos: {totalDesacuerdo}</p>
            </div>
            <div>
              <p className="mb-1">
                Porcentaje Positivo: {porcentajePositivo.toFixed(2)}%
              </p>
              <p className="mb-1">
                Porcentaje Negativo: {porcentajeNegativo.toFixed(2)}%
              </p>
              <p>Porcentaje Neutral: {porcentajeNeutral.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        {orderedTypes.map((tipo) => {
          const elementosFiltrados = selectedText.flatMap((tema) =>
            tema.elementos.filter((elemento) => elemento.tipo === tipo)
          );

          return (
            <div key={tipo} className="grouped-paragraphs">
              <div className="Titulo-tipo">
                <h3>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h3>
                <img
                  src={getIconByTipo(tipo)}
                  alt={tipo}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
              <div className="elementos-list">
                {elementosFiltrados.map((elemento) => (
                  <div key={elemento._id} className="elemento-item">
                    <p>
                      <strong>{elemento.autor}</strong> : {elemento.contenido}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleTest = () => {
    console.log("Descargando PDF...");

    // Inicializar contadores para el resumen
    let totalCompromiso = 0;
    let totalDuda = 0;
    let totalAcuerdo = 0;
    let totalDesacuerdo = 0;

    // Contadores para el porcentaje de sentimientos
    let totalPositivo = 0;
    let totalNegativo = 0;
    let totalNeutral = 0;

    // Iterar sobre los temas y elementos
    selectedText.forEach((tema) => {
      tema.elementos.forEach((elemento) => {
        // Contar tipos para el resumen
        switch (elemento.tipo) {
          case "Compromiso":
            totalCompromiso++;
            break;
          case "Duda":
            totalDuda++;
            break;
          case "Acuerdo":
            totalAcuerdo++;
            break;
          case "Desacuerdo":
            totalDesacuerdo++;
            break;
          default:
            break;
        }
        // Contar sentimientos para el porcentaje
        switch (elemento.sentimiento) {
          case "positivo":
            totalPositivo++;
            break;
          case "negativo":
            totalNegativo++;
            break;
          case "neutral":
            totalNeutral++;
            break;
          default:
            break;
        }
      });
    });

    // Calcular porcentaje de sentimientos
    const porcentajePositivo =
      (totalPositivo / (totalPositivo + totalNegativo + totalNeutral)) * 100;
    const porcentajeNegativo =
      (totalNegativo / (totalPositivo + totalNegativo + totalNeutral)) * 100;
    const porcentajeNeutral =
      (totalNeutral / (totalPositivo + totalNegativo + totalNeutral)) * 100;

    // Crear un objeto jsPDF
    const pdf = new jsPDF();

    // Texto para agregar al documento PDF
    const texto = `
      Valores Sentimientos
      Positivo: ${porcentajePositivo.toFixed(2)}%
      Negativo: ${porcentajeNegativo.toFixed(2)}%
      Neutral: ${porcentajeNeutral.toFixed(2)}%

      Tipo
      Compromisos: ${totalCompromiso}
      Dudas: ${totalDuda}
      Acuerdos: ${totalAcuerdo}
      Desacuerdos: ${totalDesacuerdo}
    `;

    // Agregar el texto al documento PDF
    pdf.text(texto, 10, 10);

    // Descargar el PDF
    pdf.save("Resumen.pdf");

    console.log("PDF descargado ¿?");
  };

  return (
    <div>
      {/* Contenedor del contenido a descargar */}
      <div ref={contentRef} className="vista-bonita">
        {renderGroupedParagraphs()}
      </div>

      {/* Botón para descargar el PDF */}
      <div className="pdf-download-button" onClick={handleTest}>
        <ArrowDownIcon />
        Descargar PDF
      </div>
    </div>
  );
};

export default VistaBonita;
