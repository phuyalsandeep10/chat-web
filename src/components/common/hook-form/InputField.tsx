import React, { useState } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Label from './Label';
import { Icons } from '@/components/ui/Icons';
import ErrorText from './ErrorText';

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  labelClassName?: string;
  error?: string;
};

export function InputField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  className,
  disabled,
  inputClassName,
  type = 'text',
  placeholder,
  labelClassName,
  error,
}: InputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField
    ? showPassword
      ? 'text'
      : 'password'
    : type;

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <Label
          htmlFor={name}
          required={required}
          className={cn(`mb-2 ${labelClassName}`)}
        >
          {label}
        </Label>
      )}

      <Controller
        control={control}
        name={name}
        defaultValue={undefined as any} // match type
        rules={{
          required: required ? 'This field is required' : false,
          min:
            type === 'number'
              ? { value: 0, message: 'Value must be ≥ 0' }
              : undefined,
        }}
        render={({ field, fieldState }) => (
          <>
            <div className="relative">
              <Input
                id={name}
                type={inputType}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                  isPasswordField && 'pr-6',
                  fieldState.error && 'border-color-error',
                  inputClassName,
                  'border-grey-light h-[36px] border-[1px] px-3 placeholder:text-[14px] focus:outline-none',
                )}
                value={
                  type === 'number'
                    ? (field.value ?? '')
                    : ((field.value as string | undefined) ?? '')
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (type === 'number') {
                    if (/^\d*$/.test(val)) {
                      field.onChange(val === '' ? '' : Number(val));
                    }
                  } else {
                    field.onChange(val);
                  }
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (type === 'number') {
                    if (['-', 'e', 'E', '+'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }
                }}
              />

              {isPasswordField && (
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <Icons.Eye className="h-4 w-4" />
                  ) : (
                    <Icons.eye_off className="h-4 w-4" />
                  )}
                </span>
              )}
            </div>

            {(fieldState.error || error) && (
              <ErrorText error={fieldState.error?.message || error || ''} />
            )}
          </>
        )}
      />
    </div>
  );
}
