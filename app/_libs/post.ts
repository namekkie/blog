import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import prism from "remark-prism";

const postsDirectory = path.join(process.cwd(), "public/posts");

// Markdownファイルのメタデータとコンテンツを表す型
export type PostData = {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  createdAt: string;
  contentHtml: string;
};

type PostIdParams = {
  params: {
    id: string;
  };
};

// /posts配下のディレクトリ名を取得する
export function getAllPostIds(): PostIdParams[] {
  const dirEntry = fs.readdirSync(postsDirectory, { withFileTypes: true }); // ディレクトリエントリ情報を取得
  const dirNames = dirEntry.filter((entry) => entry.isDirectory()); // ディレクトリのみをフィルタ

  return dirNames.map((dirname) => {
    return {
      params: {
        id: dirname.name, // ディレクトリ名を取得
      },
    };
  });
}

// ブログ詳細の取得
export async function getPostData(id: string): Promise<PostData> {
  // mdファイルの読み込み
  const fullPath = path.join(postsDirectory, `${id}/post.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // gray-matterを使ってメタデータと内容を分離
  const matterResult = matter(fileContents);
  // ブログ内容
  const contentHtml = matterResult.content;

  return {
    id,
    title: matterResult.data.title ?? "Untitled", // タイトルがなければデフォルト値
    category: matterResult.data.category ?? "Uncategorized", // カテゴリがなければデフォルト値
    publishedAt: matterResult.data.publishedAt ?? "", // 公開日がなければ空文字
    createdAt: matterResult.data.createdAt ?? "", // 作成日がなければ空文字
    contentHtml,
  };
}

// ブログ一覧の取得
export async function getAllPostData(
  length?: number,
  q?: string
): Promise<PostData[]> {
  const dirEntry = fs.readdirSync(postsDirectory, { withFileTypes: true }); // ディレクトリエントリ情報を取得
  const dirNames = dirEntry.filter((entry) => entry.isDirectory()); // ディレクトリのみをフィルタ

  // 各ファイルのデータを取得し、PostData型の配列として返す
  const allPostsData = await Promise.all(
    dirNames.map(async (dirName) => {
      const id = dirName.name;
      const fullPath = path.join(postsDirectory, `${id}/post.md`);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // gray-matterでメタデータとコンテンツを分離
      const matterResult = matter(fileContents);
      const contentHtml = matterResult.content;

      // PostDataオブジェクトを返す
      return {
        id,
        title: matterResult.data.title ?? "Untitled", // タイトルがなければデフォルト値
        category: matterResult.data.category ?? "Uncategorized", // カテゴリがなければデフォルト値
        publishedAt: matterResult.data.publishedAt ?? "", // 公開日がなければ空文字
        createdAt: matterResult.data.createdAt ?? "", // 作成日がなければ空文字
        contentHtml,
      };
    })
  );
  // 検索キーワードが与えられた場合、そのキーワードを使ってタイトルや本文をフィルタリング
  if (q) {
    return allPostsData.filter((post) => {
      const searchTerm = q.toLowerCase();
      // タイトルと本文が検索キーワードに一致するかを判定
      return (
        post.title.toLowerCase().includes(searchTerm) ||
        post.contentHtml.toLowerCase().includes(searchTerm)
      );
    });
  }
  // 指定された長さ分返す
  if (length) {
    return allPostsData.slice(0, length);
  } else {
    return allPostsData;
  }
}
