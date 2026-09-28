import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ValidationReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        /*
         * First get the validation history.
         * This contains the summary information.
         */
        const historyResponse = await fetch(
          "http://127.0.0.1:8000/history/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (historyResponse.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");

          navigate("/login");
          return;
        }

        if (!historyResponse.ok) {
          throw new Error(
            "Failed to fetch validation history"
          );
        }

        const historyData = await historyResponse.json();

        /*
         * Find the requested validation.
         *
         * The backend uses validation_id.
         */
        const historyItem = historyData.find(
          (item) =>
            String(item.validation_id) === String(id)
        );

        if (!historyItem) {
          throw new Error(
            "Validation report was not found."
          );
        }

        /*
         * Now get the detailed comparison results.
         */
        const detailsResponse = await fetch(
          `http://127.0.0.1:8000/history/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (detailsResponse.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");

          navigate("/login");
          return;
        }

        if (!detailsResponse.ok) {
          throw new Error(
            "Failed to fetch validation details"
          );
        }

        const detailsData = await detailsResponse.json();

        /*
         * Convert backend field names to the format
         * used by the report UI.
         */
        const comparisonResults = Array.isArray(detailsData)
          ? detailsData.map((result) => ({
              field:
                result.field_name ??
                result.field ??
                "",

              pdf_value:
                result.document_value ??
                result.pdf_value ??
                "",

              excel_value:
                result.excel_value ??
                "",

              status:
                result.status ??
                "",
            }))
          : [];

        /*
         * Combine history summary + comparison details.
         */
        const combinedReport = {
          ...historyItem,

          comparison_results: comparisonResults,
        };

        console.log(
          "Historical Validation Report:",
          combinedReport
        );

        setReport(combinedReport);
      } catch (error) {
        console.error(
          "Historical Report Error:",
          error
        );

        setError(
          error.message ||
            "Unable to load validation report."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={messageStyle}>
        <h2>Loading validation report...</h2>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div style={messageStyle}>
        <h2>
          {error || "Report not found."}
        </h2>

        <button
          style={buttonStyle}
          onClick={() => navigate("/history")}
        >
          Back to History
        </button>
      </div>
    );
  }

  const hasMismatches =
    Number(report.mismatches_count || 0) > 0;

  return (
    <div style={pageStyle}>

      {/* HEADER */}

      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            Validation Report
          </h1>

          <p style={subtitleStyle}>
            Detailed validation result
          </p>
        </div>

        <button
          style={buttonStyle}
          onClick={() => navigate("/history")}
        >
          ← Back to History
        </button>
      </div>


      {/* DOCUMENT INFORMATION */}

      <div style={documentContainer}>

        <div>
          <p style={labelStyle}>
            PDF Document
          </p>

          <p style={filenameStyle}>
            {report.pdf_filename}
          </p>
        </div>

        <div>
          <p style={labelStyle}>
            Excel Document
          </p>

          <p style={filenameStyle}>
            {report.excel_filename}
          </p>
        </div>

        <div>
          <p style={labelStyle}>
            Validation ID
          </p>

          <p style={filenameStyle}>
            #{report.validation_id}
          </p>
        </div>

      </div>


      {/* SUMMARY CARDS */}

      <div style={cardsContainer}>

        {/* ACCURACY */}

        <div
          style={{
            ...cardStyle,
            borderTop: "5px solid #2563eb",
          }}
        >
          <p style={cardLabel}>
            Accuracy
          </p>

          <h2 style={cardValue}>
            {report.accuracy}%
          </h2>

          <p style={cardDescription}>
            Overall document accuracy
          </p>
        </div>


        {/* MATCHED */}

        <div
          style={{
            ...cardStyle,
            borderTop: "5px solid #059669",
          }}
        >
          <p style={cardLabel}>
            Matched
          </p>

          <h2 style={cardValue}>
            {report.matched_count}
          </h2>

          <p style={cardDescription}>
            Fields matched successfully
          </p>
        </div>


        {/* MISMATCHES */}

        <div
          style={{
            ...cardStyle,
            borderTop: "5px solid #dc2626",
          }}
        >
          <p style={cardLabel}>
            Mismatches
          </p>

          <h2 style={cardValue}>
            {report.mismatches_count}
          </h2>

          <p style={cardDescription}>
            Fields requiring attention
          </p>
        </div>


        {/* PROCESSING TIME */}

        <div
          style={{
            ...cardStyle,
            borderTop: "5px solid #7c3aed",
          }}
        >
          <p style={cardLabel}>
            Processing Time
          </p>

          <h2 style={cardValue}>
            {report.processing_time || "-"}
          </h2>

          <p style={cardDescription}>
            Time taken for validation
          </p>
        </div>

      </div>


      {/* VALIDATION STATUS */}

      <div
        style={{
          background: hasMismatches
            ? "#fff7ed"
            : "#f0fdf4",

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

            color: hasMismatches
              ? "#c2410c"
              : "#15803d",

            fontSize: "19px",
          }}
        >
          {hasMismatches
            ? "Validation Completed — Mismatches Found"
            : "Validation Successful"}
        </h3>

        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          {hasMismatches
            ? `${report.mismatches_count} field(s) require attention.`
            : "All fields matched successfully."}
        </p>

      </div>


      {/* COMPARISON TABLE */}

      <div style={tableContainer}>

        <h2 style={sectionTitle}>
          Comparison Details
        </h2>

        {report.comparison_results?.length > 0 ? (
          <table style={tableStyle}>

            <thead>
              <tr>

                <th style={thStyle}>
                  Field
                </th>

                <th style={thStyle}>
                  PDF Value
                </th>

                <th style={thStyle}>
                  Excel Value
                </th>

                <th style={thStyle}>
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {report.comparison_results.map(
                (result, index) => {

                  const isMatched =
                    String(result.status).toLowerCase() ===
                    "matched";

                  return (
                    <tr
                      key={index}
                      style={{
                        background: isMatched
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

                          fontWeight: isMatched
                            ? "400"
                            : "700",

                          color: isMatched
                            ? "#4b5563"
                            : "#dc2626",
                        }}
                      >
                        {result.pdf_value}
                      </td>

                      <td
                        style={{
                          ...tdStyle,

                          fontWeight: isMatched
                            ? "400"
                            : "700",

                          color: isMatched
                            ? "#4b5563"
                            : "#dc2626",
                        }}
                      >
                        {result.excel_value}
                      </td>

                      <td style={tdStyle}>

                        <span
                          style={{
                            ...statusStyle,

                            background: isMatched
                              ? "#dcfce7"
                              : "#fee2e2",

                            color: isMatched
                              ? "#15803d"
                              : "#b91c1c",
                          }}
                        >
                          {isMatched
                            ? "✓ Matched"
                            : "✕ Mismatch"}
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>
        ) : (
          <div style={emptyResultsStyle}>
            No comparison details are available for
            this validation.
          </div>
        )}

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


/* DOCUMENT INFORMATION */

const documentContainer = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "22px 25px",
  marginBottom: "30px",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "25px",
  boxShadow: "0 5px 18px rgba(0,0,0,0.08)",
};

const labelStyle = {
  color: "#9ca3af",
  fontSize: "13px",
  fontWeight: "600",
  margin: "0 0 7px 0",
};

const filenameStyle = {
  color: "#111827",
  fontSize: "15px",
  fontWeight: "600",
  margin: 0,
  wordBreak: "break-word",
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


/* EMPTY RESULTS */

const emptyResultsStyle = {
  padding: "40px",
  textAlign: "center",
  color: "#6b7280",
};


/* LOADING / ERROR */

const messageStyle = {
  padding: "60px",
  textAlign: "center",
};


export default ValidationReportPage;