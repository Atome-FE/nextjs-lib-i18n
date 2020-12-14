import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import { getLocaleFromAppContext, LocaleProvider } from '../../../dist';
import { defaultLocale, i18n } from '../common/locale';

function MyApp({
  Component,
  pageProps,
  locale,
}: AppProps & { locale: string }) {
  return (
    <LocaleProvider initialLocale={locale} i18n={i18n}>
      <Component {...pageProps} />
    </LocaleProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const locale = getLocaleFromAppContext(appContext.ctx, defaultLocale);

  return { ...appProps, locale };
};

export default MyApp;
