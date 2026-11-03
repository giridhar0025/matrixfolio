import { ImageResponse } from "next/og";

export const alt =
  "Pulichara Giridhar — Full-stack engineer and AI-native builder. The portfolio is a simulation you can inspect.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          padding: "48px 56px",
          backgroundColor: "#020604",
          color: "#e8f8ec",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -80,
            width: 760,
            height: 760,
            display: "flex",
            border: "1px solid rgba(69,255,146,0.22)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -100,
            right: 48,
            width: 500,
            height: 500,
            display: "flex",
            border: "1px solid rgba(69,255,146,0.14)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 185,
            right: 215,
            width: 300,
            height: 300,
            display: "flex",
            border: "1px solid rgba(69,255,146,0.24)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(69,255,146,0.15), rgba(69,255,146,0))",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 16,
            borderBottom: "1px solid rgba(154,255,184,0.22)",
            fontFamily: "monospace",
            fontSize: 15,
            letterSpacing: 1.5,
            color: "#91ac9b",
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(154,255,184,0.4)",
                color: "#45ff92",
                fontSize: 13,
              }}
            >
              PG
            </div>
            <span>PORTFOLIO / SIMULATION 0.9.7</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#45ff92",
              }}
            />
            SYSTEM ONLINE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              marginBottom: 18,
              fontFamily: "monospace",
              fontSize: 15,
              letterSpacing: 1.5,
              color: "#45ff92",
            }}
          >
            FULL-STACK ENGINEER / AI-NATIVE BUILDER
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 122,
              fontWeight: 700,
              letterSpacing: -8,
              lineHeight: 0.82,
            }}
          >
            <span>PULICHARA</span>
            <span style={{ color: "#45ff92" }}>GIRIDHAR</span>
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 700,
              marginTop: 24,
              fontSize: 25,
              lineHeight: 1.35,
              color: "#91ac9b",
            }}
          >
            Production systems, interface craft, and AI-native delivery.
            A simulation you can inspect.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingTop: 18,
            borderTop: "1px solid rgba(154,255,184,0.22)",
            fontFamily: "monospace",
            fontSize: 14,
            letterSpacing: 1,
            color: "#91ac9b",
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            <span>HYDERABAD, IN</span>
            <span>NEXT / THREE / GSAP</span>
          </div>
          <span style={{ color: "#45ff92" }}>OPEN A CHANNEL</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
