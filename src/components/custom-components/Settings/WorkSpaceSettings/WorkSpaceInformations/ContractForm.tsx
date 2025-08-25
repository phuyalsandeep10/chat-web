import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ContactFormSchema,
  contactFormSchema,
} from '@/hooks/utils/ContactSchema';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PhoneInput from '@/shared/PhoneInput';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/store/WorkspaceStore/useWorkspaceStore';

interface ContactFormProps {
  contactEmail?: string | null;
  contactPhone?: string | null;
  twitterUsername?: string | null;
  facebookUsername?: string | null;
  whatsappNumber?: string | null;
  telegramUsername?: string | null;
}

const ContactForm: React.FC<ContactFormProps> = ({
  contactEmail,
  contactPhone,
  twitterUsername,
  facebookUsername,
  whatsappNumber,
  telegramUsername,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      twitter: '',
      messenger: '',
      whatsapp: '',
      telegram: '',
    },
  });

  // Reset form when props change
  useEffect(() => {
    reset({
      email: contactEmail || '',
      phoneNumber: contactPhone || '',
      twitter: twitterUsername || '',
      messenger: facebookUsername || '',
      whatsapp: whatsappNumber || '',
      telegram: telegramUsername || '',
    });
  }, [
    contactEmail,
    contactPhone,
    twitterUsername,
    facebookUsername,
    whatsappNumber,
    telegramUsername,
    reset,
  ]);

  const { updatedData, setData } = useWorkspaceStore();

  console.log(updatedData);

  const onSubmit = (data: ContactFormSchema) => {
    console.log('Form Data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2
        className={cn(
          'font-outfit text-brand-dark mb-6 text-xl leading-[30px] font-semibold',
        )}
      >
        Contact Information
      </h2>

      <div className={cn('space-y-4.5')}>
        <div className={cn('grid grid-cols-2 gap-5')}>
          <div className={cn('space-y-2.5')}>
            <Label
              htmlFor="email"
              className={cn('font-outfit text-base font-medium text-black')}
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="anything@gmail.com"
              className="h-9 text-sm font-medium"
              onChange={(e) => setData({ email: e.target.value })}
            />
            {errors.email && (
              <p className="text-alert-prominent text-xs">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className={cn('space-y-2.5')}>
            <Label
              htmlFor="phone"
              className="font-outfit text-base font-medium text-black"
            >
              Phone
            </Label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setData({ phone: value });
                  }}
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="text-alert-prominent text-xs">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className={cn('grid grid-cols-2 gap-5')}>
          <div className={cn('space-y-2.5')}>
            <Label
              htmlFor="messenger"
              className={cn('font-outfit text-base font-medium text-black')}
            >
              Messenger
            </Label>
            <Input
              id="messenger"
              placeholder="Messenger username"
              className={cn('font-outfit h-9 text-sm font-medium')}
              {...register('messenger')}
              onChange={(e) => setData({ messenger: e.target.value })}
            />
            {errors.messenger && (
              <p className={cn('text-alert-prominent text-xs')}>
                {errors.messenger.message}
              </p>
            )}
          </div>
          <div className={cn('space-y-2.5')}>
            <Label
              htmlFor="telegram"
              className={cn('font-outfit text-base font-medium text-black')}
            >
              Telegram
            </Label>
            <Input
              id="telegram"
              placeholder="Telegram username"
              className={cn('font-outfit h-9 text-sm font-medium')}
              {...register('telegram')}
              onChange={(e) => setData({ telegram: e.target.value })}
            />
            {errors.telegram && (
              <p className={cn('text-alert-prominent text-xs')}>
                {errors.telegram.message}
              </p>
            )}
          </div>
        </div>

        <div className={cn('grid grid-cols-2 gap-5')}>
          <div className={cn('space-y-2.5')}>
            <Label
              htmlFor="twitter"
              className={cn('font-outfit text-base font-medium text-black')}
            >
              X (Twitter)
            </Label>
            <Input
              id="twitter"
              placeholder="X username"
              className={cn('font-outfit h-9 text-sm font-medium')}
              {...register('twitter')}
              onChange={(e) => setData({ xUsername: e.target.value })}
            />
            {errors.twitter && (
              <p className={cn('text-alert-prominent text-xs')}>
                {errors.twitter.message}
              </p>
            )}
          </div>
          <div className={cn('space-y-2.5')}>
            <Label
              htmlFor="whatsapp"
              className={cn('font-outfit text-base font-medium text-black')}
            >
              WhatsApp
            </Label>
            <Input
              id="whatsapp"
              className={cn('font-outfit h-9 text-sm font-medium')}
              placeholder="+977 9824830624"
              {...register('whatsapp')}
              onChange={(e) => setData({ whatsApp: e.target.value })}
            />
            {errors.whatsapp && (
              <p className={cn('text-alert-prominent text-xs')}>
                {errors.whatsapp.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
