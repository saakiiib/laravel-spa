# Laravel SPA

> SPA-speed navigation for Laravel Blade — no jQuery, no Livewire, no Inertia, no build step.

Works with Laravel 10, 11, and 12. Supports both `@extends` and `x-layout` component patterns.

---

## Install

```bash
composer require saakiiib/laravel-spa
php artisan vendor:publish --tag=spa-assets
```

Add to your layout before `</body>`:

```html
<script src="{{ asset('vendor/laravel-spa/spa-engine.js') }}"></script>
```

---

## Usage

**1. Add the trait to your controller**

```php
use Sakib\LaravelSpa\RendersSpaView;

class PageController extends Controller
{
    use RendersSpaView;

    public function home()
    {
        return $this->renderSpa('frontend.home', compact('products'));
    }
}
```

**2. Mark your content area**

```html
<main data-spa-content>
    @yield('content')
</main>
```

That's it. Your Blade views don't change at all.

---

## What you get

- ⚡ No full page reloads on navigation
- 🔗 URL changes, back/forward button works
- 📄 Direct URLs, refresh, and sharing all work normally
- 🎨 Per-page styles load and unload automatically
- 📜 Per-page scripts load and unload automatically
- 🔒 Session expiry handled — redirects cleanly instead of breaking
- 🚫 Zero JS dependencies

---

## Opt out a link

```html
<a href="/logout" data-spa="off">Logout</a>
```

## Active nav

```html
<a href="{{ route('home') }}" data-spa-link="true">Home</a>
```

Adds `active` class automatically on current page.

## Loading state

```css
[data-spa-loading='true'] #your-content {
    opacity: 0.5;
}
```

`data-spa-loading` is toggled on `<body>` during every navigation.

## Programmatic navigation

```js
window.spaNavigate('/page');
```

---

## x-layout support

Mark your layout's own styles and scripts so the package knows what's global vs page-specific:

```html
<style data-spa-layout-style> /* global styles */ </style>
<script data-spa-layout-script> /* global scripts */ </script>
```

Page views stay completely clean — no attributes needed.

---

## vs existing packages

| | spatie/laravel-pjax | jacobbennett/pjax | **saakiiib/laravel-spa** |
|---|:---:|:---:|:---:|
| jQuery required | ✅ | ✅ | ❌ |
| Middleware based | ✅ | ✅ | ❌ |
| x-layout support | ❌ | ❌ | ✅ |
| Script lifecycle | ❌ | ❌ | ✅ |
| Session handling | ❌ | ❌ | ✅ |
| Zero dependencies | ❌ | ❌ | ✅ |

---

## Requirements

- PHP 8.1+
- Laravel 10 / 11 / 12

## License

MIT — made by [Sakib](https://github.com/saakiiib)