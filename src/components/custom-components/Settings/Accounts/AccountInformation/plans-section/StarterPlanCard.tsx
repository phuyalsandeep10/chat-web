import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function StarterPlanCard() {
  return (
    <Card className="card-shadow w-[170px] rounded-lg bg-white p-0">
      <CardContent className="flex flex-col p-5">
        <h4 className="text-brand-dark text-[14px] leading-[21px] font-semibold">
          Starter Plan
        </h4>
        <div className="text-brand-primary leading-[29px] font-semibold">
          <span className="text-[18px]">Free</span>
        </div>
        <div className="text-pure-black mt-2.5 text-xs leading-[17px] font-normal">
          This subscription allows <br />
          up to 1 linked account.
          <br />
          You are currently using <br />1 accounts.
        </div>
        <Button
          variant="outline"
          className="border-brand-primary text-brand-primary mt-[19px] h-9 w-[130px] cursor-pointer rounded-[8px] text-xs leading-[17px] font-normal"
        >
          DOWNGRACE
        </Button>
      </CardContent>
    </Card>
  );
}
