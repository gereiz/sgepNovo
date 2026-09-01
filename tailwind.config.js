import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
        './resources/js/react/**/*.js',
        './resources/js/react/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                'cor-primaria': '#07074C',
                // shadcn/ui / Material design tokens do projeto de referência
                surface: {
                    'container-lowest': '#FFFFFF',
                    'container-low': '#F7F7F8',
                    'container': '#EEEFF0',
                    'container-high': '#E8E9EA',
                    'container-highest': '#E0E1E2',
                },
                primary: {
                    DEFAULT: '#3A5598',
                    container: '#D8E2FF',
                    on: '#FFFFFF',
                    'on-container': '#1A2D5A',
                },
                secondary: {
                    DEFAULT: '#585E71',
                    container: '#DCE2F9',
                    on: '#FFFFFF',
                },
                tertiary: {
                    DEFAULT: '#735573',
                    container: '#FBD8F8',
                    on: '#FFFFFF',
                },
                error: {
                    DEFAULT: '#BA1A1A',
                    container: '#FFDAD6',
                    on: '#FFFFFF',
                },
                'on-surface': '#191C1D',
                'on-surface-variant': '#44474E',
                outline: '#74777F',
                'outline-variant': '#C4C6D0',
            },
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
            backgroundImage: {
                'hero': "url('/storage/app/public/img/login_bg.jpg')",

            },
            boxShadow: {
                'nav': '0 2px 6px 2px rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.12)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
            },
            important: true,

        },
    },

    // plugins: [require("daisyui")],
    plugins: [forms, require("@tailwindcss/typography"), require("daisyui")],
};
