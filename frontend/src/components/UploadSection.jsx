function UploadSection() {
  return (
    <div
      style={{
        marginTop: "40px",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px)",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "0.3s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h3>Upload Files</h3>
      <div style ={{
        display:"flex",
        gap:"20px",
        marginTop:"20px",
      }}
      >
        <button style={uploadButton}>
            Upload PDF
        </button>
        <button style={uploadButton}>
            Upload Excel
        </button>
      </div>
      </div>
      );
      }

      const uploadButton ={
        padding: "12px 20px",
        background: "#111827",
        color: "White",
        border:"none",
        borderRadius: "8px",
        cursor: "pointer",
      };

export default UploadSection;