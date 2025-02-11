import { notFound } from "next/navigation";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";
import { getAllPostIds, getPostData } from "@/app/_libs/post";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

/// `generateStaticParams`で静的パスを生成
export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths.map((path) => ({
    params: { slug: path.params.name },
  }));
}

// サーバーコンポーネントとしてデータを取得して表示
export default async function Post({ params }: Props) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  // 投稿データが存在しない場合は404ページに遷移
  if (!postData) {
    notFound();
  }

  return (
    <>
      <Article data={postData} />
      <div className={styles.footer}>
        <ButtonLink href="/blog">ブログ一覧へ</ButtonLink>
      </div>
    </>
  );
}
