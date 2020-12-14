import type express from 'express';
import type { ValidLocale } from './type';
export declare const localeParser: ({ supportedLocales, defaultLocale, }: {
    supportedLocales: {
        [lang: string]: string;
    };
    defaultLocale: ValidLocale;
}) => (req: express.Request, _: express.Response, next: express.NextFunction) => void;
