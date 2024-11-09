import styles from "./page.module.css";
import Image from "next/image";

import { TOP_BLOG_LIMIT } from "@/app/_constants";
import BlogList from "@/app/_components/BlogList";
import ButtonLink from "./_components/ButtonLink";
import { getAllPostData } from "@/app/_libs/post";

export default async function Home() {
  // ブログ一覧を取得
  const data = await getAllPostData(TOP_BLOG_LIMIT);

  return (
    <>
      {/* <section className={styles.top}>
        <div>
          <h1 className={styles.title}>ギークになりたい</h1>
          <p className={styles.description}>小さな一歩。ただ、確実な進歩。</p>
        </div>
        <Image
          className={styles.bgimg}
          src="/img-mv.jpg"
          alt=""
          width={4000}
          height={1200}
        />
      </section> */}
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
