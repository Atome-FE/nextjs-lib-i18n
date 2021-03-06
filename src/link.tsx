import _Link from 'next/link';
import React from 'react';
import { LocaleContext } from './provider';
import type { LinkProps } from 'next/link';

export const Link: React.FC<LinkProps> = ({
  children,
  href,
  as: originAs,
  ...rest
}) => {
  const localeContext = React.useContext(LocaleContext);
  const i18n = localeContext.i18n;
  const currentLanguage = i18n.useCurrentLanguage();
  const as =
    currentLanguage === i18n.deafultLocale
      ? originAs ?? href
      : `/${currentLanguage}${originAs ?? href}`;
  return (
    <_Link href={href} as={as} {...rest}>
      {children}
    </_Link>
  );
};
