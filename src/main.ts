import * as http from 'http';
import * as finalhandler from 'finalhandler';
import * as serveStatic from 'serve-static';
import * as serveIndex from 'serve-index';
import chalk from 'chalk';

export interface IOptions {
  path: string;
  port?: number;
}

function logError(err: Error) {
  console.error(chalk.red(err.stack || err.toString()));
}

export function serve(opt: IOptions) {
  if (!opt) {
    throw new Error(`opt argument cannot be empty`);
  }
  const serveFile = serveStatic(opt.path);
  const index = serveIndex(opt.path, { icons: true });
  const server = http.createServer((req: any, res: any) => {
    console.log(chalk.gray(`Serving "${req.url}"`));
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
