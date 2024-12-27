import { notFound } from "next/navigation";
import BlogList from "@/app/_components/BlogList";
import Pagination from "@/app/_components/Pagination";
import { BLOG_LIST_LIMIT } from "@/app/_constants";
import { getAllPostData, getNumPostData } from "@/app/_libs/post";
import SearchField from "@/app/_components/SearchField";

type Props = {
  params: Promise<{
    current: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { current } = await params;
  const cur = parseInt(current as string, 10);

  if (Number.isNaN(cur) || cur < 1) {
    notFound();
  }

  // ページごとのブログ情報の取得
  const pageData = await getAllPostData(cur, BLOG_LIST_LIMIT);
  if (pageData.length === 0) {
    notFound();
  }
  // ブログの全数を取得
  const totalCount = await getNumPostData();

  return (
    <>
      <SearchField />
      <BlogList blog={pageData} />
      <Pagination totalCount={totalCount} current={cur} />
    </>
  );
}
