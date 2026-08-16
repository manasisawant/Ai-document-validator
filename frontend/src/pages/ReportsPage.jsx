import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const validationResult = location.state?.validationResult;
  const hasMismatches = validationResult?.mismatches_count > 0;

  const downloadReport = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("AI DOCUMENT VALIDATION REPORT", 20, 20);

  // Subtitle
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    "PDF and Excel Document Comparison",
    20,
    28
  );

  // Line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 33, 190, 33);

  // Summary heading
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Validation Summary", 20, 45);

  // Summary details
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Accuracy: ${validationResult.accuracy}%`,
    20,
    55
  );

  doc.text(
    `Matched Fields: ${validationResult.matched_count}`,
    20,
    63
  );

  doc.text(
    `Mismatches: ${validationResult.mismatches_count}`,
    20,
    71
  );

  doc.text(
    `Processing Time: ${validationResult.processing_time}`,
    20,
    79
  );

  // Comparison heading
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Comparison Details", 20, 92);

  // Comparison table
  autoTable(doc, {
    startY: 98,

    head: [
      [
        "Field",
        "PDF Value",
        "Excel Value",
        "Status"
      ]
    ],

    body:
      validationResult.comparison_results?.map(
        (result) => [
          result.field,
          result.pdf_value,
          result.excel_value,
          result.status
        ]
      ) || [],

    styles: {
      fontSize: 9,
      cellPadding: 4
    },

    headStyles: {
      fontStyle: "bold"
    },

    alternateRowStyles: {
      fillColor: [245, 247, 250]
    }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    doc.text(
      `AI Document Validator | Page ${i} of ${pageCount}`,
      20,
      285
    );
  }

  // Download PDF
  doc.save("AI-Document-Validation-Report.pdf");
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