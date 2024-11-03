import Link from "next/link";
import type { PostData } from "@/app/_libs/post";
import Date from "../Date";
import Category from "../Category";
import styles from "./index.module.css";

type Props = {
  data: PostData;
};

export default function Article({ data }: Props) {
  console.log(data);

  return (
    <main>
      <h1 className={styles.title}>{data.title}</h1>
      <div className={styles.meta}>
        <Link
          href={`/blog/category/${data.category}`}
          className={styles.categoryLink}
        >
          <Category category={data.category} />
        </Link>
        <Date date={data.publishedAt ?? data.createdAt} />
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: data.contentHtml }}
      />
    </main>
  );
}
