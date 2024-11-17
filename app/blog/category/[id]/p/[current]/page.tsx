import { notFound } from "next/navigation";
import BlogList from "@/app/_components/BlogList";
import Pagination from "@/app/_components/Pagination";
import { getCategoryPostData } from "@/app/_libs/post";
import Category from "@/app/_components/Category";
import SearchField from "@/app/_components/SearchField";

type Props = {
  params: {
    current: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const { current } = await params;
  const { id } = await params;
  const cur = parseInt(current as string, 10);

  if (Number.isNaN(cur) || cur < 1) {
    notFound();
  }

  const categoryPostData = await getCategoryPostData(cur, id);
  if (categoryPostData.length === 0) {
    notFound();
  }
  // categoryがついているブログ数を取得
  const totalCount = (await getCategoryPostData(0, id)).length;

  return (
    <>
      <SearchField />
      <h2 className=" text-lg font-bold mt-5 mb-5">
        <Category category={id} /> の一覧
      </h2>
      <BlogList blog={categoryPostData} />
      <Pagination
        totalCount={totalCount}
        current={cur}
        basePath={`/blog/category/${id}`}
      />
    </>
  );
}
