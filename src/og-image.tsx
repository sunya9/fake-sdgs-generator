const colors = [
  "#E5243B",
  "#DDA63A",
  "#4C9F38",
  "#C5192D",
  "#fff", // space
  "#FF3A21",
  "#26BDE2",
  "#FCC30B",
  "#A21942",
  "#fff", // space
  "#FD6925",
  "#DD1367",
  "#FD9D24",
  "#BF8B2E",
  "#3F7E44",
  "#0A97D9",
  "#56C02B",
  "#00689D",
  "#19486A",
];

export default function OGImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#1a202c",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Geist",
        fontWeight: 700,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            marginBottom: 20,
          }}
        ></div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            textAlign: "center",
          }}
        >
          {Array.from("Fake SDGs Generator").map((char, i) => {
            return char === " " ? (
              <span key={i}>&nbsp;</span>
            ) : (
              <span key={i} style={{ color: colors[i] }}>
                {char}
              </span>
            );
          })}
        </h1>
      </div>
    </div>
  );
}
