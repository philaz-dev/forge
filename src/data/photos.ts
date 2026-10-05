/**
 * Photos réalistes (générées avec Higgsfield) pour les fiches « vitrine ».
 * Les autres patients réutilisent la photo de l'animal le plus ressemblant
 * (même race ou même robe) ; seuls 10 patients gardent leur illustration.
 * Clé : id de l'animal.
 * Quand les vraies photos arriveront (import GMVet / upload), il suffira
 * de renseigner `Animal.photoUrl`.
 */
const OWN_PHOTOS: Record<string, string> = {
  "a-vodka": "/photos/vodka.webp", // Berger Belge Malinois
  "a-gaia": "/photos/gaia.webp", // Berger Australien
  // Portraits générés avec Higgsfield (hébergés en externe)
  "a-oslo": "/photos/oslo.webp",
  "a-rio": "/photos/rio.webp",
  "a-mochi": "/photos/mochi.webp",
  "a-balto": "/photos/balto.webp",
  "a-nala":
    "https://d8j0ntlcm91z4.cloudfront.net/user_3BcSQZTgtSVkqbmllbr5SXH3JIg/hf_20261005_100506_4f53f7c4-cd2c-49e9-944e-5e39f19faf20.png",
  "a-marcel":
    "https://d8j0ntlcm91z4.cloudfront.net/user_3BcSQZTgtSVkqbmllbr5SXH3JIg/hf_20261005_100505_8d2dd870-d9e6-4d72-a6c0-5359139dad22.png",
  "a-felix":
    "https://d8j0ntlcm91z4.cloudfront.net/user_3BcSQZTgtSVkqbmllbr5SXH3JIg/hf_20261005_100504_ad3d18e3-c357-4bbb-a6d9-2a0f39e11686.png",
  "a-maya":
    "https://d8j0ntlcm91z4.cloudfront.net/user_3BcSQZTgtSVkqbmllbr5SXH3JIg/hf_20261005_100507_f2fad4fc-6d6d-4c5f-a343-403bfaf453a3.png",
};

/**
 * Patients sans portrait propre : ils réutilisent la photo d'un animal de la
 * même race ou de robe proche. Les 10 patients absents de cette table et de
 * `OWN_PHOTOS` conservent leur illustration : Pixel, Sally, Doudou, Pistache,
 * Nougat, Mia, Choupette, Zéphyr, Biscotte et Ruby.
 */
const EXTRA_PHOTOS: Record<string, string> = {
  "a-max": "/photos/berger.webp", // Berger Allemand (fond bleu)
};

const SHARED_PHOTOS: Record<string, string> = {
  // chiens
  "a-ulysse": "a-oslo",
  "a-joy": "a-oslo",
  "a-cooper": "a-oslo",
  "a-bella": "a-rio",
  "a-oscar": "a-rio",
  "a-leo": "a-rio",
  "a-noisette": "a-rio",
  "a-sirius": "a-balto",
  "a-tyson": "a-marcel",
  "a-elsa": "a-marcel",
  "a-rocky": "a-marcel",
  "a-fanny": "a-marcel",
  "a-atlas": "a-maya",
  // chats
  "a-simba": "a-nala",
  "a-cleo": "a-nala",
  "a-garfield": "a-nala",
  "a-chacha": "a-nala",
  "a-ulrich": "a-nala",
  "a-kiwi": "a-nala",
  "a-opale": "a-nala",
  "a-biscuit": "a-nala",
  "a-luna": "a-mochi",
  "a-tigrou": "a-mochi",
  "a-plume": "a-mochi",
  "a-moustache": "a-mochi",
  "a-mimine": "a-mochi",
  "a-oreo": "a-mochi",
  "a-neige": "a-mochi",
  "a-poppy": "a-mochi",
  "a-tom": "a-mochi",
  "a-salem": "a-felix",
};

export const PET_PHOTOS: Record<string, string> = {
  ...OWN_PHOTOS,
  ...EXTRA_PHOTOS,
  ...Object.fromEntries(
    Object.entries(SHARED_PHOTOS).flatMap(([id, from]) => {
      const url = OWN_PHOTOS[from];
      return url ? [[id, url]] : [];
    }),
  ),
};
