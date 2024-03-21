import { LANGUAGE } from "../models/types";

export const langFormat = ({
  uzb,
  ru,
  en,
}: {
  uzb: string;
  ru: string;
  en: string;
}) => {
  const l = localStorage.getItem("lang") as LANGUAGE;
  switch (l) {
    case LANGUAGE.UZB:
      return uzb;
    case LANGUAGE.RU:
      return ru;
    case LANGUAGE.EN:
      return en;
    default:
      return uzb;
  }
};
