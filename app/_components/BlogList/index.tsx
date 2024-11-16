import Link from "next/link";

import styles from "./index.module.css";
import Category from "../Category";
import Date from "../Date";
import { PostData } from "@/app/_libs/post";

type Props = {
  blog: PostData[];
};

export default function BlogList({ blog }: Props) {
  if (blog.length === 0) {
    return <p>記事がありません。</p>;
  }
  return (
    <ul>
      {blog.map((article) => (
        <li key={article.id} className={styles.list}>
          <div className={styles.link}>
            <dl className={styles.content}>
              <Link href={`/blog/${article.id}`}>
                <dt className={styles.title}>{article.title}</dt>
              </Link>
              <dd className={styles.meta}>
                <Category category={article.category} />
                <Date date={article.createdAt} />
              </dd>
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
}
