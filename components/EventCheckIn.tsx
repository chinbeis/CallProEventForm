"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { checkInByCodeAction } from "@/app/actions/attendees";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ParticleBG } from "@/components/atoms/ParticleBG";
import { StatusOverlay } from "@/components/atoms/statusOverlay";
import type { DB, EventCheckinProps, Status } from "@/lib/types";

const CODE_LENGTH = 6;

export default function EventCheckin({ initialDb }: EventCheckinProps) {
  const [db, setDb] = useState<DB>(initialDb);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [errMsg, setErrMsg] = useState("");
  const [foundOrgName, setFoundOrgName] = useState("");
  const [foundName, setFoundName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dismiss = useCallback(() => {
    setStatus(null);
    setCode("");
    setErrMsg("");
    setFoundOrgName("");
    setFoundName("");
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!code.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await checkInByCodeAction(code.trim());
      setDb(result.db);
      setStatus(result.status);
      setErrMsg(result.errMsg);
      setFoundOrgName(result.foundOrgName);
      setFoundName(result.foundName);
    } finally {
      setIsSubmitting(false);
    }
  }, [code, isSubmitting]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        void handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleCodeChange = useCallback((value: string) => {
    setCode(value.toUpperCase().slice(0, CODE_LENGTH));
  }, []);

  void db;

  return (
    <div className="relative overflow-hidden bg-[hsl(216,100%,7%)] font-GIP" style={{ width: '1080px', height: '1920px' }}>
      <ParticleBG />

      <Image src="/background.png" alt="" fill className="pointer-events-none z-0 object-cover" />

      <StatusOverlay
        status={status}
        foundOrgName={foundOrgName}
        foundName={foundName}
        errMsg={errMsg}
        onDismiss={dismiss}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-start pt-[100px]" style={{ height: '1920px' }}>
        {/* CallPro × Rakuten Viber logo */}
        <div className="mb-12">
          <Image
            src="/Logo.svg"
            alt="CallPro × Rakuten Viber for business"
            width={580}
            height={77}
            priority
          />
        </div>

        {/* ENTEC 26 title */}
        <div className="mb-20 w-full max-w-[1000px] px-6">
          <Image
            src="/ENTEC26.svg"
            alt="ENTEC 26"
            width={988}
            height={152}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Check-in card */}
        <div className="w-full max-w-[480px] px-5 pb-10 pt-24">
          <Card className="w-full overflow-hidden rounded-[28px] border border-[rgba(100,160,255,0.18)] bg-[rgba(0,20,80,0.82)] shadow-[0_40px_100px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.03),inset_0_1px_0_rgba(150,200,255,0.12)] backdrop-blur-[24px] animate-slide-up">
            <div className="mx-auto h-px w-2/3 bg-[linear-gradient(90deg,transparent,rgba(100,160,255,0.7),transparent)]" />

            <CardContent className="space-y-5 px-8 pb-8 pt-7">
              <Label className="block text-xs font-bold uppercase tracking-[0.2em] text-white">
                Бүртгэлийн код
              </Label>

              <div className="relative">
                <Input
                  ref={inputRef}
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="XXXXXX"
                  maxLength={CODE_LENGTH}
                  className="h-24 rounded-3xl border-[rgba(100,160,255,0.22)] bg-[rgba(0,45,140,0.45)] px-4 text-center font-mono text-[2.75rem] font-extrabold uppercase leading-none tracking-[0.45em] text-white caret-[hsl(216,75%,72%)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] placeholder:font-mono placeholder:text-[2.75rem] placeholder:font-extrabold placeholder:uppercase placeholder:leading-none placeholder:tracking-[0.45em] placeholder:text-white/12 focus-visible:ring-2 focus-visible:ring-primary-300 md:text-5xl md:placeholder:text-5xl"
                />
                {code && (
                  <div className="pointer-events-none absolute -bottom-2 left-1/2 h-4 w-3/4 -translate-x-1/2 bg-[rgba(0,85,216,0.4)] blur-xl" />
                )}
              </div>

              <button
                onClick={() => void handleSubmit()}
                disabled={isSubmitting || !code.trim()}
                className="w-full rounded-2xl bg-[linear-gradient(135deg,#0055d8_0%,#4a8fe0_50%,#669be9_100%)] py-5 text-base font-bold text-white shadow-[0_8px_32px_rgba(0,85,216,0.55),inset_0_2px_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_rgba(0,85,216,0.7),inset_0_2px_0_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Шалгаж байна..." : "Бүртгүүлэх"}
              </button>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-xs text-white/60">
            Powered by <span className="font-bold text-white">CallPro</span>
          </p>
        </div>
      </div>
    </div>
  );
}