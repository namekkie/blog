import { notFound } from "next/navigation";
import { getBlogDetail } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";
import { getAllPostIds, getPostData } from "@/app/_libs/post";
import { GetStaticProps, GetStaticPaths } from "next";

// type Props = {
//   params: {
//     slug: string;
//   };
//   searchParams: {
//     dk?: string;
//   };
// };

type PostData = {
  id: string;
  title: string;
  date: string;
  contentHtml: string;
};

type Props = {
  params: {
    slug: string;
  };
};

/// `generateStaticParams`で静的パスを生成
export async function generateStaticParams() {
  const paths = getAllPostIds();

  return paths.map((path) => ({
    id: path.params.id,
  }));
}

// サーバーコンポーネントとしてデータを取得して表示
export default async function Post({ params }: Props) {
  const postData = await getPostData(params.slug);
  console.log(postData);

  // // 投稿データが存在しない場合は404ページに遷移
  // if (!postData) {
  //   notFound();
  // }

  return (
    <>
      <Article data={postData} />
      <div className={styles.footer}>
        <ButtonLink href="/blog">ブログ一覧へ</ButtonLink>
      </div>
      {/* <h1>{postData.title}</h1> */}
      {/* <div>{postData.date}</div> */}
      {/* contentHtmlをそのまま表示する */}
      {/* <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} /> */}
    </>
  );
}

// export default async function Page({ params, searchParams }: Props) {
//   const data = await getBlogDetail(params.slug, {
//     draftKey: searchParams.dk,
//   }).catch(notFound);

//   return (
//     <>
//       <Article data={data} />
//       <div className={styles.footer}>
//         <ButtonLink href="/blog">ブログ一覧へ</ButtonLink>
//       </div>
//     </>
//   );
// }
