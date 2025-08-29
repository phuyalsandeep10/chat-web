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
  placeholder?: string;
  labelClassName?: string;
  readOnly?: boolean;
  disabled?: boolean;
};

export function InputField<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  className,
  inputClassName,
  type = 'text',
  placeholder,
  labelClassName,
  readOnly,
  disabled,
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
        rules={{
          required: required ? 'This field is required' : false,
        }}
        render={({ field, fieldState }) => (
          <>
            <div className="relative">
              <Input
                id={name}
                type={inputType}
                placeholder={placeholder}
                className={cn(
                  isPasswordField && 'pr-6',
                  fieldState.error && 'border-color-error',
                  inputClassName,
                  'border-grey-light h-[36px] border-[1px] px-3 placeholder:text-[14px] focus:outline-none',
                )}
                readOnly={readOnly}
                disabled={disabled}
                {...field}
              />

              {isPasswordField && (
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <Icons.eye_off className="h-4 w-4" />
                  ) : (
                    <Icons.Eye className="h-4 w-4" />
                  )}
                </span>
              )}
            </div>

            {fieldState.error && (
              <ErrorText error={`${fieldState.error.message}`} />
            )}
          </>
        )}
      />
    </div>
  );
}
