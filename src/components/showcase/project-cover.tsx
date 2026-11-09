import type { PortfolioProject } from "@/content/projects";

export function ProjectCover({ kind }: { kind: PortfolioProject["cover"] }) {
  if (kind === "themes")
    return (
      <svg viewBox="0 0 400 260" fill="none" aria-hidden="true">
        <ellipse cx="203" cy="231" rx="125" ry="12" fill="#d5c7f6" />
        <rect
          x="68"
          y="51"
          width="215"
          height="143"
          rx="14"
          transform="rotate(-12 68 51)"
          fill="#d5b5f7"
          stroke="#bf9ded"
        />
        <rect
          x="118"
          y="47"
          width="215"
          height="143"
          rx="14"
          transform="rotate(10 118 47)"
          fill="#bfb5fa"
          stroke="#a99aee"
        />
        <rect
          x="91"
          y="63"
          width="220"
          height="150"
          rx="14"
          fill="white"
          stroke="#dacdf1"
        />
        <path d="M91 91H311" stroke="#e9e1f6" />
        <circle cx="107" cy="77" r="3" fill="#ec64ad" />
        <circle cx="119" cy="77" r="3" fill="#ffb35c" />
        <circle cx="131" cy="77" r="3" fill="#a98be6" />
        <text
          x="112"
          y="162"
          fontSize="63"
          fontWeight="500"
          letterSpacing="-5"
          fill="#7850d9"
          fontFamily="Space Grotesk Variable, sans-serif"
        >
          20
        </text>
        <rect x="211" y="121" width="72" height="8" rx="4" fill="#e1d8f5" />
        <rect x="211" y="140" width="53" height="6" rx="3" fill="#eee7fa" />
        <rect x="211" y="156" width="65" height="6" rx="3" fill="#eee7fa" />
        <circle cx="122" cy="188" r="5" fill="#9171df" />
        <circle cx="139" cy="188" r="5" fill="#ef8fc3" />
        <circle cx="156" cy="188" r="5" fill="#ffbe73" />
        <circle cx="173" cy="188" r="5" fill="#81b7d2" />
        <path
          d="M329 41v18m-9-9h18M55 175v14m-7-7h14"
          stroke="#aa8bd8"
          strokeWidth="1.5"
        />
      </svg>
    );
  if (kind === "scraper")
    return (
      <svg viewBox="0 0 400 260" fill="none" aria-hidden="true">
        <ellipse cx="214" cy="225" rx="91" ry="12" fill="#f0cadf" />
        <path
          d="M86 72C142 72 120 140 178 140M323 68C279 68 292 136 242 136M318 191C282 191 279 170 246 170"
          stroke="#db8eb7"
          strokeWidth="2"
          strokeDasharray="4 5"
        />
        <rect
          x="42"
          y="39"
          width="90"
          height="67"
          rx="10"
          transform="rotate(-9 42 39)"
          fill="white"
          stroke="#e6bdd3"
        />
        <rect x="57" y="55" width="45" height="5" rx="2.5" fill="#e5a5ca" />
        <rect x="57" y="69" width="60" height="4" rx="2" fill="#f0dce8" />
        <rect x="57" y="81" width="38" height="4" rx="2" fill="#f0dce8" />
        <rect
          x="281"
          y="35"
          width="77"
          height="57"
          rx="10"
          transform="rotate(9 281 35)"
          fill="white"
          stroke="#e6bdd3"
        />
        <rect
          x="293"
          y="53"
          width="43"
          height="5"
          rx="2.5"
          transform="rotate(9 293 53)"
          fill="#d6c4ec"
        />
        <path
          d="M294 68L330 73"
          stroke="#ecdfea"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect
          x="292"
          y="167"
          width="65"
          height="48"
          rx="9"
          transform="rotate(-7 292 167)"
          fill="#fff9fd"
          stroke="#e6bdd3"
        />
        <path
          d="M306 183L340 179M306 194L331 191"
          stroke="#e4c5d8"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M156 113V192C156 218 259 218 259 192V113Z"
          fill="#fcecf7"
          stroke="#d898c4"
        />
        <ellipse
          cx="207.5"
          cy="113"
          rx="51.5"
          ry="19"
          fill="white"
          stroke="#d898c4"
        />
        <path
          d="M156 142C156 168 259 168 259 142M156 168C156 194 259 194 259 168"
          stroke="#d898c4"
        />
        <path
          d="M205 132V183M188 168L205 185L222 168"
          stroke="#b75a98"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="166" cy="55" r="7" fill="#ffb873" />
        <path d="M225 38v14m-7-7h14" stroke="#d58db9" strokeWidth="1.5" />
      </svg>
    );
  return (
    <svg viewBox="0 0 400 260" fill="none" aria-hidden="true">
      <ellipse cx="204" cy="226" rx="126" ry="12" fill="#f1d9b6" />
      <rect x="81" y="59" width="240" height="160" rx="12" fill="#e9caa6" />
      <rect
        x="73"
        y="49"
        width="240"
        height="160"
        rx="12"
        fill="white"
        stroke="#e6c9a6"
      />
      <path d="M73 76H313" stroke="#f2e4d2" />
      <circle cx="90" cy="63" r="3" fill="#f4ac69" />
      <circle cx="102" cy="63" r="3" fill="#e2c09b" />
      <circle cx="114" cy="63" r="3" fill="#d6c8ad" />
      <rect x="92" y="96" width="92" height="9" rx="4.5" fill="#d1b294" />
      <rect x="92" y="115" width="74" height="7" rx="3.5" fill="#eddfcf" />
      <rect x="92" y="133" width="84" height="5" rx="2.5" fill="#f2e9df" />
      <rect x="92" y="146" width="67" height="5" rx="2.5" fill="#f2e9df" />
      <rect x="92" y="171" width="56" height="18" rx="9" fill="#f4b976" />
      <path d="M222 94L277 107L291 162L236 149Z" fill="#fecb8f" />
      <path d="M222 94L209 139L236 184L236 149Z" fill="#eca96a" />
      <path d="M236 149L291 162L264 198L236 184Z" fill="#f4bd7f" />
      <path d="M222 94L236 149L291 162" stroke="#ffe1ba" strokeWidth="1.5" />
      <path d="M329 144L351 165L339 167L334 180Z" fill="#cc9163" />
      <path d="M50 91v14m-7-7h14" stroke="#d1a878" strokeWidth="1.5" />
    </svg>
  );
}
