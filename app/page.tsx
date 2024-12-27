import styles from "./page.module.css";

import { TOP_BLOG_LIMIT } from "@/app/_constants";
import BlogList from "@/app/_components/BlogList";
import ButtonLink from "./_components/ButtonLink";
import { getAllPostData } from "@/app/_libs/post";

export default async function Home() {
  // ブログ一覧を取得
  const data = await getAllPostData(undefined, TOP_BLOG_LIMIT, undefined);

  return (
    <>
      <section className={styles.news}>
        <h2 className={styles.newsTitle}>New</h2>
        <BlogList blog={data} />
        <div className={styles.newsLink}>
          <ButtonLink href="/blog">もっとみる</ButtonLink>
        </div>
      </section>
    </>
  );
}
