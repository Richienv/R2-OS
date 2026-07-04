export type Urgency = "info" | "warning" | "urgent";

export type AppKey = "fit" | "school" | "finance" | "build";

export type AppConfig = {
  id: AppKey;
  name: string;
  shortName: string;
  url: string;
  grad: string;
  glow: string;
};

export const APPS: AppConfig[] = [
  {
    id: "fit",
    name: "R2·FIT",
    shortName: "FIT",
    url: "https://r2-fit.vercel.app",
    grad: "linear-gradient(165deg,#dcf7e8 0%,#8fe4b2 38%,#54bd82 66%,#b7eecd 100%)",
    glow: "rgba(74,222,128,.4)",
  },
  {
    id: "school",
    name: "R2·SCHOOL",
    shortName: "GMBA",
    url: "https://r2-school.vercel.app",
    grad: "linear-gradient(165deg,#f6f8fa 0%,#dde1e6 38%,#b3b9c0 66%,#eef1f4 100%)",
    glow: "rgba(206,212,220,.42)",
  },
  {
    id: "finance",
    name: "R2·FINANCE",
    shortName: "MONEY",
    url: "https://r2-finance.vercel.app",
    grad: "linear-gradient(165deg,#fbf1c8 0%,#ecd583 38%,#cba846 66%,#f5e4a4 100%)",
    glow: "rgba(234,179,8,.4)",
  },
  {
    id: "build",
    name: "R2·BUILD",
    shortName: "BUILD",
    url: "https://r2-build.vercel.app",
    grad: "linear-gradient(165deg,#ffdac4 0%,#ff8a6e 40%,#d55440 68%,#ffab88 100%)",
    glow: "rgba(238,60,48,.45)",
  },
];
