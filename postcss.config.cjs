module.exports = {
  plugins: [
    require('tailwindcss')({
      config: './tailwind.config.ts'
    }),
    require('autoprefixer'),
    require('postcss-nesting')
  ]
}