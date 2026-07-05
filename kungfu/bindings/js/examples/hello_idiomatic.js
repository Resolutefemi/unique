// Hello-world example using the idiomatic JS wrapper.
//
// Run with:
//   npm install
//   npm run build
//   node examples/hello_idiomatic.js

const { Kungfu } = require('..');

(async () => {
  const app = new Kungfu();

  // Sync handler — just return a response object.
  await app.get('/hello', (req) => {
    console.log(`[${req.method}] ${req.path}`);
    return {
      status: 200,
      body: JSON.stringify({ message: 'world', lang: 'javascript', framework: 'kungfu' })
    };
  });

  // Async handler — return a Promise.
  await app.post('/echo/:name', async (req) => {
    const name = JSON.parse(req.params).name || 'anonymous';
    const body = req.body || '';
    return {
      status: 200,
      body: JSON.stringify({ hello: name, you_sent: body })
    };
  });

  // Error handling.
  await app.get('/error', (req) => {
    throw new Error('Something went wrong!');
  });

  console.log('🥋 Kungfu (JS) listening on http://localhost:3000');
  app.listen(3000).then(() => console.log('Server stopped'));
})();
