/**
 * Photos réalistes (générées avec Higgsfield) pour les fiches « vitrine ».
 * Les autres animaux gardent leur illustration. Clé : id de l'animal.
 * Quand les vraies photos arriveront (import GMVet / upload), il suffira
 * de renseigner `Animal.photoUrl`.
 */
export const PET_PHOTOS: Record<string, string> = {
  "a-vodka": "/photos/vodka.webp", // Berger Belge Malinois
  "a-gaia": "/photos/gaia.webp", // Berger Australien
  // Portraits générés avec Higgsfield (hébergés en externe)
  "a-nala":
    "https://d8j0ntlcm91z4.cloudfront.net/user_3BcSQZTgtSVkqbmllbr5SXH3JIg/hf_20261005_100506_4f53f7c4-cd2c-49e9-944e-5e39f19faf20.png",
  "a-marcel":
    "https://d8j0ntlcm91z4.cloudfront.net/user_3BcSQZTgtSVkqbmllbr5SXH3JIg/hf_20261005_100505_8d2dd870-d9e6-4d72-a6c0-5359139dad22.png",
  "a-felix":
    "https://d8j0ntlcm91z4.cloudfront.net/user_3BcSQZTgtSVkqbmllbr5SXH3JIg/hf_20261005_100504_ad3d18e3-c357-4bbb-a6d9-2a0f39e11686.png",
  "a-maya":
    "https://d8j0ntlcm91z4.cloudfront.net/user_3BcSQZTgtSVkqbmllbr5SXH3JIg/hf_20261005_100507_f2fad4fc-6d6d-4c5f-a343-403bfaf453a3.png",
};
