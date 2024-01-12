import React, { useState, useEffect } from "react";
import "./../Styles/VistaBonita.css";
import CompromisoIcon from "./../Assets/png/i__Compromiso.png";
import AcuerdoIcon from "./../Assets/png/i__Acuerdo.png";
import DudaIcon from "./../Assets/png/i__Duda.png";
import DesacuerdoIcon from "./../Assets/png/i__Desacuerdo.png";

const VistaBonita = ({ selectedText }) => {
  const [paragraphs, setParagraphs] = useState([]);
  const [viewMode, setViewMode] = useState("orden");
  const [originalParagraphs, setOriginalParagraphs] = useState([]);
  const [autoSave, setAutoSave] = useState(false);

  useEffect(() => {
    loadOriginalData();
  }, []);

  useEffect(() => {
    if (autoSave) {
      saveToServer(selectedText._id, paragraphs);
      setAutoSave(false);
    }
  }, [autoSave, selectedText, paragraphs]);

  useEffect(() => {
    if (viewMode === "orden") {
      orderParagraphs();
    } else {
      setParagraphs(originalParagraphs);
    }
  }, [viewMode, originalParagraphs]);

  const orderParagraphs = () => {
    const ordered = [...originalParagraphs].sort((a, b) => a.orden - b.orden);
    setParagraphs(ordered);
  };

  const loadOriginalData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/text/${selectedText._id}`
      );
      const data = await response.json();
      setOriginalParagraphs(data.elementos);
      setParagraphs(data.elementos);
      orderParagraphs();
    } catch (error) {
      handleDataError(error);
    }
  };

  const handleDataError = (error) => {
    console.error("Error loading data:", error);
    alert("Error loading data");
  };

  const saveToServer = async (selectedTextId, updatedContents) => {
    try {
      const response = await fetch(
        `http://localhost:8000/text/update/${selectedTextId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ elementos: updatedContents }),
        }
      );

      if (response.ok) {
        console.log("Successfully saved to the server!");
      } else {
        handleServerSaveError();
      }
    } catch (error) {
      handleServerRequestError(error);
    }
  };

  const handleServerSaveError = () => {
    console.error("Error saving to the server");
  };

  const handleServerRequestError = (error) => {
    console.error("Error making server request:", error);
    alert("Error making server request");
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === "tipo") {
      setParagraphs(originalParagraphs);
    } else if (mode === "orden") {
      orderParagraphs();
    }
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

  const getPercentage = (count, total) => {
    return total === 0 ? 0 : ((count / total) * 100).toFixed(2);
  };

  const countElements = () => {
    const totalElements = paragraphs.length;
    const positiveCount = countParagraphsByType("acuerdo");
    const negativeCount = countParagraphsByType("desacuerdo");
    const neutralCount = countParagraphsByType("compromiso");

    const positivePercentage = getPercentage(positiveCount, totalElements);
    const negativePercentage = getPercentage(negativeCount, totalElements);
    const neutralPercentage = getPercentage(neutralCount, totalElements);

    const commitmentsCount = countParagraphsByType("compromiso");
    const doubtsCount = countParagraphsByType("duda");
    const disagreementsCount = countParagraphsByType("desacuerdo");
    const agreementsCount = countParagraphsByType("acuerdo");

    return {
      positivePercentage,
      negativePercentage,
      neutralPercentage,
      commitmentsCount,
      doubtsCount,
      disagreementsCount,
      agreementsCount,
    };
  };

  const countParagraphsByType = (type) => {
    return paragraphs.filter((p) => p.tipo === type).length;
  };

  const renderSummary = () => {
    const {
      positivePercentage,
      negativePercentage,
      neutralPercentage,
      commitmentsCount,
      doubtsCount,
      disagreementsCount,
      agreementsCount,
    } = countElements();

    return (
      <div className="summary-section">
        <h2 className="text-center">Resumen del Informe</h2>
        <div className="d-flex justify-content-around">
          <div>
            <p className="mb-1">Positivo: {positivePercentage}%</p>
            <p className="mb-1">Negativo: {negativePercentage}%</p>
            <p>Neutro: {neutralPercentage}%</p>
          </div>
          <div>
            <p className="mb-1">Compromisos: {commitmentsCount}</p>
            <p className="mb-1">Dudas: {doubtsCount}</p>
            <p className="mb-1">Desacuerdos: {disagreementsCount}</p>
            <p>Acuerdos: {agreementsCount}</p>
          </div>
        </div>
      </div>
    );
  };

  const groupedParagraphs = paragraphs.reduce((acc, paragraph) => {
    if (!acc[paragraph.tipo]) {
      acc[paragraph.tipo] = [];
    }
    acc[paragraph.tipo].push(paragraph);
    return acc;
  }, {});

  const orderedTypes = ["compromiso", "acuerdo", "duda", "desacuerdo"];
  const orderedGroups = orderedTypes.map((tipo) => ({
    tipo,
    paragraphs: groupedParagraphs[tipo] || [],
  }));

  return (
    <div className="vista-bonita">
      <div className="view-toggle">
        <button onClick={() => handleViewModeChange("orden")}>Minuta</button>
        <button onClick={() => handleViewModeChange("tipo")}>Informe</button>
      </div>
      {viewMode === "tipo" && renderSummary()}{" "}
      {/* Display summary only in "Informe" mode */}
      <div className="paragraph-list">
        {viewMode === "orden" ? (
          paragraphs.map((paragraph, index) => (
            <div key={index} className="formatted-paragraph">
              <span className="paragraph-order">{paragraph.orden}.- </span>
              <span className="paragraph-author">{paragraph.autor}</span>
              <span className="paragraph-content">{paragraph.contenido}</span>
            </div>
          ))
        ) : (
          <div className="paragraph-list">
            {orderedGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="grouped-paragraphs">
                <div className="Titulo-tipo">
                  <h3>
                    {group.tipo.charAt(0).toUpperCase() + group.tipo.slice(1)}
                  </h3>
                  <img
                    src={getIconByTipo(group.tipo)}
                    alt={group.tipo}
                    style={{ width: "20px", height: "20px" }} // Adjust the size of the icon
                  />
                </div>
                {group.paragraphs.map((paragraph, index) => (
                  <div key={index} className="formatted-paragraph">
                    <span className="paragraph-author">{paragraph.autor}</span>
                    <span className="paragraph-content">
                      {paragraph.contenido}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VistaBonita;
