"use client";

import Script from "next/script";
import Link from "next/link";
import type { PostData } from "@/app/_libs/post";
import Date from "../Date";
import Category from "../Category";
import styles from "./index.module.css";
import "zenn-content-css";

import { useEffect } from "react";

type Props = {
  data: PostData;
};

export default function Article({ data }: Props) {
  useEffect(() => {
    import("zenn-embed-elements");
  }, []);

  return (
    <article>
      <h1 className={styles.title}>{data.title}</h1>
      <div className={styles.meta}>
        <Link
          href={`/blog/category/${data.category}`}
          className={styles.categoryLink}
        >
          <Category category={data.category} />
        </Link>
        <Date date={data.createdAt} />
      </div>
      <div
        className="znc"
        dangerouslySetInnerHTML={{ __html: data.contentHtml }}
      ></div>
      {/* 外部スクリプトの読み込み (Zenn の埋め込み機能用) */}
      <Script
        src="https://embed.zenn.studio/js/listen-embed-event.js"
        strategy="lazyOnload"
      />
    </article>
  );
}
