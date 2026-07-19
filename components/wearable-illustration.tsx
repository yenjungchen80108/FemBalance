export function WearableIllustration() {
  return (
    <svg
      viewBox="0 0 320 400"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs mx-auto"
    >
      {/* Watch band */}
      <rect
        x="110"
        y="0"
        width="100"
        height="90"
        rx="20"
        fill="#F0F0F0"
        stroke="#D8D8D8"
      />
      <rect
        x="110"
        y="310"
        width="100"
        height="90"
        rx="20"
        fill="#F0F0F0"
        stroke="#D8D8D8"
      />

      {/* Watch body (silver bezel) */}
      <rect
        x="55"
        y="60"
        width="210"
        height="280"
        rx="44"
        fill="#E8E8E8"
        stroke="#CFCFCF"
        strokeWidth="2"
      />
      {/* Screen (black) */}
      <rect x="72" y="77" width="176" height="246" rx="32" fill="#1A1A1A" />

      {/* Crown buttons */}
      <rect x="258" y="150" width="10" height="20" rx="3" fill="#D8D8D8" />
      <rect x="258" y="185" width="10" height="30" rx="3" fill="#D8D8D8" />

      {/* Heart icon + label */}
      <path
        d="M96 108 C96 105, 92 102, 89 105 C86 102, 82 105, 82 108 C82 112, 89 117, 96 108 Z"
        fill="#E88FA0"
      />
      <text
        x="103"
        y="112"
        fontSize="13"
        fill="white"
        fontFamily="sans-serif"
        fontWeight="500"
      >
        Heart Rate
      </text>
      <text
        x="205"
        y="112"
        fontSize="12"
        fill="#9CA3AF"
        fontFamily="sans-serif"
      >
        10:09
      </text>

      {/* BPM number */}
      <text
        x="85"
        y="155"
        fontSize="42"
        fill="white"
        fontFamily="serif"
        fontWeight="600"
      >
        72
      </text>
      <text
        x="140"
        y="150"
        fontSize="14"
        fill="#E88FA0"
        fontFamily="sans-serif"
        fontWeight="500"
      >
        BPM
      </text>
      <text x="85" y="172" fontSize="11" fill="#6B7280" fontFamily="sans-serif">
        Current
      </text>

      {/* Divider */}
      <line
        x1="85"
        y1="185"
        x2="235"
        y2="185"
        stroke="#333"
        strokeWidth="1"
        strokeDasharray="2,2"
      />

      {/* Heart rate waveform */}
      <path
        d="M85 225 L100 225 L108 210 L118 240 L126 218 L134 225 L235 225"
        fill="none"
        stroke="#E88FA0"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="235" cy="225" r="3.5" fill="#E88FA0" />

      {/* Axis labels */}
      <text x="85" y="252" fontSize="9" fill="#6B7280" fontFamily="sans-serif">
        00:00
      </text>
      <text x="150" y="252" fontSize="9" fill="#6B7280" fontFamily="sans-serif">
        12:00
      </text>
      <text x="210" y="252" fontSize="9" fill="#6B7280" fontFamily="sans-serif">
        24:00
      </text>

      {/* Temperature section */}
      <circle cx="90" cy="278" r="4" fill="#9CB89A" />
      <text
        x="100"
        y="283"
        fontSize="12"
        fill="white"
        fontFamily="sans-serif"
        fontWeight="500"
      >
        Body Temperature
      </text>

      <text
        x="85"
        y="315"
        fontSize="32"
        fill="white"
        fontFamily="serif"
        fontWeight="600"
      >
        36.6
      </text>
      <text
        x="135"
        y="310"
        fontSize="13"
        fill="#9CB89A"
        fontFamily="sans-serif"
      >
        °C
      </text>
      <text x="85" y="330" fontSize="10" fill="#6B7280" fontFamily="sans-serif">
        Current
      </text>
    </svg>
  );
}
