"use client";

import Image from "next/image";
import { KeyRound, Users, ShieldAlert, ArrowRight, FolderLock, FileCheck } from "lucide-react";

export default function BusinessSection() {
  return (
    <section id="business" className="relative py-28 bg-[#07070a] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Problem + Solution */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff3b19]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#ff3b19]">
                03 // Founders, Executives &amp; Custodians
              </span>
            </div>

            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
              The company&apos;s master keys live in your head. <br />
              <span className="text-[#ff3b19]">What if you vanish tomorrow?</span>
            </h2>

            <p className="mt-6 text-base sm:text-lg text-white/70 font-normal leading-relaxed">
              Founders and key executives are often the sole custodians of essential corporate intelligence: bank signing powers, cloud root keys, cap table records, and emergency handover directives. If an unforeseen accident occurs, companies freeze.
            </p>

            <div className="mt-8 space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4">
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

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4">
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

            <div className="mt-8">
              <a
                href="#actions"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff3b19] hover:text-[#ff5233] transition-colors"
              >
                <span>Safeguard your business continuity</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>

          {/* Right Column: Graphic Depiction */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] rounded-2xl overflow-hidden border-2 border-white/15 bg-black">
              <Image
                src="/assets/executive-vault.jpg"
                alt="Executive standing in front of a monolithic secure digital vault"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center filter contrast-105"
              />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/85 backdrop-blur-md border border-white/10">
                <div className="text-[11px] font-semibold text-[#ff3b19] uppercase tracking-wider">
                  Cryptographic Custody Escrow
                </div>
                <div className="text-xs text-white/80 font-medium mt-0.5">
                  Your co-founders receive the keys only when emergency silence is verified.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
