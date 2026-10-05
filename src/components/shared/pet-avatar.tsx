import { useId } from "react";
import type { Animal, CoatKey } from "@/domain/types";
import { cn } from "@/lib/cn";

/**
 * Illustrations d'animaux générées (SVG) — aucune photo réelle dans la
 * maquette. Si `animal.photoUrl` est renseigné (futur import / upload), la
 * vraie photo est affichée à la place.
 */

interface Palette {
  base: string;
  dark: string;
  light: string;
  eye?: string;
}

const PALETTE: Record<CoatKey, Palette> = {
  cream: { base: "#E7CE9E", dark: "#C9A468", light: "#F6E9CE" },
  golden: { base: "#D8A25A", dark: "#B27A36", light: "#EFD2A0" },
  tan: { base: "#C8964F", dark: "#4A3727", light: "#E8CA90" },
  black: { base: "#3B3734", dark: "#26231F", light: "#6D6761" },
  white: { base: "#F4F1EA", dark: "#D4CDC0", light: "#FFFFFF" },
  brindle: { base: "#A67A4B", dark: "#5D4129", light: "#DDBF93" },
  grey: { base: "#A9ADB2", dark: "#7B7F86", light: "#DADCDF" },
  chocolate: { base: "#7C5439", dark: "#573721", light: "#AA7C59" },
  tabby: { base: "#B99468", dark: "#6E5236", light: "#E5D0AF" },
  ginger: { base: "#E3A56C", dark: "#BF7C44", light: "#F6D8B6" },
  siamese: { base: "#EBDCC5", dark: "#6C5040", light: "#F8EFE0" },
  bicolor: { base: "#3B3734", dark: "#26231F", light: "#F4F1EA" },
  blue: { base: "#8E99A5", dark: "#6D7883", light: "#C0C7CF" },
  tricolor: { base: "#2B2825", dark: "#1B1917", light: "#F4F1EA" },
};

const POINTY_DOGS = new Set([
  "Husky Sibérien",
  "Berger Allemand",
  "Berger Belge Malinois",
  "Berger Blanc Suisse",
  "Spitz Nain",
  "Chihuahua",
]);
const BAT_EARS = new Set(["Bouledogue français"]);

const INK = "#2B2522";

/** Paires [fond, forme organique] — pastels de la charte. */
const TONES = [
  ["#F3F6EC", "#DDE7CC"],
  ["#F7F3EC", "#E9E0D1"],
  ["#F3F6EC", "#E9E0D1"],
  ["#F7F3EC", "#DDE7CC"],
] as const;

type Look = Pick<Animal, "species" | "coat" | "breed">;

function Dog({ look, p }: { look: Look; p: Palette }) {
  const pointy = POINTY_DOGS.has(look.breed);
  const bat = BAT_EARS.has(look.breed);
  const maskStyle = look.coat === "tan" || look.coat === "brindle";
  const blaze = look.coat === "bicolor" || look.coat === "tricolor";
  const eyebrows = look.coat === "tricolor";
  const earFill =
    look.coat === "white"
      ? p.dark
      : look.coat === "bicolor" || look.coat === "tricolor"
        ? p.base
        : p.dark;
  return (
    <g>
      {/* oreilles */}
      {bat ? (
        <>
          <path d="M54 84C36 46 50 22 68 28C84 34 90 56 88 66Z" fill={p.base} />
          <path
            d="M146 84C164 46 150 22 132 28C116 34 110 56 112 66Z"
            fill={p.base}
          />
          <path
            d="M60 70C52 50 58 38 66 40C74 44 78 56 78 62Z"
            fill="#E7B3AC"
            opacity=".7"
          />
          <path
            d="M140 70C148 50 142 38 134 40C126 44 122 56 122 62Z"
            fill="#E7B3AC"
            opacity=".7"
          />
        </>
      ) : pointy ? (
        <>
          <path d="M56 78L50 20L94 54Z" fill={p.base} />
          <path d="M144 78L150 20L106 54Z" fill={p.base} />
          <path d="M60 66L58 36L80 54Z" fill="#E7B3AC" opacity=".75" />
          <path d="M140 66L142 36L120 54Z" fill="#E7B3AC" opacity=".75" />
        </>
      ) : null}
      {/* tête */}
      <ellipse cx="100" cy="100" rx="47" ry="49" fill={p.base} />
      {!bat && !pointy && (
        <>
          <path
            d="M60 64C34 64 24 108 38 142C56 146 66 118 68 86Z"
            fill={earFill}
          />
          <path
            d="M140 64C166 64 176 108 162 142C144 146 134 118 132 86Z"
            fill={earFill}
          />
        </>
      )}
      {blaze && (
        <path
          d="M100 52C91 70 91 94 95 112H105C109 94 109 70 100 52Z"
          fill={p.light}
        />
      )}
      {eyebrows && (
        <>
          <ellipse cx="78" cy="80" rx="6" ry="3.4" fill="#C8964F" />
          <ellipse cx="122" cy="80" rx="6" ry="3.4" fill="#C8964F" />
        </>
      )}
      {/* museau */}
      <ellipse
        cx="100"
        cy="124"
        rx="27"
        ry="21"
        fill={maskStyle ? p.dark : p.light}
        opacity={maskStyle ? 0.9 : 1}
      />
      <ellipse cx="100" cy="112" rx="10.5" ry="7.5" fill={INK} />
      <ellipse cx="97" cy="109.5" rx="3" ry="1.6" fill="#fff" opacity=".35" />
      <path
        d="M100 119V129M100 129C94 137 86 136 82 131M100 129C106 137 114 136 118 131"
        stroke={INK}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M92 134C96 150 104 150 108 134Z" fill="#E58C8F" opacity=".9" />
      {/* yeux */}
      <circle cx="78" cy="94" r="5.6" fill={INK} />
      <circle cx="122" cy="94" r="5.6" fill={INK} />
      <circle cx="80" cy="92" r="1.7" fill="#fff" />
      <circle cx="124" cy="92" r="1.7" fill="#fff" />
    </g>
  );
}

function Cat({ look, p }: { look: Look; p: Palette }) {
  const stripes = look.coat === "tabby";
  const siamese = look.coat === "siamese";
  const eye = siamese
    ? "#79A9CE"
    : look.coat === "ginger" || look.coat === "tabby"
      ? "#D8A63E"
      : "#A9BE6B";
  const earColor = siamese ? p.dark : p.base;
  return (
    <g>
      <path d="M52 88L46 26L98 62Z" fill={earColor} />
      <path d="M148 88L154 26L102 62Z" fill={earColor} />
      <path d="M59 74L56 42L86 62Z" fill="#E9B4AC" opacity=".8" />
      <path d="M141 74L144 42L114 62Z" fill="#E9B4AC" opacity=".8" />
      <ellipse cx="100" cy="106" rx="52" ry="45" fill={p.base} />
      {siamese && (
        <ellipse
          cx="100"
          cy="116"
          rx="30"
          ry="24"
          fill={p.dark}
          opacity=".55"
        />
      )}
      {stripes && (
        <g
          stroke={p.dark}
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity=".85"
        >
          <path d="M100 64V80" />
          <path d="M88 66L91 80" />
          <path d="M112 66L109 80" />
          <path d="M52 100L64 102" />
          <path d="M52 112L64 110" />
          <path d="M148 100L136 102" />
          <path d="M148 112L136 110" />
        </g>
      )}
      <ellipse
        cx="100"
        cy="124"
        rx="21"
        ry="15"
        fill={p.light}
        opacity={siamese ? 0.0 : 0.95}
      />
      {/* yeux */}
      <ellipse cx="76" cy="98" rx="9" ry="10" fill={eye} />
      <ellipse cx="124" cy="98" rx="9" ry="10" fill={eye} />
      <ellipse cx="76" cy="98" rx="2.6" ry="7.4" fill={INK} />
      <ellipse cx="124" cy="98" rx="2.6" ry="7.4" fill={INK} />
      <circle cx="79" cy="94" r="1.8" fill="#fff" opacity=".9" />
      <circle cx="127" cy="94" r="1.8" fill="#fff" opacity=".9" />
      <path d="M94 113H106L100 120Z" fill="#DE8F90" />
      <path
        d="M100 120V126M100 126C94 132 88 130 86 126M100 126C106 132 112 130 114 126"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".85">
        <path d="M66 118L30 112M66 124L30 126M66 130L34 140" />
        <path d="M134 118L170 112M134 124L170 126M134 130L166 140" />
      </g>
    </g>
  );
}

export function PetAvatar({
  animal,
  size = 40,
  variant = "avatar",
  className,
}: {
  animal: Pick<Animal, "species" | "coat" | "breed" | "name"> & {
    photoUrl?: string;
  };
  /** px pour l'avatar ; ignoré pour `portrait` (remplit son conteneur). */
  size?: number;
  variant?: "avatar" | "portrait";
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const p = PALETTE[animal.coat];
  const tone = TONES[
    [...animal.name].reduce((h, c) => h + c.charCodeAt(0), 0) % TONES.length
  ] as [string, string];

  if (animal.photoUrl) {
    return (
      <img
        src={animal.photoUrl}
        alt={animal.name}
        className={cn(
          "object-cover",
          variant === "avatar" ? "shrink-0 rounded-full" : "h-full w-full",
          className,
        )}
        style={variant === "avatar" ? { width: size, height: size } : undefined}
      />
    );
  }

  if (variant === "avatar") {
    return (
      <svg
        role="img"
        aria-label={animal.name}
        viewBox="14 14 172 172"
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full", className)}
        style={{ background: `${p.light}` }}
      >
        <defs>
          <clipPath id={`c${uid}`}>
            <circle cx="100" cy="100" r="86" />
          </clipPath>
        </defs>
        <g clipPath={`url(#c${uid})`}>
          <rect
            x="0"
            y="0"
            width="200"
            height="200"
            fill={p.light}
            opacity=".55"
          />
          {animal.species === "chien" ? (
            <Dog look={animal} p={p} />
          ) : (
            <Cat look={animal} p={p} />
          )}
        </g>
      </svg>
    );
  }

  return (
    <svg
      role="img"
      aria-label={`Portrait de ${animal.name}`}
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMax slice"
      className={cn("h-full w-full", className)}
    >
      <rect width="200" height="200" fill={tone[0]} />
      <path
        d="M100 12C142 4 186 30 188 74C190 112 170 138 178 168C152 208 66 212 32 178C6 150 12 108 20 78C28 40 60 18 100 12Z"
        fill={tone[1]}
      />
      <g transform="translate(0 14)">
        {/* corps */}
        <path
          d="M14 200C18 160 56 150 100 150C144 150 182 160 186 200Z"
          fill={p.base}
        />
        <path
          d="M60 154Q100 172 140 154"
          stroke="#325541"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="100" cy="171" r="6" fill="#D9B24A" />
        <circle cx="100" cy="171" r="2.2" fill="#B8912E" />
        <g transform="translate(100 96) scale(.92) translate(-100 -100)">
          {animal.species === "chien" ? (
            <Dog look={animal} p={p} />
          ) : (
            <Cat look={animal} p={p} />
          )}
        </g>
      </g>
    </svg>
  );
}
