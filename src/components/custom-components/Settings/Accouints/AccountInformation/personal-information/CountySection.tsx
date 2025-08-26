import Label from '@/components/common/hook-form/Label';
import CountrySelect from '@/shared/CountrySelect';
import { Control } from 'react-hook-form';

export const CountrySection: React.FC<{
  name: string;
  control: Control<any>;
}> = ({ name, control }) => {
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
        control={control}
        name={name}
        buttonClassName="w-[80%] h-9 text-pure-black font-normal"
      />
    </div>
  );
};
