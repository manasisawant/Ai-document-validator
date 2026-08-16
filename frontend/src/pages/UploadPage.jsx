import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
function UploadPage() {
  const navigate = useNavigate();

  const [pdfFile, setPdFile] = useState(null);
  const [excelFile , setExcelFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const handleValidate = async () => {
  if (!pdfFile || !excelFile) {
    alert("Please upload both PDF and Excel files.");
    return;
  }

  setLoading(true);

  const formData = new FormData();
  formData.append("pdf_file", pdfFile);
  formData.append("excel_file", excelFile);

  try {
  const response = await fetch("http://127.0.0.1:8000/validate", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  console.log("Validation Result:",data);

  if(data.status === "success") {
    navigate("/reports", {
      state: {
        validationResult: data,
      },
    });
  }

} catch (error) {
  console.error("Error:", error);
} finally {
  setLoading(false);
}

};
  const pdfInputRef = useRef(null);
  const excelInputRef = useRef(null);

  return (
    <div style={{ width: "100%" }}>
      <h1
        style={{
          fontSize: "38px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "8px",
        }}
      >
        Upload Documents
      </h1>

      <p
        style={{
          color: "#6b7280",
          fontSize: "16px",
          marginBottom: "35px",
        }}
      >
        Upload your PDF and Excel files for validation.
      </p>

      <div
        style={{
          width: "100%",
          background: "#ffffff",
          borderRadius: "18px",
          padding: "35px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "30px",
            marginBottom: "35px",
          }}
        >
          {/* PDF CARD */}
          <div style={cardStyle}>
            <div style={iconStyle}>📄</div>

            <h2 style={cardTitle}>PDF Document</h2>

            <p style={cardDescription}>
              Upload the scanned PDF document.
            </p>

            <button
              style={pdfButtonStyle}
              onMouseOver={(e) => {
                e.target.style.background = "#1d4ed8";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#2563eb";
              }}
              onClick={() => pdfInputRef.current.click()}
            >
              Upload PDF
            </button>

            <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf"
            style={{ display: "none "}}
            onChange={(e) => {
              setPdFile(e.target.files[0]);
            }}
            />
            {pdfFile && (
  <p
    style={{
      marginTop: "15px",
      color: "#2563eb",
      fontWeight: "600",
    }}
  >
    📄 {pdfFile.name}
  </p>
)}
          </div>

          {/* EXCEL CARD */}
          <div style={cardStyle}>
            <div style={iconStyle}>📊</div>

            <h2 style={cardTitle}>Excel Document</h2>

            <p style={cardDescription}>
              Upload the Excel sheet.
            </p>

            <button
              style={excelButtonStyle}
              onClick={() => excelInputRef.current.click()}
              onMouseOver={(e) => {
                e.target.style.background = "#047857";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#059669";
              }}
            >
              Upload Excel

              <input
              ref={excelInputRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: "none"}}
              onChange={(e) => {
                setExcelFile(e.target.files[0]);
              }}
              />
              {excelFile && (
  <p
    style={{
      marginTop: "15px",
      color: "#f3f4fa",
      fontWeight: "600",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "220px",
      marginLeft: "auto",
      marginRight: "auto",
    }}
  >
    📊 {excelFile.name}
  </p>
)}
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            style={{
  ...validateButtonStyle,
  background: !pdfFile || !excelFile ? "#9ca3af" : "#111827",
  cursor: !pdfFile || !excelFile ? "not-allowed" : "pointer",
}}
            disabled={!pdfFile || !excelFile}
            onClick={handleValidate}
            onMouseOver={(e) => {
              e.target.style.background = "#1f2937";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#111827";
            }}
          >
            Validate Documents
          </button>
        </div>
      </div>
    </div>
  );
}



const cardStyle = {
  flex: 1,
  background: "#f8fafc",
  borderRadius: "16px",
  padding: "35px",
  textAlign: "center",
  border: "1px solid #e5e7eb",
  minHeight: "320px",
};

const iconStyle = {
  fontSize: "48px",
  marginBottom: "18px",
};

const cardTitle = {
  fontSize: "24px",
  color: "#1f2937",
  marginBottom: "10px",
};

const cardDescription = {
  color: "#6b7280",
  marginBottom: "25px",
  fontSize: "15px",
};

const baseButtonStyle = {
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "14px 28px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.3s",
};

const pdfButtonStyle = {
  ...baseButtonStyle,
  background: "#2563eb",
};

const excelButtonStyle = {
  ...baseButtonStyle,
  background: "#059669",
};

const validateButtonStyle = {
  ...baseButtonStyle,
  background: "#111827",
  padding: "16px 42px",
  fontSize: "17px",
};

export default UploadPage;