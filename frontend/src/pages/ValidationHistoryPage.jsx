import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ValidationHistoryPage() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this validation history?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/validation-history/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete validation history");
    }

    setHistory((currentHistory) =>
      currentHistory.filter((item) => item.id !== id)
    );
  } catch (error) {
    console.error(error);
    alert("Unable to delete validation history.");
  }
};

  useEffect(() => {
    fetch("http://127.0.0.1:8000/validation-history")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch validation history");
        }

        return response.json();
      })
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load validation history.");
        setLoading(false);
      });
  }, []);

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
          <h1 style={titleStyle}>Validation History</h1>

          <p style={subtitleStyle}>
            View previous PDF and Excel validation results
          </p>
        </div>

        <button
          style={buttonStyle}
          onClick={() => navigate("/upload")}
        >
          + New Validation
        </button>
      </div>

      {/* HISTORY TABLE */}
      <div style={tableContainer}>

        <h2 style={sectionTitle}>
          Previous Validations
        </h2>

        {history.length === 0 ? (
          <div style={emptyHistoryStyle}>
            <h3>No validation history yet</h3>

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

                <th style={thStyle}>PDF Document</th>

                <th style={thStyle}>Excel Document</th>

                <th style={thStyle}>Accuracy</th>

                <th style={thStyle}>Matched</th>

                <th style={thStyle}>Mismatches</th>

                <th style={thStyle}>Processing Time</th>

                <th style={thStyle}>Validated At</th>

                <th style={thStyle}>Action</th>

              </tr>
            </thead>

            <tbody>

              {history.map((item) => (

                <tr
                  key={item.id}
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
                        item.accuracy >= 80
                          ? "#15803d"
                          : item.accuracy >= 50
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
                    {item.processing_time}
                  </td>

                  <td style={tdStyle}>
                    {new Date(item.validated_at).toLocaleString()}
                  </td>

                 <td style={tdStyle}>
                   <div style={{ display: "flex", gap: "8px" }}>

                      <button
                        onClick={() => navigate(`/history/${item.id}`)}
                        style={{
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 14px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                      >
                        View Report
                    </button>

                     <button
                       onClick={() => handleDelete(item.id)}
                       style={{
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 14px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Delete
                      </button>

                  </div>
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
  minWidth: "1000px",
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