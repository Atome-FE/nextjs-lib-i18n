import i18next from 'i18next';
import {
  getLocaleOmmitedPath,
  getMatchLocaleByPath,
  getNormalizeTralingSlashPath,
} from './utils';
import { initReactI18next } from 'react-i18next';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import type { StringMap, TOptions } from 'i18next';
import type { ValidLocale } from './type';

const ResourceSymbol = Symbol('i18nextResource');

type IResource<
  T extends object,
  SupportedLocale extends { [lang: string]: ValidLocale },
  KeyOfSupportedLocale extends keyof SupportedLocale
> = {
  [lng in SupportedLocale[KeyOfSupportedLocale]]?: T;
} & {
  [ResourceSymbol]?: string;
};

type TFunction<T extends object> = <
  K extends keyof T,
  TResult = T[K],
  TInterpolationMap extends object = StringMap
>(
  key: K,
  options?: TOptions<TInterpolationMap> | string
) => TResult;

export class I18Next<
  SupportedLocale extends { [lang: string]: ValidLocale },
  KeyOfSupportedLocale extends keyof SupportedLocale,
  LocaleCode extends SupportedLocale[KeyOfSupportedLocale]
> {
  private nsCounter = 0;

  private constructor(
    public supportedLocales: SupportedLocale,
    public deafultLocale: LocaleCode
  ) {
    i18next.use(initReactI18next).init({
      resources: { [deafultLocale]: {} },
      lng: deafultLocale,
      supportedLngs: Object.values(supportedLocales),
      partialBundledLanguages: true,
      lowerCaseLng: true,
      fallbackLng: Object.values(supportedLocales),
      interpolation: { escapeValue: false },
    });
  }

  static init<
    SupportedLocale extends { [lang: string]: ValidLocale },
    KeyOfSupportedLocale extends keyof SupportedLocale,
    LocaleCode extends SupportedLocale[KeyOfSupportedLocale]
  >(options: { supportedLocales: SupportedLocale; defaultLocale: LocaleCode }) {
    return new I18Next(options.supportedLocales, options.defaultLocale);
  }

  useChangeLocale = () => {
    const router = useRouter();
    const handleChange = <K extends keyof SupportedLocale>(
      locale: SupportedLocale[K]
    ) => {
      const localeOmmitedPath = getLocaleOmmitedPath(
        router.asPath,
        this.supportedLocales
      );
      const as = `/${locale}${localeOmmitedPath}`;
      router.push(router.pathname, as);
    };
    return handleChange;
  };

  useCurrentLanguage = () => {
    return i18next.language;
  };

  useLocaleCanonicalPath = (
    { reserveDefaultLocalePath } = { reserveDefaultLocalePath: false }
  ) => {
    const router = useRouter();
    const currentLanguage = this.useCurrentLanguage();
    let path: string;
    if (currentLanguage === this.deafultLocale && !reserveDefaultLocalePath) {
      path = getLocaleOmmitedPath(router.asPath, this.supportedLocales);
    } else {
      if (!getMatchLocaleByPath(router.asPath, this.supportedLocales)) {
        path = `/${currentLanguage}${router.asPath}`;
      } else {
        path = router.asPath;
      }
    }
    return getNormalizeTralingSlashPath(path);
  };

  changeLanguage = async (language: string) => {
    return new Promise<TFunction<object>>((res, rej) => {
      i18next.changeLanguage(language, (error, t) => {
        if (error) rej(error);
        else res(t);
      });
    });
  };

  useResource = <T extends object>(
    resource: IResource<T, SupportedLocale, keyof SupportedLocale>
  ) => {
    if (!resource[ResourceSymbol])
      throw Error('Resource must be created using createResource function');
    const lng = this.useCurrentLanguage();
    const useTranslationFn = useTranslation(resource[ResourceSymbol]).t;
    const t = (field: string, options: object) =>
      useTranslationFn(field, Object.assign({}, { ...options }, { lng }));
    return { t } as { t: TFunction<T> };
  };

  createResource = <T extends object>(
    resource: IResource<T, SupportedLocale, keyof SupportedLocale>
  ) => {
    resource[ResourceSymbol] = (this.nsCounter++).toString();
    Object.entries(resource).forEach(([lng, keyValue]) => {
      if (!i18next.hasResourceBundle(lng, resource[ResourceSymbol]!)) {
        i18next.addResourceBundle(
          lng,
          resource[ResourceSymbol]!,
          keyValue,
          true,
          true
        );
      }
    });
    return resource;
  };
}
