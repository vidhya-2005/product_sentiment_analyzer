tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: "#2563eb",
                secondary: "#1e40af",
                positive: "#22c55e", 
                neutral: "#facc15",  
                negative: "#ef4444"  
            },
            fontFamily: { 
                sans: ['Inter', 'system-ui', 'sans-serif'] 
            },
            animation: { 
                'fade-in': 'fadeIn 0.5s ease-in-out' 
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
            }
        }
    }
}