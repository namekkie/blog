import Link from "next/link";
import styles from "./index.module.css";
import Menu from "../Menu";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="max-w-screen-lg flex items-center container m-auto justify-between px-2">
        <Link href="/" className={styles.logoLink}>
          <h1 className=" font-bold  text-xl">ギークになりたい</h1>
        </Link>
        <Menu />
      </div>
    </header>
  );
}
