import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import checker from 'vite-plugin-checker';

export default defineConfig(({ mode }) =>{
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(), 
      tsconfigPaths(),
      checker({ typescript: true, enableBuild: false })
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_CORE_SERVER_URL,
          changeOrigin: true,
          secure: true
        }
      }
    }
  }
})
