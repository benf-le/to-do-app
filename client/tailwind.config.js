/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // THÊM 2 DÒNG NÀY VÀO:
  theme: {
    extend: {}, // Bắt buộc phải có, dù là rỗng
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ], // Bắt buộc phải có, dù là rỗng

}