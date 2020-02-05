# fx87

Start a dev file server programmatically.

## Examples

Start a file server on current directory:

```ts
const { serve } = require('fx87');

// `serve` also returns an instance of http.Server object.
serve({ path: './', port: 8080 });
```

Start a file server and intercept all `.js` file requests:

```js
const { serve, Route } = require('fx87');

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
```
