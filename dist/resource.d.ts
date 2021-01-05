import type { StringMap, TOptions } from 'i18next';
import type { ValidLocale } from './type';
declare const ResourceSymbol: unique symbol;
declare type IResource<T extends object, SupportedLocale extends {
    [lang: string]: ValidLocale;
}, KeyOfSupportedLocale extends keyof SupportedLocale> = {
    [lng in SupportedLocale[KeyOfSupportedLocale]]?: T;
} & {
    [ResourceSymbol]?: string;
};
declare type TFunction<T extends object> = <K extends keyof T, TResult = T[K], TInterpolationMap extends object = StringMap>(key: K, options?: TOptions<TInterpolationMap> | string) => TResult;
export declare class I18Next<SupportedLocale extends {
    [lang: string]: ValidLocale;
}, KeyOfSupportedLocale extends keyof SupportedLocale, LocaleCode extends SupportedLocale[KeyOfSupportedLocale]> {
    supportedLocales: SupportedLocale;
    deafultLocale: LocaleCode;
    private nsCounter;
    private constructor();
    static init<SupportedLocale extends {
        [lang: string]: ValidLocale;
    }, KeyOfSupportedLocale extends keyof SupportedLocale, LocaleCode extends SupportedLocale[KeyOfSupportedLocale]>(options: {
        supportedLocales: SupportedLocale;
        defaultLocale: LocaleCode;
    }): I18Next<SupportedLocale, keyof SupportedLocale, LocaleCode>;
    useChangeLocale: () => <K extends keyof SupportedLocale>(locale: SupportedLocale[K]) => void;
    useCurrentLanguage: () => string;
    useLocaleCanonicalPath: ({ reserveDefaultLocalePath }?: {
        reserveDefaultLocalePath: boolean;
    }) => string;
    changeLanguage: (language: string) => Promise<TFunction<object>>;
    useResource: <T extends object>(resource: IResource<T, SupportedLocale, keyof SupportedLocale>) => {
        t: TFunction<T>;
    };
    createResource: <T extends object>(resource: IResource<T, SupportedLocale, keyof SupportedLocale>) => IResource<T, SupportedLocale, keyof SupportedLocale>;
}
export {};
