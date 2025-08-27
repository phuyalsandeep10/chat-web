import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function DiscountBanner() {
  return (
    <div className="bg-brand-primary mt-[53px] mb-10 flex w-full items-center justify-between rounded-lg px-10 py-5">
      <div className="text-pure-white flex flex-col gap-1">
        <h4 className="text-[18px] leading-[29px] font-semibold">Discount</h4>
        <div className="flex items-center gap-[25px]">
          <span className="text-[32px] leading-[40px] font-semibold">30%</span>
          <span className="">
            <span className="text-[18px] leading-[29px] font-normal">
              discount on{' '}
            </span>
            <span className="text-[20px] leading-[30px] font-semibold">
              Annual Plans
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="">
          <Image width={141} height={88} src="/letter.svg" alt="letter-img" />
        </div>

        <Button
          variant="outline"
          size={'sm'}
          className="border-pure-white text-pure-white h-9 rounded-xl text-xs leading-4 font-semibold"
        >
          Switch to Yearly
        </Button>
      </div>
    </div>
  );
}
