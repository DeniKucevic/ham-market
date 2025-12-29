import countries from "world-countries";

// Map of country codes to translations
const countryTranslations: Record<string, Record<string, string>> = {
  // Europe
  RS: {
    en: "Serbia",
    sr: "Srbija",
    "sr-Cyrl": "Србија",
    is: "Serbía",
    bg: "Сърбия",
  },
  HR: {
    en: "Croatia",
    sr: "Hrvatska",
    "sr-Cyrl": "Хрватска",
    is: "Króatía",
    bg: "Хърватия",
  },
  BA: {
    en: "Bosnia and Herzegovina",
    sr: "Bosna i Hercegovina",
    "sr-Cyrl": "Босна и Херцеговина",
    is: "Bosnía og Hersegóvína",
    bg: "Босна и Херцеговина",
  },
  SI: {
    en: "Slovenia",
    sr: "Slovenija",
    "sr-Cyrl": "Словенија",
    is: "Slóvenía",
    bg: "Словения",
  },
  ME: {
    en: "Montenegro",
    sr: "Crna Gora",
    "sr-Cyrl": "Црна Гора",
    is: "Svartfjallaland",
    bg: "Черна гора",
  },
  MK: {
    en: "North Macedonia",
    sr: "Severna Makedonija",
    "sr-Cyrl": "Северна Македонија",
    is: "Norður-Makedónía",
    bg: "Северна Македония",
  },
  AL: {
    en: "Albania",
    sr: "Albanija",
    "sr-Cyrl": "Албанија",
    is: "Albanía",
    bg: "Албания",
  },
  XK: {
    en: "Kosovo",
    sr: "Kosovo",
    "sr-Cyrl": "Косово",
    is: "Kósóvó",
    bg: "Косово",
  },
  DE: {
    en: "Germany",
    sr: "Nemačka",
    "sr-Cyrl": "Немачка",
    is: "Þýskaland",
    bg: "Германия",
  },
  AT: {
    en: "Austria",
    sr: "Austrija",
    "sr-Cyrl": "Аустрија",
    is: "Austurríki",
    bg: "Австрия",
  },
  CH: {
    en: "Switzerland",
    sr: "Švajcarska",
    "sr-Cyrl": "Швајцарска",
    is: "Sviss",
    bg: "Швейцария",
  },
  IT: {
    en: "Italy",
    sr: "Italija",
    "sr-Cyrl": "Италија",
    is: "Ítalía",
    bg: "Италия",
  },
  FR: {
    en: "France",
    sr: "Francuska",
    "sr-Cyrl": "Француска",
    is: "Frakkland",
    bg: "Франция",
  },
  ES: {
    en: "Spain",
    sr: "Španija",
    "sr-Cyrl": "Шпанија",
    is: "Spánn",
    bg: "Испания",
  },
  PT: {
    en: "Portugal",
    sr: "Portugal",
    "sr-Cyrl": "Португал",
    is: "Portúgal",
    bg: "Португалия",
  },
  GB: {
    en: "United Kingdom",
    sr: "Ujedinjeno Kraljevstvo",
    "sr-Cyrl": "Уједињено Краљевство",
    is: "Bretland",
    bg: "Обединено кралство",
  },
  IE: {
    en: "Ireland",
    sr: "Irska",
    "sr-Cyrl": "Ирска",
    is: "Írland",
    bg: "Ирландия",
  },
  NL: {
    en: "Netherlands",
    sr: "Holandija",
    "sr-Cyrl": "Холандија",
    is: "Holland",
    bg: "Нидерландия",
  },
  BE: {
    en: "Belgium",
    sr: "Belgija",
    "sr-Cyrl": "Белгија",
    is: "Belgía",
    bg: "Белгия",
  },
  LU: {
    en: "Luxembourg",
    sr: "Luksemburg",
    "sr-Cyrl": "Луксембург",
    is: "Lúxemborg",
    bg: "Люксембург",
  },
  DK: {
    en: "Denmark",
    sr: "Danska",
    "sr-Cyrl": "Данска",
    is: "Danmörk",
    bg: "Дания",
  },
  SE: {
    en: "Sweden",
    sr: "Švedska",
    "sr-Cyrl": "Шведска",
    is: "Svíþjóð",
    bg: "Швеция",
  },
  NO: {
    en: "Norway",
    sr: "Norveška",
    "sr-Cyrl": "Норвешка",
    is: "Noregur",
    bg: "Норвегия",
  },
  FI: {
    en: "Finland",
    sr: "Finska",
    "sr-Cyrl": "Финска",
    is: "Finnland",
    bg: "Финландия",
  },
  IS: {
    en: "Iceland",
    sr: "Island",
    "sr-Cyrl": "Исланд",
    is: "Ísland",
    bg: "Исландия",
  },
  PL: {
    en: "Poland",
    sr: "Poljska",
    "sr-Cyrl": "Пољска",
    is: "Pólland",
    bg: "Полша",
  },
  CZ: {
    en: "Czech Republic",
    sr: "Češka",
    "sr-Cyrl": "Чешка",
    is: "Tékkland",
    bg: "Чехия",
  },
  SK: {
    en: "Slovakia",
    sr: "Slovačka",
    "sr-Cyrl": "Словачка",
    is: "Slóvakía",
    bg: "Словакия",
  },
  HU: {
    en: "Hungary",
    sr: "Mađarska",
    "sr-Cyrl": "Мађарска",
    is: "Ungverjaland",
    bg: "Унгария",
  },
  RO: {
    en: "Romania",
    sr: "Rumunija",
    "sr-Cyrl": "Румунија",
    is: "Rúmenía",
    bg: "Румъния",
  },
  BG: {
    en: "Bulgaria",
    sr: "Bugarska",
    "sr-Cyrl": "Бугарска",
    is: "Búlgaría",
    bg: "България",
  },
  GR: {
    en: "Greece",
    sr: "Grčka",
    "sr-Cyrl": "Грчка",
    is: "Grikkland",
    bg: "Гърция",
  },
  TR: {
    en: "Turkey",
    sr: "Turska",
    "sr-Cyrl": "Турска",
    is: "Tyrkland",
    bg: "Турция",
  },
  CY: {
    en: "Cyprus",
    sr: "Kipar",
    "sr-Cyrl": "Кипар",
    is: "Kýpur",
    bg: "Кипър",
  },
  MT: {
    en: "Malta",
    sr: "Malta",
    "sr-Cyrl": "Малта",
    is: "Malta",
    bg: "Малта",
  },
  EE: {
    en: "Estonia",
    sr: "Estonija",
    "sr-Cyrl": "Естонија",
    is: "Eistland",
    bg: "Естония",
  },
  LV: {
    en: "Latvia",
    sr: "Letonija",
    "sr-Cyrl": "Летонија",
    is: "Lettland",
    bg: "Латвия",
  },
  LT: {
    en: "Lithuania",
    sr: "Litvanija",
    "sr-Cyrl": "Литванија",
    is: "Litháen",
    bg: "Литва",
  },
  UA: {
    en: "Ukraine",
    sr: "Ukrajina",
    "sr-Cyrl": "Украјина",
    is: "Úkraína",
    bg: "Украйна",
  },
  RU: {
    en: "Russia",
    sr: "Rusija",
    "sr-Cyrl": "Русија",
    is: "Rússland",
    bg: "Русия",
  },
  BY: {
    en: "Belarus",
    sr: "Belorusija",
    "sr-Cyrl": "Белорусија",
    is: "Hvíta-Rússland",
    bg: "Беларус",
  },
  MD: {
    en: "Moldova",
    sr: "Moldavija",
    "sr-Cyrl": "Молдавија",
    is: "Moldavía",
    bg: "Молдова",
  },

  // Americas
  US: {
    en: "United States",
    sr: "Sjedinjene Američke Države",
    "sr-Cyrl": "Сједињене Америчке Државе",
    is: "Bandaríkin",
    bg: "Съединени американски щати",
  },
  CA: {
    en: "Canada",
    sr: "Kanada",
    "sr-Cyrl": "Канада",
    is: "Kanada",
    bg: "Канада",
  },
  MX: {
    en: "Mexico",
    sr: "Meksiko",
    "sr-Cyrl": "Мексико",
    is: "Mexíkó",
    bg: "Мексико",
  },
  BR: {
    en: "Brazil",
    sr: "Brazil",
    "sr-Cyrl": "Бразил",
    is: "Brasilía",
    bg: "Бразилия",
  },
  AR: {
    en: "Argentina",
    sr: "Argentina",
    "sr-Cyrl": "Аргентина",
    is: "Argentína",
    bg: "Аржентина",
  },
  CL: {
    en: "Chile",
    sr: "Čile",
    "sr-Cyrl": "Чиле",
    is: "Síle",
    bg: "Чили",
  },

  // Asia
  CN: {
    en: "China",
    sr: "Kina",
    "sr-Cyrl": "Кина",
    is: "Kína",
    bg: "Китай",
  },
  JP: {
    en: "Japan",
    sr: "Japan",
    "sr-Cyrl": "Јапан",
    is: "Japan",
    bg: "Япония",
  },
  KR: {
    en: "South Korea",
    sr: "Južna Koreja",
    "sr-Cyrl": "Јужна Кореја",
    is: "Suður-Kórea",
    bg: "Южна Корея",
  },
  IN: {
    en: "India",
    sr: "Indija",
    "sr-Cyrl": "Индија",
    is: "Indland",
    bg: "Индия",
  },

  // Oceania
  AU: {
    en: "Australia",
    sr: "Australija",
    "sr-Cyrl": "Аустралија",
    is: "Ástralía",
    bg: "Австралия",
  },
  NZ: {
    en: "New Zealand",
    sr: "Novi Zeland",
    "sr-Cyrl": "Нови Зеланд",
    is: "Nýja-Sjáland",
    bg: "Нова Зеландия",
  },
};

export interface Country {
  code: string;
  name: string;
  nameTranslated: string;
  flag: string;
}

export function getCountries(locale: string): Country[] {
  return countries
    .map((country) => ({
      code: country.cca2,
      name: country.name.common,
      nameTranslated:
        countryTranslations[country.cca2]?.[locale] || country.name.common,
      flag: country.flag,
    }))
    .sort((a, b) => a.nameTranslated.localeCompare(b.nameTranslated, locale));
}
