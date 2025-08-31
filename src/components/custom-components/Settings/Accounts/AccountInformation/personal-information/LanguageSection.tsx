import LanguageSelect from '@/shared/LanguageSelect';
import { Control } from 'react-hook-form';

export const LanguageSection: React.FC<{
  name: string;
  control: Control<any>;
}> = ({ control, name }) => {
  return (
    <div className="mt-6">
      <label className="text-brand-dark text-[16px] leading-[26px] font-medium">
        Language
      </label>

      <LanguageSelect
        control={control}
        name={name}
        buttonClassName="w-[80%] h-9 text-pure-black font-normal"
      />
    </div>
  );
};
