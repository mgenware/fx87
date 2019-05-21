import * as http from 'http';
import * as finalhandler from 'finalhandler';
import * as serveStatic from 'serve-static';
import * as serveIndex from 'serve-index';
import chalk from 'chalk';
import * as UrlPattern from 'url-pattern';

type RouteFn = (req: any, res: any) => void;

export class Route {
  compiledPattern: UrlPattern;
  constructor(public pattern: string, public callback: RouteFn) {
    this.compiledPattern = new UrlPattern(pattern);
  }
}

export interface IOptions {
  path: string;
  port?: number;
  routes?: Route[];
}

function logError(err: Error) {
  console.error(chalk.red(err.stack || err.toString()));
}

export function serve(opt: IOptions) {
  if (!opt) {
    throw new Error(`opt argument cannot be empty`);
  }
  const { routes } = opt;
  const serveFile = serveStatic(opt.path);
  const index = serveIndex(opt.path, { icons: true });
  const server = http.createServer((req: any, res: any) => {
    console.log(chalk.gray(`Serving "${req.url}"`));

    // Check if the request matches one of the routes
    let handled = false;
    for (const r of routes || []) {
      if (r.compiledPattern.match(req.url)) {
        r.callback(req, res);
        handled = true;
        break;
      }
    }

    if (handled) {
      return;
    }

    const done = finalhandler(req, res, { onerror: logError });
    serveFile(req, res, (err: Error) => {
      if (err) {
        return done(err);
      }
      index(req, res, done);
    });
  });
  const port = opt.port || 8080;
  console.log(chalk.green(`Starting server on port ${port}`));
  server.listen(port);
}
