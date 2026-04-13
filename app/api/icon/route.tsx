import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080808",
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
            fontWeight: 700,
            color: "#F0F0F0",
            lineHeight: 1.0,
          }}
        >
          R2
        </span>
        <span
          style={{
            fontSize: 60,
            fontWeight: 400,
            color: "rgba(240,240,240,0.4)",
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
