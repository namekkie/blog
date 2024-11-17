"use client";

import Script from "next/script";
import Link from "next/link";
import type { PostData } from "@/app/_libs/post";
import Date from "../Date";
import Category from "../Category";
import styles from "./index.module.css";
import "zenn-content-css";

import { useEffect, useState } from "react";

type Props = {
  data: PostData;
};

// モーダル用コンポーネント
const ImageModal = ({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) => {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="relative">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-screen object-contain"
        />
        <button
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default function Article({ data }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState({ src: "", alt: "" });

  // 画像クリックイベント
  const handleImageClick = (event: MouseEvent) => {
    const target = event.target as HTMLImageElement;
    if (target.tagName === "IMG") {
      setModalImage({ src: target.src, alt: target.alt });
      setIsModalOpen(true);
    }
  };

  // モーダルを閉じる処理
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImage({ src: "", alt: "" });
  };

  useEffect(() => {
    import("zenn-embed-elements");

    // 画像クリックイベントの設定
    const contentDiv = document.querySelector(".znc") as HTMLElement | null;
    contentDiv?.addEventListener("click", (event: Event) => {
      const target = event.target as HTMLImageElement;
      if (target.tagName === "IMG") {
        setModalImage({ src: target.src, alt: target.alt });
        setIsModalOpen(true);
      }
    });

    return () => {
      // クリーンアップ処理
      contentDiv?.removeEventListener("click", handleImageClick);
    };
  }, []);

  return (
    <article>
      <h1 className={styles.title}>{data.title}</h1>
      <div className={styles.meta}>
        <Link
          href={`/blog/category/${data.category}`}
          className={styles.categoryLink}
        ></Link>
        <Category category={data.category} />

        <Date date={data.createdAt} />
      </div>
      <div
        className="znc"
        dangerouslySetInnerHTML={{ __html: data.contentHtml }}
      ></div>

      {/* モーダル表示 */}
      {isModalOpen && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          onClose={handleCloseModal}
        />
      )}

      {/* 外部スクリプトの読み込み (Zenn の埋め込み機能用) */}
      <Script
        src="https://embed.zenn.studio/js/listen-embed-event.js"
        strategy="lazyOnload"
      />
    </article>
  );
}
