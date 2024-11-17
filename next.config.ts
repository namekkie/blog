// next.config.mjs

import removeImports from "next-remove-imports";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["your-external-image-source.com", "localhost"],
  },
};

// `removeImports`を実行して関数にラップし、Next.jsの設定としてエクスポート
export default removeImports()(nextConfig);
