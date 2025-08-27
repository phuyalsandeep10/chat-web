import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export const OrganizationPlanCard = () => {
  return (
    <Card className="bg-secondary-hover card-shadow rounded-lg p-0">
      <CardContent className="flex flex-col p-5">
        <h4 className="text-brand-dark text-[14px] leading-[21px] font-semibold">
          Organization Plan
        </h4>
        <div className="text-brand-primary leading-[29px] font-semibold">
          <span className="text-[18px]">39.99</span>
          <span className="text-sm font-semibold">/month</span>
        </div>
        <div className="mt-[7px]">
          <p className="text-sm leading-[21px] font-normal">
            Next billing date
          </p>
          <p className="text-xs leading-[17px] font-semibold">
            October 20, 2025
          </p>
        </div>

        <div className="mt-[7px]">
          <p className="text-sm leading-[21px] font-normal">Used accounts</p>
          <p className="mt-[3px] text-xs leading-[17px] font-semibold">
            1/5 account
          </p>
        </div>

        <Link
          href="#"
          className="text-brand-primary mt-4 text-sm leading-[21px] font-normal underline decoration-solid decoration-[0px] underline-offset-[0px]"
        >
          Cancel Subscriptions
        </Link>
      </CardContent>
    </Card>
  );
};
