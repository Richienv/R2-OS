import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "radial-gradient(120% 90% at 50% 0%, #1a1012 0%, #050406 62%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 200,
            fontWeight: 800,
            color: "#f8f4f0",
            lineHeight: 1.0,
            letterSpacing: "-4px",
          }}
        >
          R2
        </span>
        <span
          style={{
            fontSize: 60,
            fontWeight: 400,
            color: "#ee3c30",
            marginTop: -10,
          }}
        >
          ·OS
        </span>
      </div>
    ),
    {
      width: 512,
      height: 512,
    },
  );
}
