"use client";

import { RxHamburgerMenu } from "react-icons/rx";
import { IconContext } from "react-icons";
import { RxCross1 } from "react-icons/rx";
import Link from "next/link";
import { useState } from "react";
import cx from "classnames";
import styles from "./index.module.css";

export default function Menu() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return (
    <div>
      <nav className={cx(styles.nav, isOpen && styles.open)}>
        <ul className={styles.items}>
          <li>
            <Link href="/blog">BLOG</Link>
          </li>
          {/* <li>
            <Link href="/timeline">TIMELINE</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li> */}
        </ul>
        {/* 閉じるボタン */}
        <IconContext.Provider value={{ size: "30px" }}>
          <div className=" flex justify-end">
            <button className={cx(styles.button, styles.close)} onClick={close}>
              <RxCross1 />
            </button>
          </div>
        </IconContext.Provider>
      </nav>
      {/* ハンバーガーメニュー */}
      <IconContext.Provider value={{ size: "30px" }}>
        <button className={styles.button} onClick={open}>
          <RxHamburgerMenu />
        </button>
      </IconContext.Provider>
    </div>
  );
}
