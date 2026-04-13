import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

const OG_VERSES = [
  { ref: "2 Timothy 1:7", text: "For God gave us a spirit not of fear but of power and love and self-control." },
  { ref: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope." },
  { ref: "Philippians 4:13", text: "I can do all things through him who strengthens me." },
  { ref: "Proverbs 3:5-6", text: "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths." },
  { ref: "Isaiah 41:10", text: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand." },
  { ref: "Romans 8:28", text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose." },
  { ref: "Joshua 1:9", text: "Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go." },
  { ref: "Psalm 46:10", text: "Be still, and know that I am God." },
  { ref: "Isaiah 40:31", text: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint." },
  { ref: "Philippians 4:6-7", text: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God." },
  { ref: "Lamentations 3:22-23", text: "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness." },
  { ref: "Ephesians 2:10", text: "For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them." },
  { ref: "Psalm 119:105", text: "Your word is a lamp to my feet and a light to my path." },
  { ref: "John 3:16", text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life." },
  { ref: "Galatians 6:9", text: "And let us not grow weary of doing good, for in due season we will reap, if we do not give up." },
  { ref: "Romans 8:38-39", text: "For I am sure that neither death nor life, nor angels nor rulers, nor things present nor things to come, will be able to separate us from the love of God in Christ Jesus our Lord." },
  { ref: "Hebrews 11:1", text: "Now faith is the assurance of things hoped for, the conviction of things not seen." },
  { ref: "James 1:5", text: "If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him." },
  { ref: "Psalm 23:1-3", text: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul." },
  { ref: "Colossians 3:23-24", text: "Whatever you do, work heartily, as for the Lord and not for men, knowing that from the Lord you will receive the inheritance as your reward." },
  { ref: "2 Corinthians 12:9", text: "My grace is sufficient for you, for my power is made perfect in weakness." },
  { ref: "Matthew 6:33", text: "But seek first the kingdom of God and his righteousness, and all these things will be added to you." },
  { ref: "Revelation 21:4", text: "He will wipe away every tear from their eyes, and death shall be no more, neither shall there be mourning, nor crying, nor pain anymore." },
  { ref: "Psalm 139:13-14", text: "For you formed my inward parts; you knitted me together in my mother's womb. I praise you, for I am fearfully and wonderfully made." },
];

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return s.slice(0, s.lastIndexOf(" ", max)) + "\u2026";
}

export async function GET() {
  const hourIdx = new Date().getHours() % OG_VERSES.length;
  const verse = OG_VERSES[hourIdx];
  const displayText = truncate(verse.text, 120);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#080808",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 10,
              color: "rgba(240,240,240,0.3)",
              letterSpacing: "4px",
              marginBottom: 24,
              fontFamily: "monospace",
            }}
          >
            // YOUR PERSONAL OS
          </span>

          <span
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#F0F0F0",
              lineHeight: 1.0,
            }}
          >
            R2·OS
          </span>

          <span
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "rgba(240,240,240,0.4)",
              marginTop: 16,
            }}
          >
            Fitness. School. Finance. Build. One tap away.
          </span>

          <div
            style={{
              width: 200,
              height: 0.5,
              background: "rgba(240,240,240,0.15)",
              marginTop: 32,
              marginBottom: 24,
            }}
          />

          <span
            style={{
              fontSize: 14,
              fontStyle: "italic",
              color: "rgba(240,240,240,0.45)",
              lineHeight: 1.6,
              maxWidth: 420,
            }}
          >
            &ldquo;{displayText}&rdquo;
          </span>

          <span
            style={{
              fontSize: 11,
              color: "rgba(240,240,240,0.2)",
              marginTop: 8,
              fontFamily: "monospace",
            }}
          >
            — {verse.ref}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "flex-end",
          }}
        >
          {["R2·FIT", "R2·SCHOOL", "R2·FINANCE", "R2·BUILD"].map((app) => (
            <div
              key={app}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(240,240,240,0.04)",
                border: "0.5px solid rgba(240,240,240,0.12)",
                borderRadius: 6,
                padding: "10px 16px",
                width: 180,
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(240,240,240,0.7)",
                }}
              >
                {app}
              </span>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(240,240,240,0.25)",
                }}
              />
            </div>
          ))}
        </div>

        <span
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            fontSize: 11,
            color: "rgba(240,240,240,0.2)",
            fontFamily: "monospace",
          }}
        >
          r2-os.vercel.app
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
