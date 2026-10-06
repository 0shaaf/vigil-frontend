"use client";

import Image from "next/image";
import { Users, ArrowRight, FolderLock } from "lucide-react";

export default function BusinessSection() {
  return (
    <section id="business" className="relative py-24 sm:py-32 bg-[#07070a] text-white border-t border-white/10 overflow-hidden">
      {/* Background Graphic: Absolute, enlarged, centered in the middle with blur effect on top */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0">
        <div className="relative w-full max-w-6xl aspect-[1024/572] scale-110 sm:scale-125 lg:scale-135 opacity-40 sm:opacity-50 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_40%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_40%,transparent_100%)]">
          <Image
            src="/assets/sec4.jpeg"
            alt="Founder and corporate custodians continuity illustration"
            fill
            priority
            sizes="100vw"
            className="object-contain object-center filter blur-[2px]"
          />
        </div>
        {/* Blur effect overlay sitting right on top of the image */}
        <div className="absolute inset-0 backdrop-blur-[5px] bg-[#07070a]/45 pointer-events-none" />
      </div>

      {/* Foreground Content: Prominently centered with high-legibility glassmorphic cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <h2 className="font-['Space_Grotesk'] text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
          The company&apos;s master keys live in your head. <br />
          <span className="text-[#ff3b19]">What if you vanish tomorrow?</span>
        </h2>

        <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/75 font-normal leading-relaxed max-w-2xl mx-auto">
          Founders and key executives are often the sole custodians of essential corporate intelligence: bank signing powers, cloud root keys, cap table records, and emergency handover directives. If an unforeseen accident occurs, companies freeze.
        </p>

        {/* 2 Safeguard Feature Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto text-left">
          <div className="p-5 rounded-2xl bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 flex items-start gap-4 hover:border-white/25 transition-all hover:bg-[#0a0a0f]/95 shadow-xl shadow-black/50">
            <div className="w-10 h-10 rounded-lg bg-[#ff3b19]/20 text-[#ff3b19] flex items-center justify-center shrink-0">
              <FolderLock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Automated Drive &amp; Document Release</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Store sensitive files in your Google Drive or secure vault. Vigil only shares access with your co-founders if you fail to check in.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 flex items-start gap-4 hover:border-white/25 transition-all hover:bg-[#0a0a0f]/95 shadow-xl shadow-black/50">
            <div className="w-10 h-10 rounded-lg bg-[#ff3b19]/20 text-[#ff3b19] flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Tiered Recipient Routing</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Deliver technical passwords to the CTO, legal agreements to corporate counsel, and financial keys strictly to the Board.
              </p>
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div className="mt-10">
          <a
            href="#actions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff3b19] hover:text-[#ff5233] transition-colors"
          >
            <span>Safeguard your business continuity</span>
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}


