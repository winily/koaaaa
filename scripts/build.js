require('esbuild').buildSync({
  entryPoints: ['./src/index.js'],
  bundle: true,
  platform: 'node',
  target: ['node10.4'],
  packages: 'external',
  sourcemap: true,
  outfile: './dist/index.js',
})