import BlogList from "@/app/_components/BlogList";
import Pagination from "@/app/_components/Pagination";
import SearchField from "@/app/_components/SearchField";
import { getAllPostData, getNumPostData } from "@/app/_libs/post";
import { BLOG_LIST_LIMIT } from "@/app/_constants";

export default async function Page() {
  //  すべての投稿を取得する
  const allData = await getAllPostData(1, BLOG_LIST_LIMIT);
  // ブログの全数を取得
  const totalCount = await getNumPostData();
  return (
    <>
      <SearchField />
      <BlogList blog={allData} />
      <Pagination totalCount={totalCount} />
    </>
  );
}
