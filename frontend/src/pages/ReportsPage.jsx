import { useLocation, useNavigate } from "react-router-dom";

function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const validationResult = location.state?.validationResult;
  const hasMismatches = validationResult?.mismatches_count > 0;

  const downloadReport = () => {
  let report = "AI DOCUMENT VALIDATION REPORT\n";
  report += "====================================\n\n";

  report += `Accuracy: ${validationResult.accuracy}%\n`;
  report += `Matched Fields: ${validationResult.matched_count}\n`;
  report += `Mismatches: ${validationResult.mismatches_count}\n`;
  report += `Processing Time: ${validationResult.processing_time}\n\n`;

  report += "COMPARISON DETAILS\n";
  report += "====================================\n\n";

  validationResult.comparison_results?.forEach((result) => {
    report += `Field: ${result.field}\n`;
    report += `PDF Value: ${result.pdf_value}\n`;
    report += `Excel Value: ${result.excel_value}\n`;
    report += `Status: ${result.status}\n`;
    report += "------------------------------------\n";
  });

  const blob = new Blob([report], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "validation-report.txt";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  if (!validationResult) {
    return (
      <div style={emptyStyle}>
        <h2>No validation result available.</h2>

        <button
          style={buttonStyle}
          onClick={() => navigate("/upload")}
        >
          Go to Upload
        </button>
      </div>
    );
  }

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Validation Report</h1>
          <p style={subtitleStyle}>
            Detailed comparison between your PDF and Excel document
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>

  <button
    style={downloadButtonStyle}
    onClick={downloadReport}
  >
    ↓ Download Report
  </button>

  <button
    style={buttonStyle}
    onClick={() => navigate("/upload")}
  >
    + New Validation
  </button>

</div>
      </div>

      {/* SUMMARY CARDS */}
      <div style={cardsContainer}>

        <div style={{ ...cardStyle, borderTop: "5px solid #2563eb" }}>
          <p style={cardLabel}>Accuracy</p>
          <h2 style={cardValue}>
            {validationResult.accuracy}%
          </h2>
          <p style={cardDescription}>Overall document accuracy</p>
        </div>

        <div style={{ ...cardStyle, borderTop: "5px solid #059669" }}>
          <p style={cardLabel}>Matched</p>
          <h2 style={cardValue}>
            {validationResult.matched_count}
          </h2>
          <p style={cardDescription}>Fields matched successfully</p>
        </div>

        <div style={{ ...cardStyle, borderTop: "5px solid #dc2626" }}>
          <p style={cardLabel}>Mismatches</p>
          <h2 style={cardValue}>
            {validationResult.mismatches_count}
          </h2>
          <p style={cardDescription}>Fields requiring attention</p>
        </div>

        <div style={{ ...cardStyle, borderTop: "5px solid #7c3aed" }}>
          <p style={cardLabel}>Processing Time</p>
          <h2 style={cardValue}>
            {validationResult.processing_time}
          </h2>
          <p style={cardDescription}>Time taken for validation</p>
        </div>

      </div>

    {/* VALIDATION STATUS */}
<div
  style={{
    background: hasMismatches ? "#fff7ed" : "#f0fdf4",
    border: hasMismatches
      ? "1px solid #fed7aa"
      : "1px solid #bbf7d0",
    borderRadius: "14px",
    padding: "20px 25px",
    marginBottom: "30px",
  }}
>
  <h3
    style={{
      margin: "0 0 8px 0",
      color: hasMismatches ? "#c2410c" : "#15803d",
      fontSize: "19px",
    }}
  >
    {hasMismatches
      ? "⚠️ Validation Completed — Mismatches Found"
      : "✓ Validation Successful"}
  </h3>

  <p
    style={{
      margin: 0,
      color: "#6b7280",
      fontSize: "14px",
    }}
  >
    {hasMismatches
      ? `${validationResult.mismatches_count} field(s) require attention.`
      : "All fields matched successfully."}
  </p>
</div>
      {/* COMPARISON TABLE */}
      <div style={tableContainer}>

        <h2 style={sectionTitle}>Comparison Details</h2>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Field</th>
              <th style={thStyle}>PDF Value</th>
              <th style={thStyle}>Excel Value</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>

          <tbody>
            {validationResult.comparison_results?.map(
              (result, index) => (
                <tr 
                key={index}
                style={{
                  background:
                  result.status === "Matched"
                  ? "#ffffff"
                  : "#fff7f7",

                }}
                >

                  <td style={tdStyle}>
                    {result.field}
                  </td>

                  <td
                    style={{
                       ...tdStyle,
                      fontWeight: result.status === "Matched" ? "400" : "700",
                      color: result.status === "Matched" ? "#4b5563" : "#dc2626",
                    }}
                  >
                    {result.pdf_value}
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: result.status === "Matched" ? "400" : "700",
                      color: result.status === "Matched" ? "#4b5563" : "#dc2626",
                    }}
                  >
                   {result.excel_value}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        ...statusStyle,
                        background:
                          result.status === "Matched"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          result.status === "Matched"
                            ? "#15803d"
                            : "#b91c1c",
                      }}
                    >
                      {result.status === "Matched"
                        ? "✓ Matched"
                        : "✕ Mismatch"}
                    </span>
                  </td>

                </tr>
              )
            )}
          </tbody>
        </table>

      </div>

    </div>
  );
}


/* PAGE */

const pageStyle = {
  padding: "35px",
  width: "100%",
  boxSizing: "border-box",
};


/* HEADER */

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const titleStyle = {
  fontSize: "36px",
  fontWeight: "700",
  color: "#111827",
  margin: "0 0 8px 0",
};

const subtitleStyle = {
  color: "#6b7280",
  fontSize: "16px",
  margin: 0,
};


/* BUTTON */

const buttonStyle = {
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "13px 22px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
};

const downloadButtonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "13px 22px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
};


/* SUMMARY CARDS */

const cardsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginBottom: "30px",
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "25px",
  boxShadow: "0 5px 18px rgba(0,0,0,0.08)",
  minHeight: "145px",
  boxSizing: "border-box",
};

const cardLabel = {
  color: "#6b7280",
  fontSize: "15px",
  fontWeight: "600",
  margin: "0 0 10px 0",
};

const cardValue = {
  color: "#111827",
  fontSize: "30px",
  margin: "0 0 8px 0",
};

const cardDescription = {
  color: "#9ca3af",
  fontSize: "13px",
  margin: 0,
};


/* TABLE */

const tableContainer = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "30px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
  overflowX: "auto",
};

const sectionTitle = {
  fontSize: "23px",
  color: "#111827",
  marginBottom: "22px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  background: "#f3f4f6",
  color: "#374151",
  padding: "15px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "700",
  borderBottom: "1px solid #e5e7eb",
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #e5e7eb",
  color: "#4b5563",
  fontSize: "14px",
};

const statusStyle = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: "20px",
  fontWeight: "600",
  fontSize: "13px",
};


/* EMPTY RESULT */

const emptyStyle = {
  padding: "50px",
  textAlign: "center",
};

export default ReportsPage;