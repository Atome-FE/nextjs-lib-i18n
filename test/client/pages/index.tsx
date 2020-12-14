import React from 'react';
import { i18n } from '../common/locale';
import { Link } from '../../../dist';
import type { NextPage } from 'next';

const resource = i18n.createResource({
  'zh-cn': {
    text: '简体中文',
  },
  'zh-hk': {
    text: '繁體中文',
  },
});

const Index: NextPage<{}> = () => {
  const { t } = i18n.useResource(resource);
  const changeLocale = i18n.useChangeLocale();
  const canonicalPath = i18n.useLocaleCanonicalPath();

  return (
    <div>
      <div>{t('text')}</div>
      <div>
        <Link href="/test">
          <a>test</a>
        </Link>
      </div>
      <div>
        <button onClick={() => changeLocale('zh-hk')}>change</button>
      </div>
      <div>canonicalPath: {canonicalPath}</div>
    </div>
  );
};

export default Index;
