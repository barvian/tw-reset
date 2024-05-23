import path from 'path'
import postcss from 'postcss'
import tailwind, { type Config } from 'tailwindcss'

export let css = String.raw
export let html = String.raw
export let javascript = String.raw

export async function run(
	config: Config,
	input = `@tailwind base;@tailwind utilities;@tailwind components;`
) {
	config.corePlugins ??= {
		preflight: false
	}

	return await postcss(tailwind(config)).process(input, {
		from: `${path.resolve(__filename)}?test=${crypto.randomUUID()}`
	})
}
