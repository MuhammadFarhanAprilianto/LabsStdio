import Image from "next/image";

export default function Logo({
  className = "h-11 w-auto",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* P-LOGO WebP Image with Black Background */}
      <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-black border border-neutral-800/90 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
        <Image
          src="/images/P-LOGO.webp"
          alt="LabStdio Logo"
          fill
          className="object-contain p-1"
          priority
        />
      </div>

      {/* Brand Typography with Font Questrial & Kuning Stabilo */}
      <div className="flex items-baseline gap-1.5 font-['Questrial',sans-serif]">
        <span
          className={`font-bold text-lg sm:text-xl tracking-tight transition-colors duration-500 ${
            inverted ? "text-white" : "text-black"
          }`}
        >
          LabStdio
        </span>
        <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-black text-[#d4f938] border border-neutral-800 shadow-sm">
          Agency.
        </span>
      </div>
    </div>
  );
}
