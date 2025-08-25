import Label from '@/components/common/hook-form/Label';
import { Country } from '@/services/organizations/types';
import CountrySelect from '@/shared/CountrySelect';

type CountrySelectProps = {
  value: Country | null;
  onChange: (value: Country | null) => void;
};

export const CountySection: React.FC<CountrySelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="mt-[18px]">
      <Label
        required
        htmlFor="country"
        className="text-brand-dark text-[16px] leading-[26px] font-medium"
      >
        Country
      </Label>

      <CountrySelect
        value={value}
        onChange={onChange}
        buttonClassName="w-[80%] h-9 text-pure-black font-normal"
      />
    </div>
  );
};
