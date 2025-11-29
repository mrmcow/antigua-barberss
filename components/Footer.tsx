import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12 px-6 rounded-t-[3rem] -mt-12 relative z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)]">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
          <Logo size="sm" theme="dark" />
          <p className="text-gray-400 text-sm font-medium max-w-xs md:max-w-none">
            Connecting the community with the best grooming professionals in Antigua & Barbuda.
          </p>
        </div>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <Link href="/blog" className="hover:text-[#CE1126] transition-colors">
            Blog
          </Link>
          <Link href="/about" className="hover:text-[#CE1126] transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-[#CE1126] transition-colors">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-[#CE1126] transition-colors">
            Privacy
          </Link>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto mt-12 pt-6 border-t border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
        <span>© 2025 Antigua Barbers</span>
        <span>Made in St. John's</span>
      </div>
    </footer>
  );
}
