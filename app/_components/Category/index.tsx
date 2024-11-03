import type { Category } from "@/app/_libs/microcms";
import styles from "./index.module.css";

type Props = {
  category: string;
};
export default function Category({ category }: Props) {
  return <span className={styles.tag}>{category}</span>;
}
