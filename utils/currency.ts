export const formatPrice = (
  price: number,
  currency: string,
  locale?: string, // Add locale parameter
  t?: (key: string) => string
): string => {
  if (price === 0) {
    return t ? t("price.free") : "FREE";
  }

  const formattedNumber = price.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (currency === "RSD") {
    if (locale === "sr-Cyrl") {
      return `${formattedNumber} дин`;
    } else {
      return `${formattedNumber} RSD`;
    }
  }

  if (currency === "EUR") {
    return `€${formattedNumber}`;
  }

  return `${currency}${formattedNumber}`;
};
