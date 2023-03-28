import react from '@vitejs/plugin-react';
import matter from 'gray-matter';
import { BuildOptions, defineConfig, PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export const markdownPlugin = (): PluginOption => {
  return {
    name: 'vite-plugin-markdown',
    enforce: 'pre',
    transform: (code: string, id: string): { code: string } => {
      if (!id.endsWith('.md')) return null;
      const matterResult = matter(code);
      const attributes = matterResult.data;
      const content = matterResult.content
        .replaceAll('{{ site.baseurl }}/assets/', `${process.env.BASE_URL || '/'}imgs/posts/`)
        .replaceAll('/_assets/posts/', `${process.env.BASE_URL || '/'}imgs/posts/`)
        .replace(/({% raw %}|{% endraw %})/g, '');

      return {
        code: [
          `const attributes = ${JSON.stringify(attributes)};`,
          `const content = ${JSON.stringify(content)};`,
          `export { attributes, content }`,
        ].join('\n'),
      };
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), markdownPlugin()],
  build: {
    rollupOptions: {
      input: './src/entry-client.tsx',
    },
  },
});
