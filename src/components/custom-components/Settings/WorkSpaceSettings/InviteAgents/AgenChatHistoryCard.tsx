import { useEffect } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/Icons';
import { useForm, Controller } from 'react-hook-form';
import { DialogClose } from '@/components/ui/dialog';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { InputField } from '@/components/common/hook-form/InputField';
import Label from '@/components/common/hook-form/Label';
import { Form } from '@/components/ui/form';
import { AgentChatHistoryFormValues, AgenChatHistoryCardProps } from './types';

export function AgenChatHistoryCard({
  headerIconClass,
  headericon,
  iconClass,
  defaultValues,
  onSubmit,
  submitButton,
  operatorsData,
  selectedOperator,
}: AgenChatHistoryCardProps) {
  const form = useForm<AgentChatHistoryFormValues>({
    defaultValues: {
      role: selectedOperator?.roles?.map((r) => r.role_name).join(', ') || '',
    },
  });

  const {
    email,
    user_name,
    roles = [],
    client_handled,
  } = selectedOperator || {};

  const handleSubmit = (data: AgentChatHistoryFormValues) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <>
      <Card className="w-full max-w-full gap-0 border-none p-0 shadow-none">
        <CardHeader className="inline-flex items-center gap-x-[17px] gap-y-[14px] p-0 pb-6">
          {headericon && (
            <div className={headerIconClass ?? ''}>
              {' '}
              <span className={iconClass ?? ''}>{headericon}</span>{' '}
            </div>
          )}
          <div>
            <CardTitle className="text-lg leading-[29px] font-semibold">
              {user_name}
            </CardTitle>
            <CardDescription className="text-xs leading-[17px] font-normal">
              {email}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="pb-5">
              <div className="flex flex-col gap-6">
                <div>
                  <InputField
                    name="role"
                    placeholder="admin"
                    control={form.control}
                    label="Role"
                    labelClassName="pb-2 text-base leading-[26px] font-medium"
                    required
                    readOnly
                    disabled
                    // options={roles?.map((role: any) => ({
                    //   label: role.role_name,
                    //   value: role.role_id,
                    // }))}
                  />
                </div>
              </div>
            </form>
          </Form>
          {/* client's handle and rating */}
          <div className="flex justify-between pb-[32px]">
            <div className="flex items-center gap-2">
              <p className="text-base leading-[26px] font-medium">
                No. of Clients Handled:
              </p>
              <span className="text-sm leading-[21px] font-normal">
                {client_handled}
              </span>
            </div>
            <div className="flex gap-2">
              <p className="text-base leading-[26px] font-medium">
                Agent’s rating:
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                  return (
                    <span key={i}>
                      <Icons.ri_star_fill
                        className={`w-[15px] leading-[21px] font-normal ${i < 3 ? 'text-warning-prominent' : 'text-gray-light'} `}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* recent conversation section */}
          <div className="pb-[33px]">
            <p className="pb-3 text-sm leading-[21px] font-semibold">
              Recent Conversations
            </p>
            <div className="border-grey-light rounded-2xl border-[1px] p-2.5">
              <div className="flex w-full gap-2">
                <div className="h-[38px] w-[38px] basis-auto">
                  <span className="bg-error-border text-disabled-foreground flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                    AJ
                  </span>
                </div>
                <div className="flex w-full flex-1 flex-col gap-y-[14px]">
                  <div className="flex w-full justify-between">
                    <p className="inline-block text-base leading-[26px] font-semibold">
                      Alice Johnson
                    </p>
                  </div>
                  <p className="text-xs leading-[17px] font-normal">
                    Thanks for your help with the recent issue regarding my
                    account. It was resolved quickly.
                  </p>
                  <div className="flex gap-2 text-xs leading-4 font-semibold">
                    <Badge className="bg-error-light text-alert-prominent px-2 py-2">
                      Unresolved
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-brand-primary px-2 py-2 text-white"
                    >
                      <div className="bg-secondary-hover text-brand-primary flex h-[20px] w-[20px] items-center justify-center rounded-[50px] px-[2px] py-[2px]">
                        {' '}
                        <span className="text-brand-primary flex w-[11px] items-center justify-center">
                          <Icons.ri_user_fill />
                        </span>{' '}
                      </div>
                      Agent Sarah
                    </Badge>
                  </div>
                </div>
                <span className="text-theme-text-primary basis-auto text-xs leading-[17px] font-normal">
                  04:15 PM
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row justify-end gap-6">
          <Button
            className="h-full max-h-[36px] w-full max-w-[149px] rounded-lg px-[22px] py-2.5 text-xs leading-4 font-semibold"
            type="submit"
          >
            View Conversations
          </Button>

          <DialogClose asChild>
            <Button
              className="h-full max-h-[36px] w-full max-w-[149px] rounded-lg px-[22px] py-2.5 text-xs leading-4 font-semibold"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
        </CardFooter>
      </Card>
    </>
  );
}
