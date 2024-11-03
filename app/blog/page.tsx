import { getBlogList } from "@/app/_libs/microcms";
import BlogList from "@/app/_components/BlogList";
import Pagination from "@/app/_components/Pagination";
import SearchField from "@/app/_components/SearchField";
import { BLOG_LIST_LIMIT } from "@/app/_constants";
import { getAllPostIds, getPostData, getAllPostData } from "@/app/_libs/post";

export default async function Page() {
  // const { contents: blog, totalCount } = await getBlogList({
  //   limit: BLOG_LIST_LIMIT,
  // });
  /// `generateStaticParams`で静的パスを生成

  //  すべての投稿IDを取得する
  const allData = await getAllPostData();
  const totalCount = allData.length;
  return (
    <>
      <SearchField />
      <BlogList blog={allData} />;
      <Pagination totalCount={totalCount} />
    </>
  );
}
