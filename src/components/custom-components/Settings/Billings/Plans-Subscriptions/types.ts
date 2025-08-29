import { Button } from '@/components/ui/button';

export type ToggleOption = {
  key: string;
  label: React.ReactNode;
};

export type HeaderComponentProps = {
  heading: string;
  className?: string;
};

export type Plan = {
  name: string;
  price: number;
  status: 'Active' | 'Expired';
  note: string;
  renewal: string;
  company_name?: string;
};

export type PlanCardProps = {
  plan: Plan;
  onChangePlan: (planName: string) => void;
  onCancelPlan: (planName: string) => void;
};

export type PlanComparisonData = {
  overview: string;
  starter: string;
  business: string;
  enterprise: string;
};

export type PlansComponentProps = {
  title: string;
  price: string;
  subtitle: string;
  buttonText: string;
  description: string;
  features: string[];
  showImage?: boolean;
  imageSrc?: string;
  bgColor?: string;
  prevPrice?: string;
  className?: string;
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  buttonOnClick?: () => void;
  size?: React.ComponentProps<typeof Button>['size'];
  buttonClassName?: string;
};

export type PlanDataFeature = {
  overview: string;
  starter: boolean;
  business: boolean;
  enterprise: boolean;
};
