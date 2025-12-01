// vitest.config.ts
import { defineConfig } from "file:///home/kingsley/Documents/projects/hris-mono-repo/node_modules/.pnpm/vitest@2.1.9_@types+node@20.19.9_@vitest+ui@4.0.14_jsdom@27.2.0_lightningcss@1.30.1_msw_2dd6757b1a4eb07979a1ece32396cde4/node_modules/vitest/dist/config.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "/home/kingsley/Documents/projects/hris-mono-repo";
var vitest_config_default = defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/dist/",
        "**/build/",
        "**/.next/"
      ]
    },
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/tests/e2e/**",
      "**/*.spec.ts"
    ]
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2tpbmdzbGV5L0RvY3VtZW50cy9wcm9qZWN0cy9ocmlzLW1vbm8tcmVwb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUva2luZ3NsZXkvRG9jdW1lbnRzL3Byb2plY3RzL2hyaXMtbW9uby1yZXBvL3ZpdGVzdC5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva2luZ3NsZXkvRG9jdW1lbnRzL3Byb2plY3RzL2hyaXMtbW9uby1yZXBvL3ZpdGVzdC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6IFsnLi90ZXN0cy9zZXR1cC50cyddLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICBwcm92aWRlcjogJ3Y4JyxcbiAgICAgIHJlcG9ydGVyOiBbJ3RleHQnLCAnanNvbicsICdodG1sJ10sXG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgICdub2RlX21vZHVsZXMvJyxcbiAgICAgICAgJ3Rlc3RzLycsXG4gICAgICAgICcqKi8qLmQudHMnLFxuICAgICAgICAnKiovKi5jb25maWcuKicsXG4gICAgICAgICcqKi9kaXN0LycsXG4gICAgICAgICcqKi9idWlsZC8nLFxuICAgICAgICAnKiovLm5leHQvJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBpbmNsdWRlOiBbJyoqLyoue3Rlc3Qsc3BlY30ue2pzLG1qcyxjanMsdHMsbXRzLGN0cyxqc3gsdHN4fSddLFxuICAgIGV4Y2x1ZGU6IFtcbiAgICAgICcqKi9ub2RlX21vZHVsZXMvKionLFxuICAgICAgJyoqL2Rpc3QvKionLFxuICAgICAgJyoqL2J1aWxkLyoqJyxcbiAgICAgICcqKi8ubmV4dC8qKicsXG4gICAgICAnKiovdGVzdHMvZTJlLyoqJyxcbiAgICAgICcqKi8qLnNwZWMudHMnLFxuICAgIF0sXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNVLFNBQVMsb0JBQW9CO0FBQ25XLFNBQVMsZUFBZTtBQUR4QixJQUFNLG1DQUFtQztBQUd6QyxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixZQUFZLENBQUMsa0JBQWtCO0FBQUEsSUFDL0IsVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxNQUFNO0FBQUEsTUFDakMsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUyxDQUFDLGtEQUFrRDtBQUFBLElBQzVELFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUNqQztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
