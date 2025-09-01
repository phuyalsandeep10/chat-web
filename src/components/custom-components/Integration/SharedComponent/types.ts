export type HeaderProps = {
  navigation: string;
  planType: string;
  name: string;
  desc: string;
  installButton: string;
  videoButton: string;
  image: React.ReactNode;
  onInstallClick?: () => void;
};

export type Capability = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export type CoreCapabilitiesProps = {
  capabilities?: Capability[];
};

export type Step = {
  title: string;
  description: string;
  borderClass?: string;
};

export type VisualOverviewProps = {
  headingIcon?: React.ElementType;
  headingText?: string;
  subText?: string;
  steps: Step[];
};

export type DeveloperInfoItem = {
  label: string;
  value: string;
};

export type RequiredPermissionsProps = {
  title?: string;
  description?: string;
  permissions: string[];
  developerTitle?: string;
  developerInfo: DeveloperInfoItem[];
  checkIcon?: React.ElementType;
};
