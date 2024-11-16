import fs from "fs";
import path from "path";
import matter from "gray-matter";
import markdownToHtml from "zenn-markdown-html";
import { BLOG_LIST_LIMIT } from "@/app/_constants";

const postsDirectory = path.join(process.cwd(), "public/posts");

// Markdownファイルのメタデータとコンテンツを表す型
export type PostData = {
  id: string;
  title: string;
  category: string[];
  createdAt: string;
  contentHtml: string;
};

type PostIdParams = {
  params: {
    name: string;
  };
};

// ********************************************
// /posts配下のディレクトリ名を取得する
// ********************************************
export function getAllPostIds(): PostIdParams[] {
  const dirEntry = fs.readdirSync(postsDirectory, { withFileTypes: true }); // ディレクトリエントリ情報を取得
  const dirNames = dirEntry.filter((entry) => entry.isDirectory()); // ディレクトリのみをフィルタ

  return dirNames.map((dirname) => {
    return {
      params: {
        name: dirname.name, // ディレクトリ名を取得
      },
    };
  });
}

// ********************************************
// ブログ詳細の取得
// ********************************************
export async function getPostData(id: string): Promise<PostData | null> {
  // mdファイルのパス
  const fullPath = path.join(postsDirectory, `${id}/post.md`);

  // ファイルが存在しない場合は null を返す
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  // mdファイルの読み込み
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // gray-matterを使ってメタデータと内容を分離
  const matterResult = matter(fileContents);
  // ブログ内容
  // const contentHtml = matterResult.content;
  const contentHtml = await markdownToHtml(matterResult.content || "", {
    embedOrigin: "https://embed.zenn.studio",
  });

  return {
    id,
    title: matterResult.data.title ?? "Untitled", // タイトルがなければデフォルト値
    // category: matterResult.data.category ?? "Uncategorized", // カテゴリがなければデフォルト値
    category: Array.isArray(matterResult.data.category)
      ? matterResult.data.category
      : [matterResult.data.category], // 変更: 配列でなければ配列に変換
    createdAt: matterResult.data.createdAt ?? "", // 作成日がなければ空文字
    contentHtml,
  };
}

// ********************************************
// 全てのブログデータを取得する関数(静的関数)
// ********************************************
async function getPostDataFromFile(): Promise<PostData[]> {
  // ディレクトリエントリ情報を取得
  const dirEntry = fs.readdirSync(postsDirectory, { withFileTypes: true });
  // ディレクトリのみをフィルタ
  const dirNames = dirEntry.filter((entry) => entry.isDirectory());

  // 各ファイルのデータを取得し、PostData型の配列として返す
  const allPostsData = await Promise.all(
    dirNames.map(async (dirName) => {
      const id = dirName.name;
      const fullPath = path.join(postsDirectory, `${id}/post.md`);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // gray-matterでメタデータとコンテンツを分離
      const matterResult = matter(fileContents);
      const contentHtml = matterResult.content;

      return {
        id,
        title: matterResult.data.title ?? "Untitled",
        // category: matterResult.data.category ?? "Uncategorized",
        category: Array.isArray(matterResult.data.category)
          ? matterResult.data.category
          : [matterResult.data.category], // 変更: 配列でなければ配列に変換
        createdAt: matterResult.data.createdAt ?? "",
        contentHtml,
      };
    })
  );

  return allPostsData;
}

// ********************************************
// ブログ一覧の取得
// ********************************************
export async function getAllPostData(
  index: number = 1,
  length: number = 0,
  q?: string
): Promise<PostData[]> {
  // 全てのブログデータを取得する
  const allPostsData = await getPostDataFromFile();
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
  if (0 < length) {
    const start = (index - 1) * length;
    const end = start + length;
    return allPostsData.slice(start, end);
  } else {
    return allPostsData;
  }
}

// ********************************************
// 指定されたカテゴリーのブログ一覧の取得
// ********************************************
export async function getCategoryPostData(
  index: number = 1,
  category?: string
): Promise<PostData[]> {
  // 全てのブログデータを取得する
  const allPostsData = await getPostDataFromFile();
  // カテゴリーをフィルタリング
  const filteredPosts = category
    ? allPostsData.filter(
        (post) =>
          Array.isArray(post.category)
            ? post.category.includes(category) // 配列の場合、category が含まれるかチェック
            : post.category === category // 文字列の場合、通常の一致チェック
      )
    : allPostsData;

  // 指定された長さ分返す
  if (index > 0) {
    const start = (index - 1) * BLOG_LIST_LIMIT;
    const end = start + BLOG_LIST_LIMIT;
    return filteredPosts.slice(start, end);
  } else {
    return filteredPosts;
  }
}

// ********************************************
// ブログ数を取得する
// ********************************************
export async function getNumPostData(category?: string): Promise<number> {
  // 全てのブログデータを取得する
  const allPostsData = await getPostDataFromFile();
  if (category) {
    // カテゴリー指定がある場合
    // カテゴリーをフィルタリング
    const filteredPosts = category
      ? allPostsData.filter(
          (post) =>
            Array.isArray(post.category)
              ? post.category.includes(category) // 配列の場合、category が含まれるかチェック
              : post.category === category // 文字列の場合、通常の一致チェック
        )
      : allPostsData;
    return filteredPosts.length;
  } else {
    // カテゴリー指定がない場合
    return allPostsData.length;
  }
}
