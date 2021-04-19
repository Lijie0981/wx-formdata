import {
	readdirSync,
	writeFileSync,
	existsSync
} from 'fs-extra';

import path from 'path';

import babel from 'rollup-plugin-babel';

import nodeResolve from '@rollup/plugin-node-resolve';

import commonjs from 'rollup-plugin-commonjs';

import typescript from 'rollup-plugin-typescript2';

import { terser } from 'rollup-plugin-terser';


const pkg = require('./package.json');
// 插件配置
export const buildPlugins = (
	config = {
		declarationDir: 'packages/dist/types',
		replaces: {},
	},
	otherPlugins = []
) => [
		nodeResolve(),
		commonjs({
			include: /[\\/]node_modules[\\/]/,
		}),
		typescript({
			clean: true,
			typescript: require('ttypescript'),
			tsconfig: `tsconfig.json`,
			tsconfigOverride: {
				compilerOptions: {
					target: 'es5',
					declarationDir: config.declarationDir || 'dist/types',
				},
			},
			rollupCommonJSResolveHack: true,
			useTsconfigDeclarationDir: true,
		}),
		babel({
			exclude: 'node_modules/**',
		}),
		terser(),
		...otherPlugins,
	];

module.exports = {
	input: path.resolve(__dirname, 'src/index.ts'),
	external: [
		'mime-types',
		'parse-filepath'
	],
	output: [
		{
			file: pkg.main,
			name: pkg.name,
			format: 'cjs',
			sourcemap: false,
		},
		{
			file: pkg.module,
			name: pkg.name,
			format: 'esm',
			sourcemap: false,
		},
	],
	plugins: buildPlugins({
		declarationDir: 'dist/types/',
		replaces: {},
	}),
};
