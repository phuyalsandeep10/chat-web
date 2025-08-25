import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { PlanCardProps } from './types';

export const PlanCard = ({
  plan,
  onChangePlan,
  onCancelPlan,
}: PlanCardProps) => {
  const statusColor =
    plan.status === 'Expired' ? 'text-alert-prominent' : 'text-success';
  const renewalColor =
    plan.renewal === 'Expired'
      ? 'text-alert-prominent'
      : plan.renewal === 'Active'
        ? 'text-success'
        : 'text-theme-text-primary';

  return (
    <div className="border-grey-light space-y-4 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <p className="text-brand-dark text-2xl leading-8.5 font-semibold">
          {plan.name}
        </p>
        <p
          className={`${statusColor} pr-6 text-[16px] leading-6.5 font-medium`}
        >
          • {plan.status}
        </p>
      </div>

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div className="space-y-2">
          <div className="flex items-baseline gap-6">
            <div className="flex flex-col items-start gap-1.5">
              <p className="text-gray-dark text-[40px] leading-12 font-bold">
                ${plan.price}
                <span className="text-gray-dark text-xl leading-7.5 font-semibold">
                  /month
                </span>
              </p>
              <p
                className={`${renewalColor} text-[16px] leading-6.5 font-semibold`}
              >
                {plan.renewal}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-brand-dark text-lg leading-7 font-medium">
                {plan.company_name}
              </span>
              <span className="text-theme-text-primary text-[16px] leading-6.5 font-normal">
                {plan.note}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 self-center">
          <Button
            variant="default"
            size="sm"
            onClick={() => onChangePlan(plan.name)}
            className="rounded-[4px] px-9.5 py-2.5 text-xs"
          >
            Change Plan
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="rounded-[4px] px-4 py-2.5 text-xs"
            onClick={() => onCancelPlan(plan.name)}
          >
            Cancel plan
          </Button>
        </div>
      </div>

      <div className="border-grey-light border-t pt-4">
        <a
          href="#"
          className="text-info flex items-center gap-1 text-lg leading-7 font-semibold"
        >
          Download invoice <Icons.ri_download_2_line className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
};
