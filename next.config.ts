// next.config.mjs

import removeImports from "next-remove-imports";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

// `removeImports`を実行して関数にラップし、Next.jsの設定としてエクスポート
export default removeImports()(nextConfig);

// 外部画像を読み込む
module.exports = {
  images: {
    domains: ["your-external-image-source.com"],
  },
};
