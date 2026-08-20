import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AnalyticsPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Unable to load analytics data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={messageStyle}>
        <h2>Loading analytics...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={messageStyle}>
        <h2>{error}</h2>
      </div>
    );
  }

  const totalValidations = history.length;

  const averageAccuracy =
    totalValidations > 0
      ? (
          history.reduce(
            (total, item) => total + Number(item.accuracy),
            0
          ) / totalValidations
        ).toFixed(2)
      : 0;

  const totalMatched = history.reduce(
    (total, item) => total + Number(item.matched_count),
    0
  );

  const totalMismatches = history.reduce(
    (total, item) => total + Number(item.mismatches_count),
    0
  );

  const activityData = history.map((item) => ({
  date: new Date(item.validated_at).toLocaleDateString(),
  validations: 1,
}));

const handleDownload = async () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("AI DOCUMENT VALIDATOR", 20, 20);

  doc.setFontSize(16);
  doc.text("Analytics Report", 20, 32);

  doc.setFontSize(11);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    20,
    42
  );

  // Summary
  doc.setFontSize(12);

  doc.text(
    `Total Validations: ${totalValidations}`,
    20,
    58
  );

  doc.text(
    `Average Accuracy: ${averageAccuracy}%`,
    20,
    68
  );

  doc.text(
    `Total Matched Fields: ${totalMatched}`,
    20,
    78
  );

  doc.text(
    `Total Mismatches: ${totalMismatches}`,
    20,
    88
  );

  // Capture charts
  const chartIds = [
    "accuracy-chart",
    "comparison-chart",
    "activity-chart",
  ];

  let yPosition = 100;

  for (const chartId of chartIds) {
    const chartElement = document.getElementById(chartId);

    if (!chartElement) {
      continue;
    }

    const canvas = await html2canvas(chartElement, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imageData = canvas.toDataURL("image/png");

    const imageWidth = 170;
    const imageHeight =
      (canvas.height * imageWidth) / canvas.width;

    // Add a new page if necessary
    if (yPosition + imageHeight > 280) {
      doc.addPage();
      yPosition = 20;
    }

    doc.addImage(
      imageData,
      "PNG",
      20,
      yPosition,
      imageWidth,
      imageHeight
    );

    yPosition += imageHeight + 15;
  }

  // Validation history table
  doc.addPage();

  autoTable(doc, {
    startY: 20,
    head: [
      [
        "Validation ID",
        "PDF Document",
        "Excel Document",
        "Accuracy",
        "Matched",
        "Mismatches",
        "Processing Time",
        "Validated At",
      ],
    ],
    body: history.map((item) => [
      item.id,
      item.pdf_filename,
      item.excel_filename,
      `${item.accuracy}%`,
      item.matched_count,
      item.mismatches_count,
      item.processing_time,
      new Date(item.validated_at).toLocaleString(),
    ]),
  });

  doc.save("analytics-report.pdf");
};  

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
  <div>
    <h1 style={titleStyle}>Analytics</h1>

    <p style={subtitleStyle}>
      Overview of your document validation performance
    </p>
  </div>

  <button
    style={downloadButtonStyle}
    onClick={handleDownload}
  >
    ↓ Download Analytics
  </button>
</div>

      <div style={cardsContainer}>
        <div style={cardStyle}>
          <p style={cardLabel}>Total Validations</p>
          <h2 style={cardValue}>{totalValidations}</h2>
        </div>

        <div style={cardStyle}>
          <p style={cardLabel}>Average Accuracy</p>
          <h2 style={cardValue}>{averageAccuracy}%</h2>
        </div>

        <div style={cardStyle}>
          <p style={cardLabel}>Total Matched Fields</p>
          <h2 style={cardValue}>{totalMatched}</h2>
        </div>

        <div style={cardStyle}>
          <p style={cardLabel}>Total Mismatches</p>
          <h2 style={cardValue}>{totalMismatches}</h2>
        </div>
      </div>

              <div id="accuracy-chart" style={chartContainer}>
        <h2 style={sectionTitle}>Validation Accuracy</h2>

        <p style={chartSubtitle}>
          Accuracy achieved in each document validation
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="id"
              label={{
                value: "Validation",
                position: "insideBottom",
                offset: -5,
              }}
            />

            <YAxis
              domain={[0, 100]}
              label={{
                value: "Accuracy (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value) => [`${value}%`, "Accuracy"]}
            />

            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

               <div id="comparison-chart" style={chartContainer}>
        <h2 style={sectionTitle}>Matched vs Mismatched Fields</h2>

        <p style={chartSubtitle}>
          Comparison of successfully matched and mismatched fields
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="id"
              label={{
                value: "Validation",
                position: "insideBottom",
                offset: -5,
              }}
            />

            <YAxis
              allowDecimals={false}
              label={{
                value: "Number of Fields",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="matched_count"
              name="Matched"
              fill="#16a34a"
            />

            <Bar
              dataKey="mismatches_count"
              name="Mismatched"
              fill="#dc2626"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

     <div id="activity-chart" style={chartContainer}>
  <h2 style={sectionTitle}>Validation Activity</h2>

  <p style={chartSubtitle}>
    Validation activity over time
  </p>

  <ResponsiveContainer width="100%" height={320}>
    <BarChart data={activityData}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        dataKey="date"
      />

      <YAxis
        allowDecimals={false}
        label={{
          value: "Validations",
          angle: -90,
          position: "insideLeft",
        }}
      />

      <Tooltip />

      <Bar
        dataKey="validations"
        name="Validations"
        fill="#7c3aed"
      />
    </BarChart>
  </ResponsiveContainer>
</div>   

      {history.length === 0 && (
        <div style={emptyStyle}>
          <h3>No analytics data yet</h3>

          <p>
            Complete a document validation to see analytics here.
          </p>
        </div>
      )}
    </div>
  );
}

const pageStyle = {
  padding: "35px",
  width: "100%",
  boxSizing: "border-box",
};

const headerStyle = {
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

const cardsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "25px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
};

const cardLabel = {
  color: "#6b7280",
  fontSize: "15px",
  margin: "0 0 12px 0",
};

const cardValue = {
  color: "#111827",
  fontSize: "30px",
  margin: 0,
};

const messageStyle = {
  padding: "60px",
  textAlign: "center",
};

const emptyStyle = {
  marginTop: "30px",
  background: "#ffffff",
  borderRadius: "16px",
  padding: "50px",
  textAlign: "center",
  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
  color: "#6b7280",
};

const chartContainer = {
  marginTop: "30px",
  background: "#ffffff",
  borderRadius: "16px",
  padding: "30px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
};

const sectionTitle = {
  fontSize: "23px",
  color: "#111827",
  margin: "0 0 8px 0",
};

const chartSubtitle = {
  color: "#6b7280",
  fontSize: "14px",
  marginBottom: "25px",
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

export default AnalyticsPage;