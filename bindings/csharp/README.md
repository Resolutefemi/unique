# C# binding for Unique.js via P/Invoke

## Install

```bash
dotnet add package Unique.Core
```

## Quickstart

```csharp
using Unique;
using System;

var app = new UniqueApp();

app.Get("/hello", (req, res) => {
    res.Text(200, "world");
});

app.Listen(3000);
```

## Requirements
- .NET 8+
- libunique_core.so / .dll / .dylib

## Package
- **NuGet:** `Unique.Core`
- **Extension:** `.cs`
