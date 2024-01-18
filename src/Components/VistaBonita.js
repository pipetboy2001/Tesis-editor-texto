import React from "react";
import "./../Styles/VistaBonita.css";
import CompromisoIcon from "./../Assets/png/i__Compromiso.png";
import AcuerdoIcon from "./../Assets/png/i__Acuerdo.png";
import DudaIcon from "./../Assets/png/i__Duda.png";
import DesacuerdoIcon from "./../Assets/png/i__Desacuerdo.png";

const IconoPredeterminado = "ruta/al/icono-predeterminado.png";

const VistaBonita = ({ selectedText }) => {
  const orderedTypes = ["compromiso", "Acuerdo", "Duda", "Desacuerdo"];

  const getIconByTipo = (tipo) => {
    const iconMap = {
      compromiso: CompromisoIcon,
      Acuerdo: AcuerdoIcon,
      Duda: DudaIcon,
      Desacuerdo: DesacuerdoIcon,
    };

    return iconMap[tipo] || IconoPredeterminado;
  };

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
          case "compromiso":
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
          case "positive":
            totalPositivo++;
            break;
          case "negative":
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

    const porcentajePositivo = (totalPositivo / (totalPositivo + totalNegativo + totalNeutral)) * 100;
    const porcentajeNegativo = (totalNegativo / (totalPositivo + totalNegativo + totalNeutral)) * 100;
    const porcentajeNeutral = (totalNeutral / (totalPositivo + totalNegativo + totalNeutral)) * 100;

    return (
      <div>
        <div className="summary-section">
          <h2 className="text-center">Resumen del Informe</h2>
          <div className="d-flex justify-content-around">
            <div>
              <p className="mb-1">Compromisos: {totalCompromiso}</p>
              <p className="mb-1">Dudas: {totalDuda}</p>
              <p className="mb-1">Acuerdos: {totalAcuerdo}</p>
              <p>Desacuerdos: {totalDesacuerdo}</p>
            </div>
            <div>
              <p className="mb-1">Porcentaje Positivo: {porcentajePositivo.toFixed(2)}%</p>
              <p className="mb-1">Porcentaje Negativo: {porcentajeNegativo.toFixed(2)}%</p>
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

  return <div className="vista-bonita">{renderGroupedParagraphs()}</div>;
};

export default VistaBonita;
