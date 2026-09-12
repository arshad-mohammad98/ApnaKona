export const SITE_CONFIG = {
  name: "ApnaKona",
  tagline: "India's #1 Student Accommodation Platform",
  contact: {
    email: "apnakonaa@gmail.com",
    phone: "+91 8900089000",
    phoneDisplay: "+91 89000 89000",
    emailHref: "mailto:apnakonaa@gmail.com",
    phoneHref: "tel:+918900089000",
  },
  social: {
    instagram: "https://instagram.com/apna._kona",
    twitter: "https://twitter.com/apnakona",
  },
} as const;

export const SITE_CONTACT = SITE_CONFIG.contact;
export const SITE_SOCIAL = SITE_CONFIG.social;
