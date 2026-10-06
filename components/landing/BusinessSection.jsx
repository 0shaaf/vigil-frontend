"use client";

import Image from "next/image";
import { Users, ArrowRight, FolderLock } from "lucide-react";

export default function BusinessSection() {
  return (
    <section id="business" className="relative py-20 sm:py-28 bg-[#07070a] text-white border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column: Specially Designed Illustration (Submerged Naturally) */}
          <div className="lg:col-span-7 flex justify-center items-center w-full">
            <div className="relative w-full aspect-[1024/572]">
              <Image
                src="/assets/sec4.jpeg"
                alt="Founder and corporate custodians continuity illustration"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 58vw"
                className="object-contain object-center select-none"
              />
            </div>
          </div>

          {/* Right Column: Problem + Solution Copy */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <h2 className="font-['Space_Grotesk'] text-2xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
              The company&apos;s master keys live in your head. <br />
              <span className="text-[#ff3b19]">What if you vanish tomorrow?</span>
            </h2>

            <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/70 font-normal leading-relaxed">
              Founders and key executives are often the sole custodians of essential corporate intelligence: bank signing powers, cloud root keys, cap table records, and emergency handover directives. If an unforeseen accident occurs, companies freeze.
            </p>

            <div className="mt-7 sm:mt-8 space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4 hover:border-white/20 transition-colors">
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

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4 hover:border-white/20 transition-colors">
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

            <div className="mt-7 sm:mt-8">
              <a
                href="#actions"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff3b19] hover:text-[#ff5233] transition-colors"
              >
                <span>Safeguard your business continuity</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

