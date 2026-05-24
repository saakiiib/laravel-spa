# Laravel SPA — by [Sakib](https://github.com/saakiiib)

By default, every link click in Laravel loads a full new page — HTML, CSS, JS, fonts, everything re-downloads. SPA navigation skips that. Only the content changes, the rest stays. Faster, smoother, no white flash between pages.

Most Laravel SPA solutions force you to either abandon Blade entirely (Inertia) or add jQuery (pjax). This package adds that same speed on top of your existing Blade views — no rewrite, nothing changes except how fast it feels.

---

## Quick Start

```bash
composer require saakiiib/laravel-spa
php artisan vendor:publish --tag=spa-assets
```

> Add `/public/vendor` to your `.gitignore` to avoid committing published assets.

---

## Setup — `@extends` / `@section`

**1. Layout file**

Add `@spaContent` to your content wrapper and `@spaEngine` before `</body>`. Make sure `@yield('script')` comes after `@spaEngine`.

```blade
<main @spaContent>
    @yield('content')
</main>

@spaEngine
@yield('script')
```

**2. Navigation links**

Add `@spa` to links you want SPA navigation on. Links without `@spa` do a normal full reload.

```blade
<a href="{{ route('home') }}" @spa>Home</a>
<a href="{{ route('about') }}" @spa>About</a>
<a href="{{ route('logout') }}">Logout</a>
```

**3. Controller**

```php
public function home()
{
    return spa('pages.home');
}

public function about()
{
    return spa('pages.about', compact('data'));
}
```

**4. Page views — no changes needed**

```blade
@extends('layouts.app')

@section('title', 'Home')

@section('style')
    <style>
        .hero { background: #1a3c6e; color: #fff; padding: 60px; }
    </style>
@endsection

@section('content')
    <div class="hero">
        <h1>Welcome</h1>
    </div>
@endsection

@section('script')
    <script>
        console.log('page loaded');
    </script>
@endsection
```

---

## Setup — `x-layout` components

**1. Layout component**

Add `@spaContent` to your content wrapper and `@spaEngine` before `</body>`.

```blade
<head>
    <style>
        /* global styles */
    </style>

    {{ $style ?? '' }}
</head>
<body>
    <main @spaContent>
        {{ $slot }}
    </main>

    <script>
        /* global scripts */
    </script>

    @spaEngine
    {{ $script ?? '' }}
</body>
```

**2. Navigation links** — same as above, add `@spa`:

```blade
<a href="{{ route('home') }}" @spa>Home</a>
<a href="{{ route('logout') }}">Logout</a>
```

**3. Controller** — same as above:

```php
public function home()
{
    return spa('pages.home');
}
```

**4. Page views**

```blade
<x-app-layout title="Home">

    <x-slot:style>
        <style>
            .hero { background: #1a3c6e; color: #fff; padding: 60px; }
        </style>
    </x-slot:style>

    <div class="hero">
        <h1>Welcome</h1>
    </div>

    <x-slot:script>
        <script>
            console.log('page loaded');
        </script>
    </x-slot:script>

</x-app-layout>
```

---

## What works out of the box

- URL updates, back/forward button, refresh, direct links — all work
- Per-page styles and scripts load and unload on every navigation
- Session expiry redirects cleanly instead of breaking
- Hover prefetch — pages start loading before you even click
- Works with both `@extends` and `x-layout`

---

## Requirements

- PHP 8.1+
- Laravel 10, 11, or 12

---

## Contributing

Found a bug or want to improve something? PRs are welcome on [GitHub](https://github.com/saakiiib/laravel-spa).

---

## License

MIT — [Sakib](https://github.com/saakiiib)