import URI from 'urijs';
import type { ValidLocale } from './type';

export const getNormalizeTralingSlashPath = (
  path: string,
  removeTralingSlash = true
) => {
  const uri = new URI(path);
  if (uri.path().endsWith('/')) {
    return removeTralingSlash ? uri.directory() : uri.path();
  } else {
    return removeTralingSlash ? uri.path() : uri.path() + '/';
  }
};

export const getAllViableLocaleRegex = (locale: string) => {
  const [language, region] = locale.split('-');
  // here we support checking capitalized and trailing slash
  // valid example: /en-us  /en-US /EN-US /EN-us /en-us/
  return new RegExp(
    `^/(${language}|${language.toUpperCase()})-(${region}|${region.toUpperCase()})(\/?)`
  );
};

export const getMatchLocaleByPath = <T extends { [x: string]: ValidLocale }>(
  path: string,
  supportedLocales: T
) => {
  return Object.values(supportedLocales).find((locale) => {
    return getAllViableLocaleRegex(locale).test(path);
  });
};

export const getLocaleOmmitedPath = <T extends { [x: string]: ValidLocale }>(
  path: string,
  supportedLocales: T
) => {
  const locale = getMatchLocaleByPath(path, supportedLocales);
  if (locale) {
    return path.replace(getAllViableLocaleRegex(locale), '/');
  } else {
    return path;
  }
};

export const getLocaleOmmitedUrl = <T extends { [x: string]: ValidLocale }>(
  url: string,
  supportedLocales: T
) => {
  const uri = new URI(url);
  const newUri = uri.pathname(
    getLocaleOmmitedPath(uri.pathname(), supportedLocales)
  );
  return newUri.readable();
};
