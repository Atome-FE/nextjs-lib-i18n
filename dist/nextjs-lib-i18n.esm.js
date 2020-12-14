import i18next from 'i18next';
import URI from 'urijs';
import { useTranslation, initReactI18next } from 'react-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import _Link from 'next/link';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var getNormalizeTralingSlashPath = function getNormalizeTralingSlashPath(path, removeTralingSlash) {
  if (removeTralingSlash === void 0) {
    removeTralingSlash = true;
  }

  var uri = new URI(path);

  if (uri.path().endsWith('/')) {
    return removeTralingSlash ? uri.directory() : uri.path();
  } else {
    return removeTralingSlash ? uri.path() : uri.path() + '/';
  }
};
var getAllViableLocaleRegex = function getAllViableLocaleRegex(locale) {
  var _locale$split = locale.split('-'),
      language = _locale$split[0],
      region = _locale$split[1]; // here we support checking capitalized and trailing slash
  // valid example: /en-us  /en-US /EN-US /EN-us /en-us/


  return new RegExp("^/(" + language + "|" + language.toUpperCase() + ")-(" + region + "|" + region.toUpperCase() + ")(/?)");
};
var getMatchLocaleByPath = function getMatchLocaleByPath(path, supportedLocales) {
  return Object.values(supportedLocales).find(function (locale) {
    return getAllViableLocaleRegex(locale).test(path);
  });
};
var getLocaleOmmitedPath = function getLocaleOmmitedPath(path, supportedLocales) {
  var locale = getMatchLocaleByPath(path, supportedLocales);

  if (locale) {
    return path.replace(getAllViableLocaleRegex(locale), '/');
  } else {
    return path;
  }
};
var getLocaleOmmitedUrl = function getLocaleOmmitedUrl(url, supportedLocales) {
  var uri = new URI(url);
  var newUri = uri.pathname(getLocaleOmmitedPath(uri.pathname(), supportedLocales));
  return newUri.readable();
};

var ResourceSymbol = /*#__PURE__*/Symbol('i18nextResource');
var I18Next = /*#__PURE__*/function () {
  function I18Next(supportedLocales, deafultLocale) {
    var _this = this,
        _resources;

    this.supportedLocales = supportedLocales;
    this.deafultLocale = deafultLocale;
    this.nsCounter = 0;

    this.useChangeLocale = function () {
      var router = useRouter();

      var handleChange = function handleChange(locale) {
        var localeOmmitedPath = getLocaleOmmitedPath(router.asPath, _this.supportedLocales);
        var as = "/" + locale + localeOmmitedPath;
        router.push(router.pathname, as);
      };

      return handleChange;
    };

    this.useCurrentLanguage = function () {
      return i18next.language;
    };

    this.useLocaleCanonicalPath = function (_temp) {
      var _ref = _temp === void 0 ? {
        reserveDefaultLocalePath: false
      } : _temp,
          reserveDefaultLocalePath = _ref.reserveDefaultLocalePath;

      var router = useRouter();

      var currentLanguage = _this.useCurrentLanguage();

      var path;

      if (currentLanguage === _this.deafultLocale && !reserveDefaultLocalePath) {
        path = getLocaleOmmitedPath(router.asPath, _this.supportedLocales);
      } else {
        if (!getMatchLocaleByPath(router.asPath, _this.supportedLocales)) {
          path = "/" + currentLanguage + router.asPath;
        } else {
          path = router.asPath;
        }
      }

      return getNormalizeTralingSlashPath(path);
    };

    this.useResource = function (resource) {
      if (!resource[ResourceSymbol]) throw Error('Resource must be created using createResource function');

      var lng = _this.useCurrentLanguage();

      var useTranslationFn = useTranslation(resource[ResourceSymbol]).t;

      var t = function t(field, options) {
        return useTranslationFn(field, Object.assign({}, _extends({}, options), {
          lng: lng
        }));
      };

      return {
        t: t
      };
    };

    this.createResource = function (resource) {
      resource[ResourceSymbol] = (_this.nsCounter++).toString();
      Object.entries(resource).forEach(function (_ref2) {
        var lng = _ref2[0],
            keyValue = _ref2[1];

        if (!i18next.hasResourceBundle(lng, resource[ResourceSymbol])) {
          i18next.addResourceBundle(lng, resource[ResourceSymbol], keyValue, true, true);
        }
      });
      return resource;
    };

    i18next.use(initReactI18next).init({
      resources: (_resources = {}, _resources[deafultLocale] = {}, _resources),
      lng: deafultLocale,
      supportedLngs: Object.values(supportedLocales),
      partialBundledLanguages: true,
      lowerCaseLng: true,
      fallbackLng: Object.values(supportedLocales),
      interpolation: {
        escapeValue: false
      }
    });
  }

  I18Next.init = function init(options) {
    return new I18Next(options.supportedLocales, options.defaultLocale);
  };

  return I18Next;
}();

var isServer = typeof window === 'undefined';
var localeContext = {
  locale: '',
  i18n: null
};
var LocaleContext = /*#__PURE__*/React.createContext(localeContext);
var _LocaleProvider = LocaleContext.Provider;
var getLocaleFromAppContext = function getLocaleFromAppContext(ctx, defaultLocale) {
  var _locale$toString;

  var headers = ctx.req ? ctx.req.headers : {
    locale: defaultLocale
  };
  var locale = headers.locale;
  return (_locale$toString = locale == null ? void 0 : locale.toString()) != null ? _locale$toString : defaultLocale;
};
var LocaleProvider = function LocaleProvider(_ref) {
  var initialLocale = _ref.initialLocale,
      children = _ref.children,
      i18n = _ref.i18n;
  var router = useRouter();
  var locale = React.useMemo(function () {
    var _getMatchLocaleByPath;

    // server's router.asPath has been ommited in locale middleware
    if (isServer) return initialLocale; // we detect client side locale from router.asPath
    else return (_getMatchLocaleByPath = getMatchLocaleByPath(router.asPath, i18n.supportedLocales)) != null ? _getMatchLocaleByPath : initialLocale;
  }, [router]);
  i18next.language = locale;
  return React.createElement(_LocaleProvider, {
    value: {
      locale: locale,
      i18n: i18n
    }
  }, children);
};

var localeParser = function localeParser(_ref) {
  var supportedLocales = _ref.supportedLocales,
      defaultLocale = _ref.defaultLocale;
  return function (req, _, next) {
    req.headers = Object.assign({}, req.headers, {
      locale: defaultLocale
    }); // assign default language

    try {
      var matchedLocale = getMatchLocaleByPath(req.path, supportedLocales);

      if (matchedLocale) {
        req.headers = Object.assign({}, req.headers, {
          locale: matchedLocale
        });
        req.url = getLocaleOmmitedUrl(req.url, supportedLocales);
      }
    } catch (e) {
      console.error(e);
    } finally {
      next();
    }
  };
};

var Link = function Link(_ref) {
  var children = _ref.children,
      href = _ref.href,
      originAs = _ref.as,
      rest = _objectWithoutPropertiesLoose(_ref, ["children", "href", "as"]);

  var localeContext = React.useContext(LocaleContext);
  var i18n = localeContext.i18n;
  var currentLanguage = i18n.useCurrentLanguage();
  var as = currentLanguage === i18n.deafultLocale ? originAs != null ? originAs : href : "/" + currentLanguage + (originAs != null ? originAs : href);
  return React.createElement(_Link, Object.assign({
    href: href,
    as: as
  }, rest), children);
};

export { I18Next, Link, LocaleContext, LocaleProvider, _LocaleProvider, getAllViableLocaleRegex, getLocaleFromAppContext, getLocaleOmmitedPath, getLocaleOmmitedUrl, getMatchLocaleByPath, getNormalizeTralingSlashPath, localeParser };
//# sourceMappingURL=nextjs-lib-i18n.esm.js.map
