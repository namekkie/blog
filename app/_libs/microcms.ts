import { createClient } from "microcms-js-sdk";
import type { MicroCMSQueries, MicroCMSListContent } from "microcms-js-sdk";

export type Category = {
  name: string;
} & MicroCMSListContent;

export type Blog = {
  title: string;
  category: Category;
  content: string;
} & MicroCMSListContent;

if (!process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.NEXT_PUBLIC_MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is required");
}

const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY,
});

// ブログ一覧の取得
export const getBlogList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<Blog>({
    endpoint: "blog",
    queries,
  });
  return listData;
};

// ブログ詳細の取得
export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const detailData = await client.getListDetail<Blog>({
    endpoint: "blog",
    contentId,
    queries,
  });

  return detailData;
};

export const getCategoryDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const detailData = await client.getListDetail<Category>({
    endpoint: "categories",
    contentId,
    queries,
  });

  return detailData;
};
