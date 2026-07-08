# Ruby binding for Unique.js via FFI gem

## Install

```bash
gem install unique
```

## Quickstart

```ruby
require 'unique'

app = Unique::App.new

app.get('/hello') do |req|
  [200, {'content-type' => 'text/plain'}, ['world']]
end

app.listen(3000)
```

## Requirements
- Ruby 3+
- ffi gem
- libunique_core.so

## Package
- **RubyGems:** `unique`
- **Extension:** `.rb`
