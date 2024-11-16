import { notFound } from "next/navigation";
import BlogList from "@/app/_components/BlogList";
import Pagination from "@/app/_components/Pagination";
import { getCategoryPostData, getNumPostData } from "@/app/_libs/post";
import Category from "@/app/_components/Category";
import SearchField from "@/app/_components/SearchField";

type Props = {
  params: {
    current: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const current = parseInt(params.current as string, 10);

  if (Number.isNaN(current) || current < 1) {
    notFound();
  }

  const categoryPostData = await getCategoryPostData(current, params.id);
  if (categoryPostData.length === 0) {
    notFound();
  }
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
        current={current}
        basePath={`/blog/category/${params.id}`}
      />
    </>
  );
}
