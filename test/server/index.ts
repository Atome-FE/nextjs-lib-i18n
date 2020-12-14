import express from 'express';
import next from 'next';
import { parse } from 'url';
import { localeParser } from '../../src/middleware';
import { defaultLocale, supportedLocales } from '../client/common/locale';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: 'test/client/' });
const handle = app.getRequestHandler();

const nextHandler: express.Handler = (req, res) => {
  // Be sure to pass `true` as the second argument to `url.parse`.
  // This tells it to parse the query portion of the URL.
  const parsedUrl = parse(req.url!, true);
  handle(req, res, parsedUrl);
};

app.prepare().then(() => {
  const server = express();
  server
    .use(localeParser({ supportedLocales, defaultLocale }))
    .use(nextHandler);
  server.listen(3000, () => {
    console.log(`> Ready on http://localhost:3000`);
  });
});
