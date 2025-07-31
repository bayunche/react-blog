import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path'
import WindiCSS from 'vite-plugin-windicss'
import { visualizer } from 'rollup-plugin-visualizer'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = command === 'serve'
  const isProd = command === 'build'

  return {
    plugins: [
      react({
        // React优化配置
        babel: {
          plugins: [
            // 生产环境移除console和debugger
            isProd && ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }],
            isProd && 'babel-plugin-transform-remove-debugger',
          ].filter(Boolean),
        },
      }),
      
      WindiCSS(),
      
      // 支持旧版浏览器
      legacy({
        targets: ['defaults', 'not IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: true,
        polyfills: [
          'es.symbol',
          'es.array.filter',
          'es.promise',
          'es.promise.finally',
          'es/map',
          'es/set',
          'es.array.for-each',
          'es.object.define-properties',
          'es.object.define-property',
          'es.object.get-own-property-descriptor',
          'es.object.get-own-property-descriptors',
          'es.object.keys',
          'es.object.to-string',
          'web.dom-collections.for-each',
          'esnext.global-this',
          'esnext.string.match-all'
        ]
      }),

      // HTML模板优化
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE || '八云澈的博客',
            description: env.VITE_APP_DESCRIPTION || '一个萌系技术博客',
            keywords: env.VITE_APP_KEYWORDS || 'React,Blog,Technology',
          },
        },
        minify: isProd,
      }),

      // CommonJS支持
      viteCommonjs(),

      // 生产环境构建分析
      isProd && visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@views': resolve(__dirname, 'src/views'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@stores': resolve(__dirname, 'src/stores'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@config': resolve(__dirname, 'src/config'),
      },
    },

    server: {
      port: 3000,
      open: true,
      host: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:6060',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: !isProd,
      minify: isProd ? 'terser' : false,
      
      // Terser优化配置
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
        },
        format: {
          comments: false,
        },
      } : {},

      rollupOptions: {
        output: {
          // 更细粒度的代码分割
          manualChunks: (id) => {
            // 第三方库分块
            if (id.includes('node_modules')) {
              // React生态
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor'
              }
              // 路由
              if (id.includes('react-router')) {
                return 'router'
              }
              // 状态管理
              if (id.includes('zustand')) {
                return 'state'
              }
              // UI库
              if (id.includes('antd') || id.includes('@ant-design')) {
                return 'ui-library'
              }
              // 编辑器相关
              if (id.includes('marked') || id.includes('easymde') || id.includes('dompurify')) {
                return 'editor'
              }
              // Live2D
              if (id.includes('live2d')) {
                return 'live2d'
              }
              // 工具库
              if (id.includes('axios') || id.includes('dayjs') || id.includes('crypto-js')) {
                return 'utils'
              }
              // 其他第三方库
              return 'vendor'
            }
            
            // 应用代码分块
            if (id.includes('src/views/admin')) {
              return 'admin'
            }
            if (id.includes('src/views/web')) {
              return 'web'
            }
            if (id.includes('src/components/Public')) {
              return 'public-components'
            }
          },
          
          // 文件命名规则
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              if (facadeModuleId.includes('src/views/admin')) {
                return 'js/admin/[name]-[hash].js'
              }
              if (facadeModuleId.includes('src/views/web')) {
                return 'js/web/[name]-[hash].js'
              }
            }
            return 'js/[name]-[hash].js'
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              return `media/[name]-[hash][extname]`
            }
            if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              return `images/[name]-[hash][extname]`
            }
            if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              return `fonts/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          },
        },
      },
      
      chunkSizeWarningLimit: 800,
      assetsInlineLimit: 4096, // 小于4KB的资源内联为base64
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'zustand',
        'antd',
        '@ant-design/icons',
        'axios',
        'dayjs',
        'marked',
        'dompurify',
      ],
      exclude: [
        'oh-my-live2d', // Live2D按需加载
      ],
    },

    // 环境变量配置
    define: {
      __DEV__: isDev,
      __PROD__: isProd,
      __VERSION__: JSON.stringify(process.env.npm_package_version),
    },

    // CSS优化
    css: {
      devSourcemap: isDev,
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            // Ant Design主题定制
            '@primary-color': '#ff69b4',
            '@border-radius-base': '8px',
            '@font-size-base': '14px',
          },
        },
      },
      postcss: {
        plugins: [
          require('autoprefixer'),
          isProd && require('cssnano')({
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: false,
            }]
          }),
        ].filter(Boolean),
      },
    },

    // 性能相关配置
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
      pure: isProd ? ['console.log', 'console.info'] : [],
    },
  }
})