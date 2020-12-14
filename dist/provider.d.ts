import React from 'react';
import type { NextPageContext } from 'next';
import type { ValidLocale } from './type';
import type { I18Next } from './resource';
export declare const LocaleContext: React.Context<{
    locale: ValidLocale;
    i18n: I18Next<any, any, any>;
}>;
export declare const _LocaleProvider: React.Provider<{
    locale: ValidLocale;
    i18n: I18Next<any, any, any>;
}>;
export declare const getLocaleFromAppContext: (ctx: NextPageContext, defaultLocale: string) => string;
export declare const LocaleProvider: React.FC<{
    initialLocale: ValidLocale;
    i18n: I18Next<any, any, any>;
}>;
