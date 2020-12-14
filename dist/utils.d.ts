export declare const getNormalizeTralingSlashPath: (path: string, removeTralingSlash?: boolean) => string;
export declare const getAllViableLocaleRegex: (locale: string) => RegExp;
export declare const getMatchLocaleByPath: <T extends {
    [x: string]: string;
}>(path: string, supportedLocales: T) => string | undefined;
export declare const getLocaleOmmitedPath: <T extends {
    [x: string]: string;
}>(path: string, supportedLocales: T) => string;
export declare const getLocaleOmmitedUrl: <T extends {
    [x: string]: string;
}>(url: string, supportedLocales: T) => string;
