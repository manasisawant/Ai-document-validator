function FeatureCard({
  icon,
  title,
 description,
  buttonText,
  buttonColor,
  onClick,
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#ffffff",
        borderRadius: "20px",
        padding: "35px",
        textAlign: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        transition: "0.3s",
        cursor: "pointer",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 18px 35px rgba(0,0,0,0.12)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 25px rgba(0,0,0,0.08)";
      }}
    >
      <div
        style={{
          fontSize: "55px",
          marginBottom: "20px",
        }}
      >
        {icon}
      </div>

      <h2
        style={{
          color: "#1f2937",
          marginBottom: "10px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "25px",
        }}
      >
        {description}
      </p>

      <button
        onClick={onClick}
        style={{
          background: buttonColor,
          color: "white",
          border: "none",
          borderRadius: "10px",
          padding: "14px 28px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default FeatureCard;