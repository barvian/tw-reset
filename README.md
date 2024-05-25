# tw-reset

A 'reset' for your Tailwind config that enforces best practices, improves rendering performance, and reduces bundle size.

**🤔 Why would I want this?**

Tailwind v3's default config includes a bunch of stuff that the authors wanted to change but couldn't because of backwards compatibility (i.e. [deprecated `flex-shrink` utilities](#removes-deprecated-utilities), [unexpected `content` path behavior](#removes-deprecated-utilities)). Tailwind v4 will address all of these, but in the meantime you can modernize & future-proof your existing v3 sites with `tw-reset`, while reaping some performance benefits and bundle size reductions.

---

## Installation

Install the plugin from npm:

```sh
npm install -D tw-reset
```

Then add the preset to your `tailwind.config.js` file:

```diff
module.exports = {
+  presets: [require('tw-reset')],
   // ...
}
```

> [!IMPORTANT]
> If you're using `<style>` tags in Vue/Svelte, or CSS modules, pass this option to the preset:
>
> ```
> presets: [
>   require('tw-reset')({
>     optimizeUniversalDefaults: false
>   })
> ]
> ```
>
> Read [the first section below](#optimized-universal-defaults) for more information.

---

## What it changes

### Optimized universal defaults

By default, Tailwind outputs the following rule to prevent internal CSS variables from inheriting. You may have seen it in your inspector at some point:

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

This works, but it's inefficient as it applies to every element on the page even though the variables are only needed in their corresponding utilities.

An alternative strategy is available behind an experimental config flag, which optimizes this output and likely improves the rendering performance of your site. It's currently used in production on [tailwindcss.com](https://tailwindcss.com) and [was initially considered for the default strategy in Tailwind v3](https://github.com/tailwindlabs/tailwindcss/discussions/7317#discussioncomment-2107898), but was ruled out because it doesn't work with "per-component styles" that cause PostCSS to run multiple times in isolation (i.e. Vue/Svelte `<style>` tags or CSS modules). However, [Tailwind discourages these setups](https://tailwindcss.com/docs/functions-and-directives#using-apply-with-per-component-css), so `tw-reset` enables this strategy as default, which enforces best practices and brings the other improvements mentioned. If you must use per-component styles, though, you can disable this optimization with:

```js
// tailwind.config.js
module.exports = {
  presets: [
    require('tw-reset')({
      optimizeUniversalDefaults: false
    })
  ]
}
```

---

### `*-opacity` utilities disabled by default

Older versions of Tailwind used `*-opacity` classes to change the opacity of colors, i.e.

```html
<h1 class="text-black text-opacity-50">...</h1>
```

These utilities have been removed from Tailwind documentation, replaced by the [newer opacity modifier syntax](https://tailwindcss.com/docs/upgrade-guide#new-opacity-modifier-syntax). They'll be disabled by default in Tailwind v4, so `tw-reset` also disables them by default. This has the pleasant side effect of slightly reducing your CSS bundle size and simplifying the color output:

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

---

### Container queries included by default

Tailwind v4 [will support container queries out-of-the-box](https://tailwindcss.com/blog/tailwindcss-v4-alpha#designed-for-the-modern-web), so `tw-reset` includes the [official container query plugin](https://github.com/tailwindlabs/tailwindcss-container-queries) that uses the same syntax as Tailwind v4. If you were previously using this plugin, make sure you remove it when adding `tw-reset`:

```diff
module.exports = {
+  presets: [require('tw-reset')],
   plugins: [
-    require('@tailwindcss/container-queries')
   ]
}
```

---

### Default screens in `rem`

[Tailwind v4 will use `rem` units for its default breakpoints](https://github.com/tailwindlabs/tailwindcss/pull/13469), which better complement the default font sizes and spacing scales that also use `rem`. This was initially considered for Tailwind v1, but [was ruled out due to Safari bugs at the time](https://github.com/tailwindlabs/tailwindcss/discussions/8378#discussioncomment-2779675). Those bugs have since been fixed, so `tw-reset` provides `rem`-based breakpoints as default. This shouldn't cause any changes to your design if you're using Tailwind's default `px`-based breakpoints.

If you need to refer to these new breakpoints in your code for some reason, you can import them like so:

```js
const { screens } = require('tw-reset/defaultTheme')
```

---

### Removed deprecated utilities

Tailwind currently ships with [a few deprecated utilities](https://github.com/tailwindlabs/tailwindcss/blob/f1f419a9ecfcd00a2001ee96ab252739fca47564/src/corePlugins.js) that still show up in IntelliSense suggestions:

- `flex-shrink` (replaced by `shrink`)
- `flex-grow` (replaced by `grow`)
- `overflow-ellipsis` (replaced by `text-ellipsis`)
- `decoration-slice` (replaced by `box-decoration-slice`)
- `decoration-clone` (replaced by `box-decoration-clone`)

These deprecated utilities [will be removed in Tailwind v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha#whats-changed), so they're disabled by default in `tw-reset` and hidden from IntelliSense.

---

### Default borders and rings

[Tailwind v4 will change the default border and ring colors to `currentColor`](https://tailwindcss.com/blog/tailwindcss-v4-alpha#whats-changed), which is the browser default. It will also use `1px` as the default ring width, and `100%` as the default ring opacity. `tw-reset` implements all these changes, which future-proofs your site for Tailwind v4 and provides more predictable behavior.

---

### Relative content paths

From [Tailwind's documentation](https://tailwindcss.com/docs/content-configuration#using-relative-paths):

> By default Tailwind resolves non-absolute content paths relative to the current working directory, not the tailwind.config.js file. This can lead to unexpected results if you run Tailwind from a different directory.

`tw-reset` resolves non-absolute content paths relative to the config file, which ["will likely become the default" in Tailwind v4](https://tailwindcss.com/docs/content-configuration#using-relative-paths).
