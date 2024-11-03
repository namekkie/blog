import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

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

export function getAllPostIds(): PostIdParams[] {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""), // 拡張子を削除
      },
    };
  });
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // gray-matterを使ってメタデータと内容を分離
  const matterResult = matter(fileContents);

  // remarkを使ってMarkdownをHTML文字列に変換
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    title: matterResult.data.title ?? "Untitled", // タイトルがなければデフォルト値
    category: matterResult.data.category ?? "Uncategorized", // カテゴリがなければデフォルト値
    publishedAt: matterResult.data.publishedAt ?? "", // 公開日がなければ空文字
    createdAt: matterResult.data.createdAt ?? "", // 作成日がなければ空文字
    contentHtml,
  };
}

export async function getAllPostData(length?: number): Promise<PostData[]> {
  const fileNames = fs.readdirSync(postsDirectory);

  // 各ファイルのデータを取得し、PostData型の配列として返す
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // gray-matterでメタデータとコンテンツを分離
      const matterResult = matter(fileContents);

      // MarkdownコンテンツをHTMLに変換
      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
      const contentHtml = processedContent.toString();

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
  // 指定された長さ分返す
  if (length) {
    return allPostsData.slice(0, length);
  } else {
    return allPostsData;
  }
}
