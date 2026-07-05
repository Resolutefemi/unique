# C# binding for Kungfu.js via P/Invoke

## Install

```bash
dotnet add package Kungfu.Core
```

## Quickstart

```csharp
using Kungfu;
using System;

var app = new KungfuApp();

app.Get("/hello", (req, res) => {
    res.Text(200, "world");
});

app.Listen(3000);
```

## Requirements
- .NET 8+
- libkungfu_core.so / .dll / .dylib

## Package
- **NuGet:** `Kungfu.Core`
- **Extension:** `.cs`
