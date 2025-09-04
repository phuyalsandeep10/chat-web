import zapier from '@/assets/images/integration/zapier.svg';
import messenger from '@/assets/images/integration/messenger.svg';
import shopify from '@/assets/images/integration/shopify.svg';
import hubspot from '@/assets/images/integration/Hubspot.svg';
import prestashop from '@/assets/images/integration/prestashop.svg';
import viber from '@/assets/images/integration/viber.svg';
import pipedrive from '@/assets/images/integration/pipedrive.svg';
import stripe from '@/assets/images/integration/stripe.svg';
import instagram from '@/assets/images/integration/instagram.svg';
import salesforce from '@/assets/images/integration/salesforce.svg';
import tabular from '@/assets/images/integration/tabular.svg';
import { Channel } from './types';

export const activeChannels: Channel[] = [
  {
    image: shopify,
    name: 'Shopify',
    description:
      'Sync your store data and manage orders directly from Shopify.',
    websiteUrl: 'Shopify.com',
  },
  {
    image: hubspot,
    name: 'HubSpot',
    price: '$69',
    description:
      'Manage contacts and automate marketing with HubSpot integration.',
    websiteUrl: 'Hubspot.com',
  },
  {
    image: zapier,
    name: 'Zapier',
    description:
      "Streamline tasks by linking tools using Zapier's powerful automation.",
    websiteUrl: 'Zapier.com',
    route: '/integration/crm/zapier',
  },
  {
    image: prestashop,
    name: 'Prestashop',
    price: '$59',
    description:
      'Manage your online store and orders seamlessly with PrestaShop.',
    websiteUrl: 'Prestashop.com',
  },
  {
    image: messenger,
    name: 'Messenger',
    description: 'Chat with customers instantly through Facebook Messenger.',
    websiteUrl: 'Messenger.com',
  },
  {
    image: viber,
    name: 'Viber',
    description:
      'Connect with your users and send real-time updates through Viber.',
    websiteUrl: 'Viber.com',
  },
];

export const crmChannels: Channel[] = [
  {
    image: hubspot,
    name: 'HubSpot',
    price: '$69',
    description:
      'Manage contacts and automate marketing with HubSpot integration.',
    websiteUrl: 'Hubspot.com',
  },
  {
    image: pipedrive,
    name: 'Pipedrive',
    price: '$99',
    description:
      'Send the notifications to channels and create projects from messages.',
    websiteUrl: 'Pipedrive.com',
  },
  {
    image: zapier,
    name: 'Zapier',
    price: '$33',
    description:
      'Send the notifications to channels and create projects from messages.',
    websiteUrl: 'Zapier.com',
  },
];

export const marketingChannels: Channel[] = [
  {
    image: shopify,
    name: 'Shopify',
    description:
      'Sync your store data and manage orders directly from Shopify.',
    websiteUrl: 'Shopify.com',
  },
  {
    image: stripe,
    name: 'Stripe',
    price: '$45',
    description:
      'Accept payments and track transactions effortlessly with Stripe.',
    websiteUrl: 'Stripe.com',
  },
  {
    image: prestashop,
    name: 'Prestashop',
    price: '$59',
    description:
      'Manage your online store and orders seamlessly with PrestaShop.',
    websiteUrl: 'Prestashop.com',
  },
];

export const messagingChannels: Channel[] = [
  {
    image: messenger,
    name: 'Messenger',
    price: '$100',
    description:
      'Chat with your customers instantly through Facebook Messenger.',
    websiteUrl: 'Messenger.com',
    route: '/integration/messaging/messenger',
  },
  {
    image: instagram,
    name: 'Instagram',
    price: '$99',
    description:
      'Engage with followers and manage DMs via Instagram integration.',
    websiteUrl: 'Instagram.com',
    route: '/integration/messaging/instagram',
  },
  {
    image: viber,
    name: 'Viber',
    description:
      'Connect with your users and send real-time updates through Viber.',
    websiteUrl: 'Viber.com',
  },
  {
    image: messenger,
    name: 'Slack',
    description:
      'Connect with your users and send real-time updates through Viber.',
    websiteUrl: 'Slack.com',
    route: '/integration/messaging/slack',
  },
  {
    image: instagram,
    name: 'Telegram',
    description:
      'Connect with your users and send real-time updates through Viber.',
    websiteUrl: 'Telegram.com',
    route: '/integration/messaging/telegram',
  },
];

export const recommendedChannels: Channel[] = [
  {
    image: salesforce,
    name: 'SalesForce',
    description:
      'Automate workflows and boost sales efficiency with Salesforce.',
    websiteUrl: 'Salesforce.com',
  },
  {
    image: tabular,
    name: 'Tabular',
    price: '$99',
    description:
      'Connect Tabular to visualize and explore your data in real time.',
    websiteUrl: 'Tabular.com',
  },
  {
    image: pipedrive,
    name: 'Pipedrive',
    description: 'Sync deals and automate your sales pipeline with Pipedrive.',
    websiteUrl: 'Pipedrive.com',
  },
];
