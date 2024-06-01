import containerQueries from '@tailwindcss/container-queries'
import type {
	ExperimentalConfig,
	ExperimentalConfigValues,
	FutureConfig,
	FutureConfigValues,
	PresetsConfig
} from 'tailwindcss/types/config.js'
import plugin from 'tailwindcss/plugin.js'
import { screens } from './defaultTheme.js'
import { bold, yellow } from 'picocolors'

type Keys =
	| 'disableDeprecated'
	| Extract<FutureConfigValues, 'hoverOnlyWhenSupported'>
	| Extract<ExperimentalConfigValues, 'optimizeUniversalDefaults'>
type Options = Partial<{
	[k in Keys]: boolean
}>

const warn = (msg: string) => console.warn(bold(yellow('warn')), '-', msg)

const makeReset = ({
	hoverOnlyWhenSupported = false,
	optimizeUniversalDefaults = true,
	disableDeprecated = true
}: Options = {}): PresetsConfig => {
	// Store references to these two so we can check if they were overridden:
	const future: FutureConfig = {
		hoverOnlyWhenSupported,
		respectDefaultRingColorOpacity: true,
		disableColorOpacityUtilitiesByDefault: true,
		relativeContentPathsByDefault: true
	}
	const experimental: ExperimentalConfig = {
		optimizeUniversalDefaults
	}

	return {
		future,
		experimental,
		corePlugins: disableDeprecated
			? {
					// https://github.com/tailwindlabs/tailwindcss/blob/f1f419a9ecfcd00a2001ee96ab252739fca47564/src/corePlugins.js
					// (search for DEPRECATED comments)
					flexShrink: false,
					flexGrow: false,
					boxDecorationBreak: false,
					textOverflow: false
				}
			: {},
		theme: {
			screens,
			extend: {
				// https://tailwindcss.com/blog/tailwindcss-v4-alpha#whats-changed
				borderColor: {
					DEFAULT: 'currentColor'
				},
				ringColor: {
					DEFAULT: 'currentColor'
				},
				ringWidth: {
					DEFAULT: '1px'
				},
				ringOpacity: {
					DEFAULT: '1'
				}
			}
		},
		plugins: [
			plugin(({ addUtilities, matchUtilities, theme, config, corePlugins }) => {
				// Check to see if our future or experimental objects were
				// overridden, and warn. Only works b/c they don't get deeply merged
				// https://tailwindcss.com/docs/presets#merging-logic-in-depth
				if ((config('future') as FutureConfig) !== future) {
					warn(
						`tw-reset was overridden by the ${yellow('future')} options in your Tailwind config file. Please pass these options to the preset instead.`
					)
				}
				if ((config('experimental') as ExperimentalConfig) !== experimental) {
					warn(
						`tw-reset was overridden by the ${yellow('experimental')} options in your Tailwind config file. Please pass these options to the preset instead.`
					)
				}

				if (!disableDeprecated) return

				// Re-add non-deprecated utilities
				// This unfortunately means that to really disable these corePlugins you need to
				// disable disableDeprecated first

				// flexShrink
				if (!corePlugins('flexShrink'))
					matchUtilities(
						{
							shrink: (val) => ({
								'flex-shrink': val
							})
						},
						{
							values: theme('flexShrink')
						}
					)

				// flexGrow
				if (!corePlugins('flexGrow'))
					matchUtilities(
						{
							grow: (val) => ({
								'flex-grow': val
							})
						},
						{
							values: theme('flexGrow')
						}
					)

				// boxDecorationBreak
				if (!corePlugins('boxDecorationBreak'))
					addUtilities({
						'.box-decoration-slice': { 'box-decoration-break': 'slice' },
						'.box-decoration-clone': { 'box-decoration-break': 'clone' }
					})

				// textOverflow
				if (!corePlugins('textOverflow'))
					addUtilities({
						'.truncate': {
							overflow: 'hidden',
							'text-overflow': 'ellipsis',
							'white-space': 'nowrap'
						},
						'.text-ellipsis': { 'text-overflow': 'ellipsis' },
						'.text-clip': { 'text-overflow': 'clip' }
					})
			}),
			// https://tailwindcss.com/blog/tailwindcss-v4-alpha#designed-for-the-modern-web
			containerQueries
		]
	}
}

const reset = Object.assign(makeReset, makeReset())
export default reset
