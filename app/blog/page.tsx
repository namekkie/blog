import BlogList from "@/app/_components/BlogList";
import Pagination from "@/app/_components/Pagination";
import SearchField from "@/app/_components/SearchField";
import { getAllPostData } from "@/app/_libs/post";

export default async function Page() {
  //  すべての投稿を取得する
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
