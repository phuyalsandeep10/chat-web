export type CardComponentProps = {
  image: string;
  name: string;
  description: string;
  price?: string;
  websiteUrl: string;
  isConnected: boolean;
  onConnectionChange: (isConnected: boolean) => void;
};

export type HeadingTypographyProps = {
  heading: string;
};

export type Channel = {
  image: string;
  name: string;
  description: string;
  price?: string;
  websiteUrl: string;
};

export type SectionWrapperProps = {
  isVisible: boolean;
  children: React.ReactNode;
};

export type TabsFilterProps = {
  selectedTab: 'view-all' | 'active' | 'inactive';
  onTabChange: (tab: 'view-all' | 'active' | 'inactive') => void;
};

export type ChannelProps = {
  selectedTab: 'view-all' | 'active' | 'inactive';
  connectionStatus: Record<string, boolean>;
  onConnectionChange: (channelName: string, isConnected: boolean) => void;
  channels: Channel[];
  heading?: string;
  showViewDetails?: boolean;
  viewMoreLink?: string;
};

export type ViewDetailsProps = {
  href: string;
};

export type FilteredIntegrationProps = {
  channels: Channel[];
  heading: string;
};
