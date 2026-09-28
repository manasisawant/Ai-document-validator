import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ValidationHistoryPage() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("access_token");

      // User is not logged in
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/history/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");

          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch validation history. Status: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Validation History:", data);

        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("History Error:", error);
        setError("Unable to load validation history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) {
    return (
      <div style={messageStyle}>
        <h2>Loading validation history...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={messageStyle}>
        <h2>{error}</h2>

        <button
          style={buttonStyle}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            Validation History
          </h1>

          <p style={subtitleStyle}>
            View your previous PDF and Excel validation results.
          </p>
        </div>

        <button
          style={buttonStyle}
          onClick={() => navigate("/upload")}
        >
          + New Validation
        </button>
      </div>

      {/* HISTORY */}
      <div style={tableContainer}>

        <h2 style={sectionTitle}>
          Previous Validations
        </h2>

        {history.length === 0 ? (
          <div style={emptyHistoryStyle}>

            <h3>
              No validation history yet
            </h3>

            <p>
              Your completed validations will appear here.
            </p>

            <button
              style={buttonStyle}
              onClick={() => navigate("/upload")}
            >
              Start Validation
            </button>

          </div>
        ) : (
          <table style={tableStyle}>

            <thead>
              <tr>
                <th style={thStyle}>
                  PDF Document
                </th>

                <th style={thStyle}>
                  Excel Document
                </th>

                <th style={thStyle}>
                  Accuracy
                </th>

                <th style={thStyle}>
                  Matched
                </th>

                <th style={thStyle}>
                  Mismatches
                </th>

                <th style={thStyle}>
                  Processing Time
                </th>

                <th style={thStyle}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {history.map((item) => (
                <tr
                  key={item.validation_id}
                  style={rowStyle}
                >

                  <td style={tdStyle}>
                    {item.pdf_filename}
                  </td>

                  <td style={tdStyle}>
                    {item.excel_filename}
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: "700",
                      color:
                        Number(item.accuracy) >= 80
                          ? "#15803d"
                          : Number(item.accuracy) >= 50
                          ? "#c2410c"
                          : "#dc2626",
                    }}
                  >
                    {item.accuracy}%
                  </td>

                  <td style={tdStyle}>
                    {item.matched_count}
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      color:
                        item.mismatches_count > 0
                          ? "#dc2626"
                          : "#15803d",
                      fontWeight: "600",
                    }}
                  >
                    {item.mismatches_count}
                  </td>

                  <td style={tdStyle}>
                    {item.processing_time || "-"}
                  </td>

                  <td style={tdStyle}>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/history/${item.validation_id}`
                        )
                      }
                      style={viewButtonStyle}
                    >
                      View Report
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
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
  minWidth: "900px",
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

const rowStyle = {
  background: "#ffffff",
};


/* VIEW REPORT BUTTON */

const viewButtonStyle = {
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 14px",
  cursor: "pointer",
  fontWeight: "600",
};


/* EMPTY / LOADING */

const messageStyle = {
  padding: "60px",
  textAlign: "center",
};

const emptyHistoryStyle = {
  textAlign: "center",
  padding: "50px",
  color: "#6b7280",
};


export default ValidationHistoryPage;