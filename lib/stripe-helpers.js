export const formatAmountForStripe = (amount, currency) => {
  let numberFormat = new Intl.NumberFormat(["en-BD"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });

  const parts = numberFormat.formatToParts(amount);

  let zeroDecimalCurrency = true;

  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }

  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};

// const ZERO_DECIMAL_CURRENCIES = new Set([
//   "BDT",
//   "BIF",
//   "CLP",
//   "DJF",
//   "GNF",
//   "JPY",
//   "KMF",
//   "KRW",
//   "MGA",
//   "PYG",
//   "RWF",
//   "UGX",
//   "VND",
//   "VUV",
//   "XAF",
//   "XOF",
//   "XPF",
// ]);

// export const formatAmountForStripe = (amount, currency) => {
//   const cur = currency.toUpperCase();
//   return ZERO_DECIMAL_CURRENCIES.has(cur)
//     ? Math.round(amount)
//     : Math.round(amount * 100);
// };
