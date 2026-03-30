// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//     plugins: [react()],
//     server: {
//         watch: {
//             usePolling: true,
//             interval: 100, // 👈 NEW (very important)
//         },
//         hmr: {
//             overlay: false,
//         },
//     },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})