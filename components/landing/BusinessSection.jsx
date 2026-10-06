"use client";

import Image from "next/image";
import { Users, ArrowRight, FolderLock } from "lucide-react";

export default function BusinessSection() {
  // Track mouse per individual card for dynamic specular gloss identical to Section 2
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <section id="business" className="relative py-28 sm:py-36 bg-[#07070a] text-white border-t border-white/10 overflow-hidden">
      {/* Subtle ambient abyss glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff3b19]/8 rounded-full blur-[180px] pointer-events-none" />

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Area: Problem Statement, Description, Shiny Glass Cards & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
              What happens to your business <br />
              <span className="text-[#ff3b19]">AFTER YOU?</span>
            </h2>

            <p className="mt-6 text-base sm:text-lg text-white/75 font-normal leading-relaxed">
              Founders and key executives are often the sole custodians of essential corporate intelligence: bank signing powers, cloud root keys, cap table records, and emergency handover directives. If an unforeseen accident occurs, companies freeze.
            </p>

            {/* Safeguard Feature Cards - Glassmorphically identical to Section 2 */}
            <div className="mt-10 space-y-6">
              <div
                onMouseMove={handleCardMouseMove}
                className="group/card relative shiny-glass-card rounded-2xl p-7 sm:p-8 transition-all"
              >
                <div className="flex items-start gap-5 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#ff3b19]/15 border border-[#ff3b19]/30 text-[#ff3b19] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover/card:scale-105 shadow-[0_0_25px_rgba(255,59,25,0.15)]">
                    <FolderLock size={24} className="text-[#ff3b19]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                      Automated Drive &amp; Document Release
                    </h4>
                    <p className="text-xs sm:text-sm text-white/70 mt-1.5 leading-relaxed">
                      Store sensitive files in your Google Drive or secure vault. Vigil only shares access with your co-founders if you fail to check in.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onMouseMove={handleCardMouseMove}
                className="group/card relative shiny-glass-card rounded-2xl p-7 sm:p-8 transition-all"
              >
                <div className="flex items-start gap-5 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#ff3b19]/15 border border-[#ff3b19]/30 text-[#ff3b19] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover/card:scale-105 shadow-[0_0_25px_rgba(255,59,25,0.15)]">
                    <Users size={24} className="text-[#ff3b19]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                      Tiered Recipient Routing
                    </h4>
                    <p className="text-xs sm:text-sm text-white/70 mt-1.5 leading-relaxed">
                      Deliver technical passwords to the CTO, legal agreements to corporate counsel, and financial keys strictly to the Board.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Link */}
            <div className="mt-10">
              <a
                href="#actions"
                className="group inline-flex items-center gap-3 text-sm sm:text-base font-semibold text-[#ff3b19] hover:text-[#ff5233] transition-colors"
              >
                <span>Safeguard your business continuity</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
            </div>
          </div>

          {/* Right Area: Large Crisp Image Spanning the Right Half with Left Origin */}
          <div className="lg:col-span-6 flex items-center justify-start w-full">
            <div className="relative w-full aspect-[1024/572] lg:scale-105 xl:scale-115 origin-left">
              <Image
                src="/assets/sec4.jpeg"
                alt="Founder and corporate custodians continuity"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-left pointer-events-none select-none"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}




