function UploadPage() {
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
            >
              Upload PDF
            </button>
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
              onMouseOver={(e) => {
                e.target.style.background = "#047857";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#059669";
              }}
            >
              Upload Excel
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
            style={validateButtonStyle}
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