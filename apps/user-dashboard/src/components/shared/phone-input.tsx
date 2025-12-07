import { Button } from '@workspace/ui/components/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import { Input } from '@workspace/ui/components/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { cn } from '@workspace/ui/lib/utils'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import * as RPNInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'

type PhoneInputProperties = Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value' | 'ref'
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    /* Allow undefined during intermediate typing */
    onChange?: (value: RPNInput.Value | undefined) => void
    inputClassName?: string
    buttonClassName?: string
  }

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProperties> =
  React.forwardRef<
    React.ElementRef<typeof RPNInput.default>,
    PhoneInputProperties
  >(
    (
      {
        className,
        onChange,
        value,
        inputClassName,
        buttonClassName,
        ...properties
      },
      reference
    ) => {
      // Stable memoized wrappers prevent the input element from being recreated
      // on every keystroke (which was causing focus loss).
      const CountrySelectComponent = React.useCallback(
        (countrySelectProperties: CountrySelectProperties) => (
          <CountrySelect
            {...countrySelectProperties}
            buttonClassName={buttonClassName}
          />
        ),
        [buttonClassName]
      )

      const InputFieldComponent = React.useCallback(
        (inputProperties: React.ComponentProps<'input'>) => (
          <InputComponent
            {...inputProperties}
            inputClassName={cn('shadow-none', inputClassName)}
          />
        ),
        [inputClassName]
      )

      return (
        <RPNInput.default
          ref={reference}
          className={cn('flex shadow-none', className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelectComponent}
          inputComponent={InputFieldComponent}
          smartCaret={false}
          /* Pass the value directly; letting undefined represent an in-progress (incomplete) number.
        Avoid converting empty/intermediate states to '' which caused uncontrolled/controlled toggling */
          value={value}
          /**
           * Handles the onChange event.
           *
           * react-phone-number-input might trigger the onChange event as undefined
           * when a valid phone number is not entered. To prevent this,
           * the value is coerced to an empty string.
           */
          onChange={(newValue) => onChange?.(newValue)}
          {...properties}
        />
      )
    }
  )
PhoneInput.displayName = 'PhoneInput'

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & { inputClassName?: string }
>(({ className, inputClassName, ...properties }, reference) => (
  <Input
    className={cn('rounded-s-none rounded-e-lg', inputClassName, className)}
    {...properties}
    ref={reference}
  />
))
InputComponent.displayName = 'InputComponent'

type CountryEntry = { label: string; value: RPNInput.Country | undefined }

type CountrySelectProperties = {
  disabled?: boolean
  value: RPNInput.Country
  options: CountryEntry[]
  onChange: (country: RPNInput.Country) => void
  buttonClassName?: string
}

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
  buttonClassName,
}: CountrySelectProperties) => {
  const scrollAreaReference = React.useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={(open) => {
        setIsOpen(open)
        // open && setSearchValue('')
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='outline'
          className={cn(
            'flex gap-1 rounded-s-lg rounded-e-none border-r-0 px-3 focus:z-10',
            buttonClassName
          )}
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              '-mr-2 size-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0 shadow-none'>
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value)
              setTimeout(() => {
                if (scrollAreaReference.current) {
                  const viewportElement =
                    scrollAreaReference.current.querySelector(
                      '[data-radix-scroll-area-viewport]'
                    )
                  if (viewportElement) {
                    viewportElement.scrollTop = 0
                  }
                }
              }, 0)
            }}
            placeholder='Search country...'
          />
          <CommandList>
            <ScrollArea ref={scrollAreaReference} className='h-72'>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface CountrySelectOptionProperties extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country
  onChange: (country: RPNInput.Country) => void
  onSelectComplete: () => void
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProperties) => {
  const handleSelect = () => {
    onChange(country)
    onSelectComplete()
  }

  return (
    <CommandItem className='gap-2' onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className='flex-1 text-sm'>{countryName}</span>
      <span className='text-foreground/50 text-sm'>{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={`ml-auto size-4 ${country === selectedCountry ? 'opacity-100' : 'opacity-0'}`}
      />
    </CommandItem>
  )
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}

export { PhoneInput }
