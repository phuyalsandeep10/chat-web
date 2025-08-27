import Link from 'next/link';
import SecuritySection from '../security-section/SecuritySection';
import { OrganizationPlanCard } from './OrganizationPlanCard';
import StarterPlanCard from './StarterPlanCard';

export default function PlansSection() {
  return (
    <div>
      <SecuritySection />

      <p className="mt-8 text-base leading-[17px] font-normal tracking-[0.2%]">
        <span className="text-theme-text-dark">
          Want to remove your Chatboq account?
        </span>{' '}
        <Link
          href="#"
          className="text-brand-primary hover:text-brand-light underline"
        >
          Click here to continue!
        </Link>
      </p>

      {/* Plans Section */}
      <section className="mt-8">
        <h3 className="text-brand-dark mb-3 text-[20px] leading-[30px] font-semibold tracking-[-0.1%]">
          Plans
        </h3>

        <div className="flex gap-[41px]">
          <OrganizationPlanCard />
          <StarterPlanCard />
        </div>
      </section>
    </div>
  );
}
