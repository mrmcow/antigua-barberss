import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy - Antigua Barbers",
  description: "How we handle your data. Simple, transparent, and respectful.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="pt-32 pb-24 px-4 sm:px-6 max-w-[800px] mx-auto">
        
        <div className="mb-16">
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#1a1a1a] mb-6">
                Privacy Policy
          </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed border-l-4 border-[#CE1126] pl-6">
                We keep it simple. We don't sell your data, we don't spam you, and we respect your privacy. 
                Here is exactly what we do.
          </p>
        </div>

        <div className="space-y-16">
          <section>
                <h2 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">1</span>
                    What We Collect
                </h2>
                <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
                    <ul className="space-y-4 text-gray-600 font-medium text-sm sm:text-base">
                        <li className="flex items-start gap-3">
                            <span className="text-[#0072C6] text-lg">•</span>
                            <span><strong>Usage Data:</strong> We track which pages you visit to understand which barbers are popular.</span>
                </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#0072C6] text-lg">•</span>
                            <span><strong>Location:</strong> If you use the "Near Me" feature, we access your location once to calculate distance. We do not store this.</span>
                </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[#0072C6] text-lg">•</span>
                            <span><strong>Contact Info:</strong> If you email us, we have your email address. That's it.</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
                <h2 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">2</span>
                    Third Parties
                </h2>
                <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
                    <p className="text-gray-600 font-medium leading-relaxed mb-4">
                        We use <strong>Google Maps</strong> to show barber locations. Their privacy policy applies when you interact with the maps.
                </p>
                    <p className="text-gray-600 font-medium leading-relaxed">
                        We use <strong>Google Analytics</strong> to count visitors. All data is anonymized. We don't know who you are, just that someone visited.
              </p>
            </div>
          </section>

          <section>
                <h2 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">3</span>
                    Your Rights
                </h2>
                <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
                    <p className="text-gray-600 font-medium leading-relaxed mb-6">
                        Want us to delete any data we might have? Just ask.
                    </p>
                    <a href="mailto:hello@antiguabarbers.com" className="text-[#CE1126] font-bold uppercase tracking-widest text-xs hover:underline">
                        hello@antiguabarbers.com
              </a>
                </div>
          </section>
        </div>

      </main>
      <Footer />
    </div>
  );
}
