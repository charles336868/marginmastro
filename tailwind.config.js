/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Space Grotesk', 'monospace'],
                barcode: ['"Libre Barcode 128 Text"', 'cursive'],
            },
            colors: {
                brand: {
                    accent: '#ccff00',
                    black: '#0a0a0a',
                    concrete: '#dfdfdf',
                }
            },
            boxShadow: {
                'hard': '8px 8px 0px 0px #0a0a0a',
            }
        },
    },
    plugins: [],
}
