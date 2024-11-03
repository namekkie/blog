import styles from "./page.module.css";
import Image from "next/image";

import { getBlogList } from "@/app/_libs/microcms";
import { TOP_BLOG_LIMIT } from "@/app/_constants";
import BlogList from "@/app/_components/BlogList";
import ButtonLink from "./_components/ButtonLink";
import { getAllPostIds, getPostData, getAllPostData } from "@/app/_libs/post";

export default async function Home() {
  // const data = await getBlogList({
  //   limit: TOP_BLOG_LIMIT,
  // });

  const data = await getAllPostData(TOP_BLOG_LIMIT);

  return (
    <>
      <section className={styles.top}>
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
      </section>
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
