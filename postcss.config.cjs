module.exports = {
  plugins: [
    require('postcss-nesting'),
    require('tailwindcss')({
      config: './tailwind.config.ts'
    }),
    require('autoprefixer'),
  ]
}
