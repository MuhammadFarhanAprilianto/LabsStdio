export default function Logo({
  className = "h-11 w-auto",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Origami / Low-Poly 'P' Icon */}
      <svg
        viewBox="0 0 160 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto shrink-0 transition-all duration-500"
      >
        {inverted ? (
          <>
            {/* White / Platinum Silver Facets for Dark Liquid Glass */}
            <polygon points="15,48 65,12 65,58" fill="#FFFFFF" />
            <polygon points="65,12 145,58 65,58" fill="#E2E8F0" />
            <polygon points="145,58 126,108 65,58" fill="#94A3B8" />
            <polygon points="65,58 126,108 65,108" fill="#CBD5E1" />
            <polygon points="15,48 65,58 65,108" fill="#F8FAFC" />
            <polygon points="15,48 65,108 15,142" fill="#E2E8F0" />
            <polygon points="15,142 65,108 65,142" fill="#94A3B8" />
            <polygon points="15,142 35,155 15,170" fill="#FFFFFF" />
            <polygon points="15,170 35,155 52,170" fill="#94A3B8" />
          </>
        ) : (
          <>
            {/* Dark Facets for Light Mode */}
            <polygon points="15,48 65,12 65,58" fill="#000000" />
            <polygon points="65,12 145,58 65,58" fill="#141414" />
            <polygon points="145,58 126,108 65,58" fill="#2d2d2d" />
            <polygon points="65,58 126,108 65,108" fill="#181818" />
            <polygon points="15,48 65,58 65,108" fill="#000000" />
            <polygon points="15,48 65,108 15,142" fill="#050505" />
            <polygon points="15,142 65,108 65,142" fill="#2a2a2a" />
            <polygon points="15,142 35,155 15,170" fill="#000000" />
            <polygon points="15,170 35,155 52,170" fill="#2c2c2c" />
          </>
        )}
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-light tracking-[0.18em] text-[15px] uppercase transition-colors duration-500 ${
            inverted ? "text-gray-300" : "text-gray-900"
          }`}
        >
          ROMETHEAN
        </span>
        <span
          className={`font-extrabold tracking-tight text-[26px] -mt-0.5 transition-colors duration-500 ${
            inverted ? "text-white" : "text-gray-950"
          }`}
        >
          Labs<span className={inverted ? "text-blue-400" : "text-gray-900"}>.</span>
        </span>
      </div>
    </div>
  );
}
