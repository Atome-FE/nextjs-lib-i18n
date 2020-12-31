# Nextjs Lib i18n

An opinionated i18next wrapper for nextjs, manipulate locale config and provide utilities for both frontend and backend


## Pre-request

- React
- Next.js
- Express
- react-i18next

## Installation

- Install via npm

  ```bash
  npm install --save git+https://github.com/Atome-FE/nextjs-lib-i18n.git#master
  ```

## Integration Guide

- 1. Create a lib/util ts file in your folder (eg. we name it lib/i18n.ts)
  
  ```typescript
  // lib/i18n.ts
  import { I18Next } from 'nextjs-lib-i18n'

  export const supportedLocales = {
    'zh-hk': 'zh-hk' as const,
    'zh-cn': 'zh-cn' as const,
  };

  export const defaultLocale = supportedLocales['zh-cn'];

  const i18n = I18Next.init({ supportedLocales, defaultLocale });

  export { i18n };
  ```

- 2. In your _app.tsx
  
  ```tsx
  // _app.tsx
  import App from "next/app";
  import type { AppProps, AppContext } from 'next/app'
  import { getLocaleFromAppContext, LocaleProvider } from 'nextjs-lib-i18n'
  import { defaultLocale, i18n } from 'lib/i18n'

  function MyApp({ Component, pageProps, locale }: AppProps & { locale: string }) {
    return (
      <LocaleProvider initialLocale={locale} i18n={i18n}>
        <Component {...pageProps} />
      </LocaleProvider>
    )
  }

  MyApp.getInitialProps = async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext);
    const locale = getLocaleFromAppContext(appContext.ctx, defaultLocale)
    return { ...appProps, locale }
  }

  export default MyApp
  ```

- 3. In your server.ts, we assume you already use express.js
  
  ```typescript
  // server/index.ts
  import express from 'express';
  import next from 'next';
  import { parse } from 'url';
  import { localeParser } from 'nextjs-lib-i18n';
  import { defaultLocale, supportedLocales } from 'lib/i18n';

  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });
  const handle = app.getRequestHandler();

  const nextHandler: express.Handler = (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  };

  app.prepare().then(() => {
    const server = express();
    server
      .use(localeParser({ supportedLocales, defaultLocale }))
      .use(nextHandler);
    server.listen(3000, () => {
      console.log(`> Ready on http://localhost:3000`);
    });
  });

  ```

- 4. Change Language
  - Option 1. will change route to /zh-hk

    ```tsx
    // initialize
    const i18n = I18Next.init({ supportedLocales, defaultLocale });

    // in your component
    const App = () => {
      const changeLocale = i18n.useChangeLocale()
      return (
        <Button onClick={() => changeLocale('zh-hk')} />
      )
    }
    ```
  - Option 2. change language but keep current route

    ```tsx
    // initialize
    const i18n = I18Next.init({ supportedLocales, defaultLocale });

    // in your component
    const App = () => {
      return (
        <Button onClick={() => i18n.changeLanguage('zh-hk')} />
      )
    }
    ```

## Examples
The project is in an early stage, if you seeking for more example details, please check repo /test folder