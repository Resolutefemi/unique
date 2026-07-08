// Hello-world example using the JS/TS binding.
//
//   npm install
//   npm run build
//   node examples/hello.js

const { Unique } = require('..');

const app = new Unique();

app.get('/hello', (req, res) => {
  res.json({ message: 'world', framework: 'unique', lang: 'javascript' });
});

app.post('/echo/:name', async (req, res) => {
  res.json({
    hello: req.params.name,
    youSent: req.body,
  });
});

app.listen(3000).then(() => console.log('🥋 unique listening on http://localhost:3000'));
