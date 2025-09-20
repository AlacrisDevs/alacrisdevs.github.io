/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                primary: 'rgba(0, 108, 255, 1)',
                secondary: 'rgba(10, 18, 31, 1)',
                tertiary: 'rgba(233, 242, 255, 1)',
                text: 'rgba(255, 255, 255, 1)',
            },
            fontFamily: {
                'urbanist': ['Urbanist', 'sans-serif'],
                'roboto': ['Roboto', 'sans-serif'],
            },
            fontSize: {
                'h1': '3rem',
                'h2': '2.25rem',
                'h3': '1.75rem',
                'h4': '1.38rem',
                'h5': '1.12rem',
                'p': '1rem',
                'lead': '1.12rem',
                'small': '0.88rem',
                'button': '1rem',
            },
            lineHeight: {
                'tight': '1.2',
            },
            fontWeight: {
                'light': '300',
                'normal': '400',
                'medium': '500',
                'semibold': '600',
                'bold': '700',
            },
        },
    },
    plugins: [],
}
