import { expect, it, spyOn } from 'bun:test'
import './matchers'
import { html, css, run } from './run.js'
import reset from '../dist/index.js'
import { bold, yellow } from 'picocolors'

const warn = spyOn(console, 'warn')

it(`adds container queries plugin`, async () => {
	const result = await run({
		presets: [reset],
		content: [
			{
				raw: html`<div class="@md:relative></div>`
			}
		],
		theme: {
			containers: {
				md: '30rem'
			}
		}
	})
	expect(result.css).toMatchFormattedCss(css`
		@container (min-width: 30rem) {
			.\@md\:relative {
				position: relative;
			}
		}
	`)
})

it(`disables color opacity utilities by default`, async () => {
	const result = await run({
		presets: [reset],
		content: [
			{
				raw: html`<div
					class="divide-black border-black bg-black text-black placeholder-black ring-black"
				></div>`
			}
		]
	})
	expect(result.css).toMatchFormattedCss(css`
		.divide-black > :not([hidden]) ~ :not([hidden]) {
			border-color: #000;
		}
		.border-black {
			border-color: #000;
		}
		.bg-black {
			background-color: #000;
		}
		.text-black {
			color: #000;
		}
		.placeholder-black::placeholder {
			color: #000;
		}
		.ring-black {
			--tw-ring-color: #000;
		}
	`)
})

it(`updates default border color`, async () => {
	const result = await run({
		presets: [reset],
		corePlugins: {}, // don't disable preflight
		content: [
			{
				raw: html`<div class="border"></div>`
			}
		]
	})
	expect(result.css).toContain('border-color: currentColor;')
})

it(`updates default rings`, async () => {
	const result = await run({
		presets: [reset],
		content: [
			{
				raw: html`<div class="ring"></div>`
			}
		]
	})
	expect(result.css).toMatchFormattedCss(`
	.ring {
  --tw-ring-inset: ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: currentColor;
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
    var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
	`)
})

it(`removes deprecated utilities`, async () => {
	const result = await run({
		presets: [reset],
		content: [
			{
				raw: html`<div
					class="flex-shrink-0 shrink-0 flex-grow-0 grow-0 truncate overflow-ellipsis text-ellipsis text-clip decoration-slice decoration-clone box-decoration-slice box-decoration-clone"
				></div>`
			}
		]
	})
	expect(result.css).toMatchFormattedCss(`
 .shrink-0 {
	   flex-shrink: 0;
	 }
	 .grow-0 {
	   flex-grow: 0;
	 }
	 .box-decoration-slice {
	   box-decoration-break: slice;
	 }
	 .box-decoration-clone {
	   box-decoration-break: clone;
	 }
	 .truncate {
	   overflow: hidden;
	   text-overflow: ellipsis;
	   white-space: nowrap;
	 }
	 .text-ellipsis {
	   text-overflow: ellipsis;
	 }
	 .text-clip {
	   text-overflow: clip;
	 }
	`)
})

it(`warns if trying to pass in separate future config`, async () => {
	const result = await run({
		presets: [reset],
		future: {
			hoverOnlyWhenSupported: true
		},
		content: [
			{
				raw: html``
			}
		]
	})
	expect(warn).toHaveBeenCalledWith(
		bold(yellow('warn')),
		'-',
		`tw-reset was overridden by the ${yellow('future')} options in your Tailwind config file. Please pass these options to the preset instead.`
	)
})

it(`warns if trying to pass in separate experimental config`, async () => {
	const result = await run({
		presets: [reset],
		experimental: {
			optimizeUniversalDefaults: false
		},
		content: [
			{
				raw: html``
			}
		]
	})
	expect(warn).toHaveBeenCalledWith(
		bold(yellow('warn')),
		'-',
		`tw-reset was overridden by the ${yellow('experimental')} options in your Tailwind config file. Please pass these options to the preset instead.`
	)
})

it(`updates default screens to rem`, async () => {
	const result = await run({
		presets: [reset],
		content: [
			{
				raw: html`<div class="sm:relative md:relative lg:relative xl:relative 2xl:relative"></div>`
			}
		]
	})
	expect(result.css).toMatchFormattedCss(`
	@media (min-width: 40rem) {
   .sm\\:relative {
     position: relative;
   }
 }
 @media (min-width: 48rem) {
   .md\\:relative {
     position: relative;
   }
 }
 @media (min-width: 64rem) {
   .lg\\:relative {
     position: relative;
   }
 }
 @media (min-width: 80rem) {
   .xl\\:relative {
     position: relative;
   }
 }
 @media (min-width: 96rem) {
   .\\32xl\\:relative {
     position: relative;
   }
 }
	`)
})
