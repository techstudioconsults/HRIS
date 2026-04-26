export interface FormattedCountry {
  value: string;
  label: string;
  cca2: string;
  commonName: string;
}

export interface FormattedLocation {
  value: string;
  label: string;
}

export interface CountryInfo {
  name: {
    common: string;
  };
  flags?: {
    unicode?: string;
  };
  cca2: string;
}
