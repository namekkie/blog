import { getCategoryPostData } from "@/app/_libs/post";
import BlogList from "@/app/_components/BlogList";
import Pagination from "@/app/_components/Pagination";
import Category from "@/app/_components/Category";
import SearchField from "@/app/_components/SearchField";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const categoryPostData = await getCategoryPostData(1, params.id);
  // categoryがついているブログ数を取得
  const totalCount = (await getCategoryPostData(0, params.id)).length;

  return (
    <>
      <SearchField />
      <h2 className=" text-lg font-bold mt-5 mb-5">
        <Category category={params.id} /> の一覧
      </h2>
      <BlogList blog={categoryPostData} />
      <Pagination
        totalCount={totalCount}
        basePath={`/blog/category/${params.id}`}
      />
    </>
  );
}
