export const serviceAreas = [
  "Katipunan",
  "Roxas",
  "Piñan",
  "Osmeña",
  "Polanco",
  "Manukan",
];

export const municipalityZipcodes = [
  { municipality: "Baliguian", zipcode: "7123" },
  { municipality: "Dapitan City", zipcode: "7101" },
  { municipality: "Dipolog City", zipcode: "7100" },
  { municipality: "Godod", zipcode: "7126" },
  { municipality: "Gutalac", zipcode: "7118" },
  { municipality: "Jose Dalman (Ponot)", zipcode: "7111" },
  { municipality: "Kalawit", zipcode: "7124" },
  { municipality: "Katipunan", zipcode: "7109" },
  { municipality: "La Libertad", zipcode: "7119" },
  { municipality: "Labason", zipcode: "7117" },
  { municipality: "Leon B. Postigo (Bacungan)", zipcode: "7125" },
  { municipality: "Liloy", zipcode: "7115" },
  { municipality: "Manukan", zipcode: "7110" },
  { municipality: "Mutia", zipcode: "7107" },
  { municipality: "Piñan", zipcode: "7105" },
  { municipality: "Polanco", zipcode: "7106" },
  { municipality: "Rizal", zipcode: "7104" },
  { municipality: "Roxas", zipcode: "7102" },
  { municipality: "Salug", zipcode: "7114" },
  { municipality: "Sergio Osmeña", zipcode: "7108" },
  { municipality: "Siayan", zipcode: "7113" },
  { municipality: "Sibuco", zipcode: "7122" },
  { municipality: "Sibutad", zipcode: "7103" },
  { municipality: "Sindangan", zipcode: "7112" },
  { municipality: "Siocon", zipcode: "7120" },
  { municipality: "Siraway", zipcode: "7121" },
  { municipality: "Tampilisan", zipcode: "7116" },
];

export const municipalityOptions = municipalityZipcodes.map(
  (m) => m.municipality,
);

export const zipcodeMap = Object.fromEntries(
  municipalityZipcodes.map((m) => [m.municipality, m.zipcode]),
);
