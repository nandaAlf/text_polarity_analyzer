import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import mammoth from "mammoth";
import { FaUpload } from "react-icons/fa";
import { FaSistrix } from "react-icons/fa";


function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const [averagePolarity, setAveragePolarity] = useState(null);

  const [coloredWords, setColoredWords] = useState([]);
  const [results, setResults] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type === "text/plain") {
      // Leer archivos .txt
      const reader = new FileReader();
      reader.onload = (e) => setText(e.target.result);
      reader.readAsText(file);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Leer archivos .docx
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        setText(value);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Por favor, selecciona un archivo .txt o .docx.");
    }
  };
  const handleAnalyze = () => {
    // Conéctate al servidor WebSocket de Java
    const socket = new WebSocket("ws://localhost:8081");

    socket.onopen = () => {
      console.log("Conexión establecida con el servidor.");
      socket.send(text); // Enviar el texto al servidor
    };

    socket.onmessage = (event) => {
      // console.log(event);
      const response = JSON.parse(event.data); // Recibir resultados como JSON
      // setColoredWords(results); // Guardar los resultados
      setColoredWords(response.results || []); // Actualizar palabras coloreadas
      setAveragePolarity(response.averagePolarity || 0); // Actualizar polaridad promedio
      // console.log(coloredWords)
      console.log(response.results);
    };

    socket.onclose = () => {
      console.log("Conexión cerrada.");
    };

    socket.onerror = (error) => {
      console.error("Error en el socket:", error);
    };
  };

  return (
    <div
      style={{
        padding: "10px",
        margin: "20px 10px",
        fontFamily: "Arial, sans-serif",
        // backgroundColor:"red",
        width: "100%", // Ocupa todo el ancho de la pantalla
        height: "100vh", // Ocupa toda la altura de la ventana
        display: "flex",
        flexDirection: "column", // Asegura que el contenido esté en columnas
        alignItems: "center", // Centra el contenido horizontalmente
        justifyContent: "flex-start", // Centra el contenido verticalmente
        boxSizing: "border-box", // Asegura que padding no afecte el tamaño}}>
      }}
    >
      <h1 style={{fontFamily:"Consolas" , backgroundColor: "rgba(26, 26, 26, 0.514)"}}>Text Polarity Analyzer</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
          justifyContent: "center",
          // backgroundColor: "#f8f9fa",
          width: "100%",
          height: "40%",
        }}
      >
        {/* Div para entrada de texto */}
        <div
          style={{
            flex: "1",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            minHeight: "150px",
            // fontFamily: "Arial, sans-serif",
            backgroundColor: "#242429",
            height: "90%",
          }}
        >
          <textarea
            rows="7"
            // cols="50"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Input your text here..."
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              fontSize: "16px",
              padding: "3px",
              resize: "none",
              outline: "none",
              background: "inherit",
            }}
          />
        </div>

        {/* Div para texto analizado */}
        <div
          style={{
            flex: "1",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            minHeight: "150px",
            fontFamily: "Consolas",
            whiteSpace: "pre-wrap", // Mantener los saltos de línea
            backgroundColor: "#242429",
            overflowY: "auto", // Agregar scroll si el contenido excede el área
            height: "90%",
            textAlign: "left",
            wordWrap: "break-word",
          }}
        >
          {coloredWords.map((item, index) => (
            <span
              key={index}
              style={{
                color: item.color,
                marginRight: "5px",
                fontSize: "16px",
                // fontWeight: "bold",
              }}
            >
              {item.word}
            </span>
          ))}
        </div>
      </div>
      <br />

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          justifyContent: "space-between",
          // backgroundColor: "#f8f9fa",
          // padding:"20px"/\,
          width: "100%",
          // height: "40%",
          marginRight: "",
          marginTop: "30px",
        }}
      >
        <div style={{display:"flex" ,gap:"20px"}}>
          {/*Cargar archivo*/}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              // marginBottom: "20px",
             
            }}
          >
            {/* Input de archivo oculto */}
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              id="fileInput"
            />

            {/* Botón con ícono para abrir el input de archivo */}
            <label
              htmlFor="fileInput"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                // backgroundColor: "#007BFF",
                 backgroundColor:"rgba(26, 26, 26, 0.514)",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
                border: "1px solid #ccc",
              }}
            >
              <FaUpload /> {/* Ícono de subir archivo */}
              Load file
            </label>
          </div>
          {/*Analizar*/}
          <div className="myButton"
            style={{
              padding: "",
              boxSizing: "border-box",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <button 
              onClick={handleAnalyze}
              style={{
                padding: "13px 20px",
                fontSize: "16px",
                backgroundColor: "#007BFF",
                display:"flex",
                gap:"10px",
                // color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                // marginTop: "20px",
                // justifyContent: "flex-end
                width: "100%",
                boxSizing: "border-box",
                borderRadius: "5px",
                backgroundColor: "rgba(26, 26, 26, 0.514)"
              }}
            >
              <FaSistrix />
              Polarity 
            </button>
          </div>
        </div>
        {/* Polaridad promedio */}
        <div
          style={{
            // marginTop: "20px",
            padding: "10px",
            border: "1px solid rgba(26, 26, 26, 0.514)",
            borderRadius: "5px",
            backgroundColor: "#000",
        
          }}
        >
          Average Polarity:
          <span
            style={{
              color:
                averagePolarity > 0
                  ? "green"
                  : averagePolarity < 0
                  ? "red"
                  : "white",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {" "}
            {averagePolarity !== null ? averagePolarity.toFixed(2) : ""}
          </span>
   
        </div>
      </div>
    </div>
  );
}

export default App;
