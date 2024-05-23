import defaultTheme from 'tailwindcss/defaultTheme'
import mapObj from 'map-obj'

// Ripped from Tailwind:
// https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/dataTypes.js
const lengthRegExp = /^\s*([+-]?[0-9]*\.?[0-9]+(?:[eE][+-]?[0-9]+)?)px\s*$/

/**
 * Tailwind's default screens converted to `rem`, for better
 * compatibility with core plugins.
 */
export const screens = mapObj(defaultTheme.screens ?? {}, (screen, bp) => {
	if (typeof bp !== 'string') return [screen, bp]
	const match = bp.match(lengthRegExp) ?? null
	const num = parseInt(match?.[1] ?? '')
	if (isNaN(num)) return [screen, bp]
	return [screen, `${num / 16}rem`]
})
