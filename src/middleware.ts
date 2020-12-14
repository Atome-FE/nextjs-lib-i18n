import { getLocaleOmmitedUrl, getMatchLocaleByPath } from './utils';
import type express from 'express';
import type { ValidLocale } from './type';

export const localeParser = ({
  supportedLocales,
  defaultLocale,
}: {
  supportedLocales: { [lang: string]: ValidLocale };
  defaultLocale: ValidLocale;
}) => (
  req: express.Request,
  _: express.Response,
  next: express.NextFunction
) => {
  req.headers = Object.assign({}, req.headers, { locale: defaultLocale }); // assign default language
  try {
    const matchedLocale = getMatchLocaleByPath(req.path, supportedLocales);
    if (matchedLocale) {
      req.headers = Object.assign({}, req.headers, { locale: matchedLocale });
      req.url = getLocaleOmmitedUrl(req.url, supportedLocales);
    }
  } catch (e) {
    console.error(e);
  } finally {
    next();
  }
};
