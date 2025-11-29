import { Logo } from "@/components/ui/Logo";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <Logo size="lg" />
        <div className="h-1 w-32 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-full animate-indeterminate-bar bg-gradient-to-r from-[#CE1126] via-[#FCD116] to-[#0072C6]"></div>
        </div>
      </div>
    </div>
  );
}
