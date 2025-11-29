import Link from "next/link";
import { Check, MessageCircle, Mail, ArrowRight, Ship, Search, BadgeCheck } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-black text-white rounded-b-[3rem]">
        <div className="max-w-[800px] mx-auto text-center">
          <span className="text-[#FCD116] font-bold tracking-widest uppercase text-xs mb-6 block animate-pulse">
            For Barbers & Shops
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8 leading-none">
            Get <span className="text-[#CE1126]">Listed</span>.
            <br />
            Get <span className="text-[#0072C6]">Booked</span>.
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-12">
            Join Antigua's official barber directory. Connect with cruise passengers, tourists, and locals looking for their next cut.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/12687797231?text=Hi%20Antigua%20Barbers,%20I%20want%20to%20list%20my%20shop" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-1"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
            <a 
              href="mailto:antiguabarbers@gmail.com?subject=List%20My%20Shop"
              className="bg-white/10 border-2 border-white/20 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#CE1126]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ship className="w-8 h-8 text-[#CE1126]" />
              </div>
              <h3 className="text-xl font-black uppercase mb-4">Cruise Traffic</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We specifically target cruise passengers looking for a quick, safe cut near Heritage Quay.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FCD116]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-[#bc9b0a]" />
              </div>
              <h3 className="text-xl font-black uppercase mb-4">Google Visibility</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our site ranks for keywords locals and tourists actually use to find barbers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0072C6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BadgeCheck className="w-8 h-8 text-[#0072C6]" />
              </div>
              <h3 className="text-xl font-black uppercase mb-4">Verified Badge</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stand out as a trusted professional. Build reputation with verified reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Simple Steps */}
      <section className="py-16 px-6 bg-gray-50 rounded-[3rem]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-3xl font-black uppercase text-center mb-12">How It Works</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="font-bold text-lg mb-1">Send us your details</h4>
                <p className="text-gray-600 text-sm">Name, location, phone number, and a few photos of your work.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="font-bold text-lg mb-1">We verify & build your page</h4>
                <p className="text-gray-600 text-sm">We check your info and create a professional profile for you.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h4 className="font-bold text-lg mb-1">Go live</h4>
                <p className="text-gray-600 text-sm">You'll get a unique link (antiguabarbers.com/your-shop) to share with clients.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="font-bold mb-4">Ready to start?</p>
            <a 
              href="https://wa.me/12687797231?text=Hi%20Antigua%20Barbers,%20I%20want%20to%20list%20my%20shop" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#CE1126] font-black uppercase tracking-wider hover:gap-4 transition-all"
            >
              Message on WhatsApp <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
