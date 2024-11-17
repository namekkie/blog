import { getAllPostData } from "@/app/_libs/post";
import { BLOG_LIST_LIMIT } from "@/app/_constants";
import BlogList from "@/app/_components/BlogList";
import SearchField from "@/app/_components/SearchField";

type Props = {
  searchParams: {
    q?: string;
  };
};

export default async function Page({ searchParams }: Props) {
  // searchParamsは非同期に取得されるため、awaitを使ってアクセスする
  const { q } = (await searchParams) || ""; // デフォルト値として空文字を設定

  const blog = await getAllPostData(BLOG_LIST_LIMIT, BLOG_LIST_LIMIT, q);

  return (
    <>
      <SearchField />
      <BlogList blog={blog} />
    </>
  );
}
