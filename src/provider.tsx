import i18next from 'i18next';
import React from 'react';
import { getMatchLocaleByPath } from './utils';
import { useRouter } from 'next/router';
import type { NextPageContext } from 'next';
import type { ValidLocale } from './type';
import type { I18Next } from './resource';

const isServer = typeof window === 'undefined';

const localeContext = {
  locale: '' as ValidLocale,
  i18n: (null as unknown) as I18Next<any, any, any>,
};

export const LocaleContext = React.createContext<{
  locale: ValidLocale;
  i18n: I18Next<any, any, any>;
}>(localeContext);

export const _LocaleProvider = LocaleContext.Provider;

export const getLocaleFromAppContext = (
  ctx: NextPageContext,
  defaultLocale: string
) => {
  const headers = ctx.req ? ctx.req.headers : { locale: defaultLocale };
  const { locale } = headers;
  return locale?.toString() ?? defaultLocale;
};

export const LocaleProvider: React.FC<{
  initialLocale: ValidLocale;
  i18n: I18Next<any, any, any>;
}> = ({ initialLocale, children, i18n }) => {
  const router = useRouter();
  const locale = React.useMemo(() => {
    // server's router.asPath has been ommited in locale middleware
    if (isServer) return initialLocale;
    // we detect client side locale from router.asPath
    else
      return (
        getMatchLocaleByPath(router.asPath, i18n.supportedLocales) ??
        initialLocale
      );
  }, [router]);
  i18next.language = locale;
  return <_LocaleProvider value={{ locale, i18n }}>{children}</_LocaleProvider>;
};
