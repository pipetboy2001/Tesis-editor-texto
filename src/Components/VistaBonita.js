import React, { useRef, useEffect, useState } from "react";
import "./../Styles/VistaBonita.css";
import CompromisoIcon from "./../Assets/png/i__Compromiso.png";
import AcuerdoIcon from "./../Assets/png/i__Acuerdo.png";
import DudaIcon from "./../Assets/png/i__Duda.png";
import DesacuerdoIcon from "./../Assets/png/i__Desacuerdo.png";
import ArrowDownIcon from "@atlaskit/icon/glyph/arrow-down";
import PageIcon from "@atlaskit/icon/glyph/page";
import jsPDF from "jspdf";
const IconoPredeterminado = "./../Assets/png/i__Acuerdo.png";
const VistaBonita = ({ selectedText, selectedId }) => {
  const orderedTypes = ["Compromiso", "Acuerdo", "Duda", "Desacuerdo"];

  /* // obtener el id del texto
  const idTexto = selectedId;
  // Obtener los IDs de los temas
  const temasIds = selectedText.map((tema) => tema._id);
  console.log("temasIds", temasIds);
  // Obtener las cadenas formateadas con la estructura requerida
  const temasUrls = selectedText.map(
    (tema) => `http://localhost:8000/text/temas/${idTexto}/${tema._id}`
  );
  console.log("temasUrls", temasUrls);
  // Obtener el id de cada elemento de un tema
  const elementosIds = selectedText.map((tema) =>
    tema.elementos.map((elemento) => elemento._id)
  );
  console.log("elementosIds", elementosIds);
  // Obtener las cadenas formateadas con la estructura requerida
  const elementosUrls = selectedText.map((tema) =>
    tema.elementos.map(
      (elemento) =>
        `http://localhost:8000/text/temas/${idTexto}/${tema._id}/${elemento._id}`
    )
  );
  console.log("elementosUrls", elementosUrls); */

  const getIconByTipo = (tipo) => {
    const iconMap = {
      compromiso: CompromisoIcon,
      acuerdo: AcuerdoIcon,
      duda: DudaIcon,
      desacuerdo: DesacuerdoIcon,
    };

    return iconMap[tipo.toLowerCase()] || IconoPredeterminado;
  };

  const contentRef = useRef(null);

  const renderGroupedParagraphs = () => {
    const {
      totalCompromiso,
      totalDuda,
      totalAcuerdo,
      totalDesacuerdo,
      porcentajePositivo,
      porcentajeNegativo,
      porcentajeNeutral,
    } = calculateSummary(selectedText);

    return (
      <>
        <div className="summary-section">
          <h2 className="text-center">
            <PageIcon />
            Resumen del Informe
          </h2>
          <div className="d-flex justify-content-around">
            <div>
              {renderSummaryItem("Compromisos", totalCompromiso)}
              {renderSummaryItem("Dudas", totalDuda)}
              {renderSummaryItem("Acuerdos", totalAcuerdo)}
              {renderSummaryItem("Desacuerdos", totalDesacuerdo)}
            </div>
            <div>
              {renderSummaryItem("Porcentaje Positivo", porcentajePositivo)}
              {renderSummaryItem("Porcentaje Negativo", porcentajeNegativo)}
              {renderSummaryItem("Porcentaje Neutral", porcentajeNeutral)}
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
                <h3>{capitalizeFirstLetter(tipo)}</h3>
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
      </>
    );
  };

  const renderSummaryItem = (label, value) => (
    <p className="mb-1">
      {label}: {typeof value === "number" ? formatPercentage(value) : value}
    </p>
  );

  const formatPercentage = (percentage) => {
    return `${Math.round(percentage * 100) / 100}`;
  };

  const calculateSummary = (selectedText) => {
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

    const totalSentimientos = totalPositivo + totalNegativo + totalNeutral;

    const porcentajePositivo =
      Math.round((totalPositivo / totalSentimientos) * 10000) / 100;
    const porcentajeNegativo =
      Math.round((totalNegativo / totalSentimientos) * 10000) / 100;
    const porcentajeNeutral =
      Math.round((totalNeutral / totalSentimientos) * 10000) / 100;

    return {
      totalCompromiso,
      totalDuda,
      totalAcuerdo,
      totalDesacuerdo,
      totalPositivo,
      totalNegativo,
      totalNeutral,
      porcentajePositivo,
      porcentajeNegativo,
      porcentajeNeutral,
    };
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handlePdfDownload = () => {
    console.log("Descargando PDF...");

    const {
      totalCompromiso,
      totalDuda,
      totalAcuerdo,
      totalDesacuerdo,
      porcentajePositivo,
      porcentajeNegativo,
      porcentajeNeutral,
    } = calculateSummary(selectedText);

    const pdf = new jsPDF();

    pdf.setFont("helvetica");
    pdf.setFontSize(12);

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

    pdf.text(texto, 10, 10);

    pdf.save("Resumen.pdf");

    console.log("PDF descargado ¿?");
  };

  return (
    <div>
      <div ref={contentRef} className="vista-bonita">
        {renderGroupedParagraphs()}
      </div>

      <div className="pdf-download-button" onClick={handlePdfDownload}>
        <ArrowDownIcon />
        Descargar PDF
      </div>
    </div>
  );
};

export default VistaBonita;
