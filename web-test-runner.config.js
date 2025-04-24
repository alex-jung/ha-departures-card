// web-test-runner.config.js
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: 'test/**/*.test.ts',
  nodeResolve: true,
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'es2020',
    }),
  ],
  testFramework: {
    config: {
      ui: 'bdd',
    },
  },
};
