const { serve, Route } = require('./dist/main');

serve({
  path: './',
  port: 8080,
  routes: [
    new Route('/*.js', (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Intercepted \n');
    }),
  ],
});
