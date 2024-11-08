import Link from "next/link";
import type { PostData } from "@/app/_libs/post";
import Date from "../Date";
import Category from "../Category";
import styles from "./index.module.css";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import SyntaxHighlighter from "react-syntax-highlighter";
import type { ClassAttributes, HTMLAttributes } from "react";
import type { ExtraProps } from "react-markdown";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Image from "next/image";

type Props = {
  data: PostData;
};

const Pre = ({
  children,
  ...props
}: ClassAttributes<HTMLPreElement> &
  HTMLAttributes<HTMLPreElement> &
  ExtraProps) => {
  if (!children || typeof children !== "object") {
    return <code {...props}>{children}</code>;
  }
  const childType = "type" in children ? children.type : "";
  if (childType !== "code") {
    return <code {...props}>{children}</code>;
  }

  const childProps = "props" in children ? children.props : {};
  const { className, children: code } = childProps;
  const classList = className ? className.split(":") : [];
  const language = classList[0]?.replace("language-", "");
  const fileName = classList[1];

  return (
    <>
      {fileName && (
        <div>
          <span>{fileName}</span>
        </div>
      )}
      <SyntaxHighlighter language={language} style={tomorrow}>
        {String(code).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </>
  );
};

// カスタム img コンポーネント
const Img = ({ src, alt }: { src?: string; alt?: string }) => {
  if (!src) return null;

  // src が相対パスの場合、絶対パスに変換
  const imagePath = src.startsWith(".")
    ? `/posts/test/${src.replace("./", "")}`
    : src;

  return (
    <Image
      src={imagePath}
      alt={alt || "image"}
      width={600}
      height={400}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
};

export default function Article({ data }: Props) {
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
        // dangerouslySetInnerHTML={{ __html: data.contentHtml }}
      >
        <ReactMarkDown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            pre: Pre,
            img: Img,
          }}
        >
          {data.contentHtml}
        </ReactMarkDown>
      </div>
    </main>
  );
}
