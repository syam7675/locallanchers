import React from "react";
export function WoodenBirdSculpture({
  coworker,
}: {
  coworker: "Jay" | "Myna" | "Robin";
}) {
  if (coworker === "Jay") {
    return (
      <svg
        viewBox="0 0 560 400"
        className="w-full h-full max-h-[380px] object-contain select-none drop-shadow-xl"
        role="img"
        aria-label="Jay handcrafted blue wooden bird sculpture in flight"
      >
        <defs>
          <linearGradient id="jayWingBack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#658BB4" />
            <stop offset="50%" stopColor="#436A95" />
            <stop offset="100%" stopColor="#26476E" />
          </linearGradient>
          <linearGradient
            id="jayBodySculpt"
            x1="15%"
            y1="10%"
            x2="85%"
            y2="90%"
          >
            <stop offset="0%" stopColor="#4A77A8" />
            <stop offset="45%" stopColor="#2B5482" />
            <stop offset="100%" stopColor="#173354" />
          </linearGradient>
          <linearGradient id="jayWingFront" x1="0%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#5282B5" />
            <stop offset="50%" stopColor="#315B8A" />
            <stop offset="100%" stopColor="#1B395C" />
          </linearGradient>
          <linearGradient
            id="birchEyePatch"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#F5DEC0" />
            <stop offset="55%" stopColor="#E5C090" />
            <stop offset="100%" stopColor="#C89B64" />
          </linearGradient>
          <linearGradient id="beakMatte" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B5575" />
            <stop offset="100%" stopColor="#1B2A3D" />
          </linearGradient>
        </defs>

        <path
          d="M145 55 C225 82, 290 125, 325 180 C260 225, 195 230, 155 185 C135 162, 128 95, 145 55 Z"
          fill="url(#jayWingBack)"
        />
        <path
          d="M162 85 C215 108, 262 140, 290 175"
          stroke="#7FA3C9"
          strokeWidth="1.5"
          strokeOpacity="0.35"
          fill="none"
        />
        <path
          d="M155 115 C202 135, 245 160, 272 190"
          stroke="#7FA3C9"
          strokeWidth="1.5"
          strokeOpacity="0.25"
          fill="none"
        />
        <path
          d="M275 235 C285 310, 325 360, 395 360 C445 360, 470 315, 455 245 Z"
          fill="#1B385B"
        />
        <path
          d="M250 185 C255 120, 315 88, 375 95 C430 102, 462 155, 448 228 C436 285, 375 305, 305 285 C265 274, 246 232, 250 185 Z"
          fill="url(#jayBodySculpt)"
        />
        <path
          d="M262 246 C315 268, 385 265, 442 238"
          stroke="#10243D"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M300 162 C328 136, 368 122, 385 118 C392 148, 392 186, 378 206 C362 228, 322 225, 302 204 C288 190, 288 173, 300 162 Z"
          fill="url(#birchEyePatch)"
        />
        <circle cx="342" cy="182" r="18" fill="#1E1D1B" />
        <circle cx="336" cy="176" r="4" fill="#3D3B38" />
        <path
          d="M262 192 L218 212 C214 214, 214 220, 219 222 L265 226 C272 215, 270 200, 262 192 Z"
          fill="url(#beakMatte)"
        />
        <path
          d="M368 232 C412 162, 458 105, 488 78 C502 88, 498 145, 472 215 C445 285, 405 318, 372 292 C356 279, 355 252, 368 232 Z"
          fill="url(#jayWingFront)"
        />
        <path
          d="M385 255 C420 195, 456 140, 482 105"
          stroke="#7CA2CC"
          strokeWidth="1.5"
          strokeOpacity="0.3"
          fill="none"
        />
      </svg>
    );
  }

  if (coworker === "Myna") {
    return (
      <svg
        viewBox="0 0 560 400"
        className="w-full h-full max-h-[380px] object-contain select-none drop-shadow-xl"
        role="img"
        aria-label="Myna handcrafted green and ochre wooden bird sculpture"
      >
        <defs>
          <linearGradient id="mynaBodyFull" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#4F7E59" />
            <stop offset="50%" stopColor="#2E5838" />
            <stop offset="100%" stopColor="#193520" />
          </linearGradient>
          <linearGradient id="mynaWingFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#659670" />
            <stop offset="100%" stopColor="#25492D" />
          </linearGradient>
          <linearGradient id="mynaBirch" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F6E2C3" />
            <stop offset="100%" stopColor="#CFA26A" />
          </linearGradient>
        </defs>
        <path
          d="M260 220 C265 305, 310 365, 385 365 C445 365, 475 310, 460 230 Z"
          fill="#1D3B24"
        />
        <path
          d="M235 175 C242 108, 305 78, 372 86 C432 94, 465 152, 448 228 C432 290, 365 305, 292 282 C252 269, 230 225, 235 175 Z"
          fill="url(#mynaBodyFull)"
        />
        <path
          d="M248 238 C305 262, 382 260, 442 232"
          stroke="#132818"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M285 150 C318 122, 362 114, 382 112 C390 145, 388 184, 372 204 C354 226, 312 222, 290 198 C276 182, 274 162, 285 150 Z"
          fill="url(#mynaBirch)"
        />
        <circle cx="330" cy="172" r="17.5" fill="#1C1917" />
        <circle cx="324" cy="166" r="4" fill="#44403C" />
        <path
          d="M246 180 L196 200 C191 202, 191 208, 196 210 L248 216 C256 204, 254 188, 246 180 Z"
          fill="#D99B26"
        />
        <path
          d="M348 215 C395 168, 452 142, 495 135 C505 155, 492 212, 458 265 C422 318, 378 325, 350 292 C334 272, 332 238, 348 215 Z"
          fill="url(#mynaWingFull)"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 560 400"
      className="w-full h-full max-h-[380px] object-contain select-none drop-shadow-xl"
      role="img"
      aria-label="Robin handcrafted coral red wooden bird sculpture"
    >
      <defs>
        <linearGradient id="robinBodyFull" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#E65A43" />
          <stop offset="50%" stopColor="#C13822" />
          <stop offset="100%" stopColor="#851F10" />
        </linearGradient>
        <linearGradient id="robinWingFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A4542" />
          <stop offset="100%" stopColor="#23201E" />
        </linearGradient>
        <linearGradient id="robinBirch" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F7E4C6" />
          <stop offset="100%" stopColor="#D3A56D" />
        </linearGradient>
      </defs>
      <path
        d="M260 220 C265 305, 310 365, 385 365 C445 365, 475 310, 460 230 Z"
        fill="#7C1D10"
      />
      <path
        d="M235 175 C242 108, 305 78, 372 86 C432 94, 465 152, 448 228 C432 290, 365 305, 292 282 C252 269, 230 225, 235 175 Z"
        fill="url(#robinBodyFull)"
      />
      <path
        d="M248 238 C305 262, 382 260, 442 232"
        stroke="#6B180C"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M285 150 C318 122, 362 114, 382 112 C390 145, 388 184, 372 204 C354 226, 312 222, 290 198 C276 182, 274 162, 285 150 Z"
        fill="url(#robinBirch)"
      />
      <circle cx="330" cy="172" r="17.5" fill="#1C1917" />
      <circle cx="324" cy="166" r="4" fill="#44403C" />
      <path
        d="M246 180 L198 200 C193 202, 193 208, 198 210 L248 216 C256 204, 254 188, 246 180 Z"
        fill="#2E2622"
      />
      <path
        d="M348 215 C395 168, 452 142, 495 135 C505 155, 492 212, 458 265 C422 318, 378 325, 350 292 C334 272, 332 238, 348 215 Z"
        fill="url(#robinWingFull)"
      />
    </svg>
  );
}
