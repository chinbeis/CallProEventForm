import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(160deg,hsl(216,100%,8%)_0%,hsl(220,100%,6%)_100%)] font-GIP">
      <div className="pointer-events-none fixed right-[-200px] top-[-300px] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,85,216,0.18)_0%,transparent_65%)]" />
      <div className="pointer-events-none fixed bottom-[-200px] left-[-200px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(102,155,233,0.1)_0%,transparent_65%)]" />

      <div className="relative z-10 w-full max-w-sm px-5">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400/70">
            CallPro Admin
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">Нэвтрэх</h1>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[rgba(100,160,255,0.15)] bg-[rgba(0,30,100,0.45)] shadow-[0_40px_80px_rgba(0,0,0,0.4)] backdrop-blur-[24px]">
          <div className="mx-auto h-px w-2/3 bg-[linear-gradient(90deg,transparent,rgba(100,160,255,0.6),transparent)]" />

          <form action={loginAction} className="space-y-4 px-7 pb-7 pt-6">
            {hasError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-400">
                Нэр эсвэл нууц үг буруу байна
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-[0.15em] text-blue-300/70">
                Хэрэглэгчийн нэр
              </label>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-[rgba(100,160,255,0.18)] bg-[rgba(0,20,80,0.6)] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="username"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-[0.15em] text-blue-300/70">
                Нууц үг
              </label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-[rgba(100,160,255,0.18)] bg-[rgba(0,20,80,0.6)] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[linear-gradient(135deg,#0055d8_0%,#4a8fe0_100%)] py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,85,216,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,85,216,0.6)] active:scale-[0.98]"
            >
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
