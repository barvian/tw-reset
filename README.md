# tw-reset

A 'reset' for your Tailwind config that enforces best practices, improves rendering performance, and reduces bundle size.

---

## Installation

Install the plugin from npm:

```sh
npm install -D tw-reset
```

Then add the preset to your tailwind.config.js file:

```diff
module.exports = {
+  presets: [require('tw-reset')],
   // ...
}
```

> [!IMPORTANT]
> If you're using `<style>` tags in Vue/Svelte, or CSS modules, pass this option to the preset:
> ```
> presets: [
>     require('tw-reset')({
>         optimizeUniversalDefaults: false
>     })
> ]
> ```
> Read [the first section below](#optimized-universal-defaults) for more information.
---

## What it does

### Optimized universal defaults

By default, Tailwind includes the following rule to reset internal custom CSS properties on each new element. You may have seen them in your inspector at some point:

```css
*,
::before,
::after {
	--tw-border-spacing-x: 0;
	--tw-border-spacing-y: 0;
	--tw-translate-x: 0;
	--tw-translate-y: 0;
	--tw-rotate: 0;
	--tw-skew-x: 0;
	/* ... */
}
```

This works, but it's inefficient as they apply to every single element on the page even though they're only needed in their corresponding utilities.

An alternative strategy is available behind an experimental config flag, which optimizes this output and likely improves rendering performance of your site. It's currently used in production on [tailwindcss.com](https://tailwindcss.com). [It was initially considered for the default strategy in Tailwind v3](https://github.com/tailwindlabs/tailwindcss/discussions/7317#discussioncomment-2107898), but was ruled out because it doesn't work with "per-component styles" that cause PostCSS to run multiple times in isolation (i.e. from Vue/Svelte `<style>` tags or CSS modules). However, [these setups are discouraged by Tailwind](https://tailwindcss.com/docs/functions-and-directives#using-apply-with-per-component-css), so tw-reset enables this strategy as default, which enforces best practices on top of the other improvements mentioned.

### `*-opacity` utilities disabled by default

Older versions of Tailwind used `*-opacity` classes to change the opacity of colors, i.e.

```html
<h1 class="text-black text-opacity-50">...</h1>
```

These utilities have been removed from Tailwind documentation, replaced by the [newer opacity modifier syntax](https://tailwindcss.com/docs/upgrade-guide#new-opacity-modifier-syntax). They'll be disabled by default in Tailwind v4, so tw-reset also disables them by default. This has a pleasant side effect of slightly reducing your CSS bundle size and simplifying your color output:

```diff
.border-white {
-  --tw-border-opacity: 1;
-  border-color: rgb(255 255 255 / var(--tw-border-opacity));
+  border-color: #fff;
}
.bg-white {
-  --tw-bg-opacity: 1;
-  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
+  background-color: #fff;
}
.text-white {
-  --tw-text-opacity: 1;
-  color: rgb(255 255 255 / var(--tw-text-opacity));
+  color: #fff;
}
```

### Container queries included by default

```diff
- import containerQueries from '@tailwindcss/container-queries'
import reset from 'tw-reset'

export default {
    presets: [reset],
    plugins: [
-       containerQueries
    ]
}
```

Tailwind v4 [will support container queries out-of-the-box](https://tailwindcss.com/blog/tailwindcss-v4-alpha#designed-for-the-modern-web), so tw-reset includes the [official container query plugin](https://github.com/tailwindlabs/tailwindcss-container-queries) that uses the same syntax.

### Default screens in `rem`

[Tailwind v4 will use `rem` units for its default breakpoints](https://github.com/tailwindlabs/tailwindcss/pull/13469), which better complement the default font sizes and spacing scales that also use `rem`. This was initially considered for Tailwind v1, but [was ruled out due to Safari bugs at the time](https://github.com/tailwindlabs/tailwindcss/discussions/8378#discussioncomment-2779675). Those bugs have since been fixed, so tw-reset provides `rem`-based breakpoints as default. This shouldn't cause any changes to your design if you're using Tailwind's default `px`-based breakpoints.

If you need to refer to these new breakpoints in your code for some reason, you can import them like so:

```js
import { screens } from 'tw-reset/defaultTheme'
```

### Removes deprecated utilities

Tailwind currently ships with a few deprecated utilities that still show up in IntelliSense suggestions:

- `flex-shrink` (replaced by `shrink`)
- `flex-grow` (replaced by `grow`)
- `overflow-ellipsis` (replaced by `text-ellipsis`)
- `decoration-slice` (replaced by `box-decoration-slice`)
- `decoration-clone` (replaced by `box-decoration-clone`)

These deprecated utilities [will be removed in Tailwind v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha#whats-changed), so they're disabled by default in tw-reset and hidden from IntelliSense.

### Default borders and rings

[Tailwind v4 will change the default border and ring colors to `currentColor`](https://tailwindcss.com/blog/tailwindcss-v4-alpha#whats-changed), which is the browser default. It also uses 1px as the default ring width, and 100% as the default ring opacity. These changes have also been brought to tw-reset, which helps future-proof your site and provides more predictable behavior.

### Relative content paths

From [Tailwind's documentation](https://tailwindcss.com/docs/content-configuration#using-relative-paths):

> By default Tailwind resolves non-absolute content paths relative to the current working directory, not the tailwind.config.js file. This can lead to unexpected results if you run Tailwind from a different directory.

tw-reset "corrects" this unexpected behavior, which ["will likely become the default" in Tailwind v4](https://tailwindcss.com/docs/content-configuration#using-relative-paths).
