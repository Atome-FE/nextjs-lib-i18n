import { I18Next } from '../src';

const supportedLocales = {
  'zh-hk': 'zh-hk' as const,
  'zh-cn': 'zh-cn' as const,
};

const defaultLocale = supportedLocales['zh-cn'];

const i18n = I18Next.init({
  supportedLocales,
  defaultLocale,
});

const resource = i18n.createResource({
  'zh-cn': {
    test: '123',
  },
  'zh-hk': {
    test: '234',
  },
});

const Comp = () => {
  const { t } = i18n.useResource(resource);
  return <div>{t('test')}</div>;
};
