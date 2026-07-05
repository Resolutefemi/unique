# Ruby binding for Kungfu.js via FFI gem

## Install

```bash
gem install kungfu
```

## Quickstart

```ruby
require 'kungfu'

app = Kungfu::App.new

app.get('/hello') do |req|
  [200, {'content-type' => 'text/plain'}, ['world']]
end

app.listen(3000)
```

## Requirements
- Ruby 3+
- ffi gem
- libkungfu_core.so

## Package
- **RubyGems:** `kungfu`
- **Extension:** `.rb`
