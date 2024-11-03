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
    contentHtml,
    ...(matterResult.data as { title: string; date: string }), // メタデータの型指定
  };
}
