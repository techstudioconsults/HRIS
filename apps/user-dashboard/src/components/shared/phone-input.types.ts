import type React from 'react';
import type * as RPNInput from 'react-phone-number-input';

export type PhoneInputProperties = Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value' | 'ref'
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    /* Allow undefined during intermediate typing */
    onChange?: (value: RPNInput.Value | undefined) => void;
    inputClassName?: string;
    buttonClassName?: string;
  };

export type CountryEntry = {
  label: string;
  value: RPNInput.Country | undefined;
};

export type CountrySelectProperties = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
  buttonClassName?: string;
};

export interface CountrySelectOptionProperties extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}
