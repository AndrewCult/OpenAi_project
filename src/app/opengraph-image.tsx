import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_INFO } from "@/data/siteInfo";

// Preview image shown when the link is shared (LinkedIn, WhatsApp, Slack...).
// Next.js renders it to a PNG at build time and adds the og:image meta tags automatically.
export const alt =
  "SummerCamp Bistrò: the AI restaurant where chefs never give you the recipe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public/images/Recipe_Chatbot_Logo.jpg"),
  );
  const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 48,
          padding: "0 72px",
          background: "#fbfaf6",
          borderBottom: "16px solid #ff6b6b",
        }}
      >
        <img src={logoSrc} width={380} height={380} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            width: 640,
          }}
        >
          <div style={{ fontSize: 60, color: "#ff5252", lineHeight: 1.1 }}>
            SummerCamp Bistrò
          </div>
          <div style={{ fontSize: 38, color: "#212529", lineHeight: 1.3 }}>
            The AI restaurant where the chefs never give you the recipe.
          </div>
          <div style={{ fontSize: 26, color: "#6c757d" }}>
            {`${SITE_INFO.appName} · by ${SITE_INFO.ownerName}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
