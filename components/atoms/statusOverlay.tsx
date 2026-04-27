import type { StatusOverlayProps } from "@/lib/types";

export function StatusOverlay({ status, foundOrgName, foundName, errMsg }: StatusOverlayProps) {
  if (!status) return null;

  if (status === "success") {
    return (
      <div
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center animate-fade-in"
        style={{
          background:
            "linear-gradient(160deg, rgba(0,55,180,0.96) 0%, rgba(0,30,100,0.98) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        {/* Shift everything slightly above center */}
        <div className="flex flex-col items-center -mt-24">

          {/* CENTERED ANIMATION CONTAINER */}
          <div className="relative flex items-center justify-center w-[500px] h-[500px]">
            
            {/* Radiating rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[500px] rounded-full border border-primary-300/20 animate-[ping_2s_ease-out_infinite]" />
              <div className="absolute w-[360px] h-[360px] rounded-full border border-primary-200/25 animate-[ping_2s_0.4s_ease-out_infinite]" />
              <div className="absolute w-[220px] h-[220px] rounded-full border border-primary/30 animate-[ping_2s_0.8s_ease-out_infinite]" />
            </div>

            {/* Success circle */}
            <div
              className="absolute w-44 h-44 rounded-full flex items-center justify-center animate-pop-in"
              style={{
                background: "linear-gradient(135deg, #0055d8 0%, #4a90e2 100%)",
                boxShadow:
                  "0 0 0 12px rgba(0,85,216,0.2), 0 0 0 28px rgba(0,85,216,0.1), 0 0 80px rgba(0,85,216,0.6)",
              }}
            >
              <svg
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline
                  points="20 6 9 17 4 12"
                  style={{
                    strokeDasharray: 30,
                    strokeDashoffset: 30,
                    animation: "drawCheck 0.6s 0.3s ease forwards",
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Text — pulled up closer to the circle */}
          <div className="flex flex-col items-center -mt-16">
            <p className="text-white text-4xl font-extrabold tracking-tight animate-fade-in [animation-delay:0.4s]">
              Тавтай морил! 🎉
            </p>

            {foundOrgName && (
              <div className="mt-5 text-center animate-fade-in [animation-delay:0.5s]">
                <p className="text-xs uppercase tracking-[0.35em] text-primary-200/70 mb-1">
                  Байгууллага
                </p>
                <p
                  className="text-5xl md:text-6xl font-black tracking-tight"
                  style={{
                    background: "linear-gradient(90deg,#ffffff 0%, #9ed0ff 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 18px rgba(120,190,255,.45), 0 0 40px rgba(0,120,255,.25)",
                  }}
                >
                  {foundOrgName}
                </p>
                <div className="mt-2 flex items-center justify-center gap-2 opacity-70">
                  <div className="w-8 h-px bg-primary-200/50" />
                  <div className="w-2 h-2 rounded-full bg-primary-200 animate-pulse" />
                  <div className="w-8 h-px bg-primary-200/50" />
                </div>
              </div>
            )}

            <p
              className={`text-4xl md:text-5xl font-extrabold animate-fade-in [animation-delay:0.6s]${foundOrgName ? " mt-2" : " mt-4"}`}
              style={{ color: "#ffd580" }}
            >
              {foundName}
            </p>

            <div
              className="mt-6 px-6 py-2.5 rounded-full text-sm font-semibold text-white/80 animate-fade-in [animation-delay:0.65s]"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              Манай ажилтнаас тэмдэг авна уу ➤
            </div>
          </div>
        </div>
      </div>
    );
  }

  // error / already
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center animate-fade-in"
      style={{
        background:
          "linear-gradient(160deg, rgba(15,20,60,0.97) 0%, rgba(0,10,40,0.98) 100%)",
        backdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <div
        className="w-52 h-52 rounded-full flex flex-col items-center justify-center animate-shake-in"
        style={{
          background: "linear-gradient(135deg, #c0392b, #e74c3c)",
          boxShadow:
            "0 0 0 12px rgba(192,57,43,0.2), 0 0 0 28px rgba(192,57,43,0.1), 0 0 70px rgba(192,57,43,0.5)",
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <span className="text-white mt-3 text-sm font-bold">{errMsg}</span>
      </div>
    </div>
  );
}