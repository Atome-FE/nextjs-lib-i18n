import { I18Next } from '../../../dist';

export const supportedLocales = {
  'zh-hk': 'zh-hk' as const,
  'zh-cn': 'zh-cn' as const,
};

export const defaultLocale = supportedLocales['zh-cn'];

export const i18n = I18Next.init({ supportedLocales, defaultLocale });
