// import type { Category } from "@/app/_libs/microcms";
import styles from "./index.module.css";
import Link from "next/link";

type Props = {
  category: string | string[];
};
export default function Category({ category }: Props) {
  if (Array.isArray(category)) {
    return (
      <div>
        {category.map((cat) => (
          <span key={cat}>
            <Link href={`/blog/category/${cat}`}>
              <span className={styles.tag}>{cat}</span>
            </Link>
          </span>
        ))}
      </div>
    );
  }

  // 文字列の場合は単一のリンク
  return (
    <Link href={`/blog/category/${category}`}>
      <span className={styles.tag}>{category}</span>
    </Link>
  );
}
