---
title: "Next.js でハンバーガーメニューをいい感じに実装する"
createdAt: "2024-05-13"
category:
  - "next.js"
---

# こんな感じのサイドバーを作りたい

![output.gif](/posts/01_nextjs_humberger_menu/output.gif)

# よくあるヘッダーメニューをつくる

まずはじめによくあるヘッダーメニューを作ってみます。

```jsx
export default async function Home() {
  return (
    <main>
      <header className="drop-shadow-xl bg-white">
        <div className=" flex items-center container m-auto justify-between py-10 px-4 text-lg">
          <h2 className=" font-bold text-3xl">タイトル</h2>
          <div>
            <a href="/" className=" px-3">
              メニュー１
            </a>
            <a href="/" className=" px-3">
              メニュー２
            </a>
            <a href="/" className=" px-3">
              メニュー３
            </a>
            <a href="/" className=" px-3">
              メニュー４
            </a>
            <a href="/" className=" px-3">
              メニュー５
            </a>
          </div>
        </div>
      </header>
    </main>
  );
}
```

ノート PC のような大きい画面で見る場合はこれで十分なのですが、スマホのような小さい画面で表示すると画面幅にメニューが入り切らずレイアウトが大きく崩れます。
そのため、スマホのような小さな画面では必要に応じてメニューを展開できるハンバーガーメニューが好まれます。

# ハンバーガーメニューを実装する

ここから、タップしたらメニューがスライドインし、もう一度タップしたらメニューがスライドアウトするハンバーガーメニューを作っていきます。

## react-icons のインストール

まずはじめにハンバーガーメニューのアイコンは[react-icons](https://react-icons.github.io/react-icons/)を利用するので、インストールしておきましょう。

```bash
$ npm i react-icons
```

## ハンバーガーメニューを設置する

ヘッダーに横並びで設置していたメニュー部分はタブレットサイズ以上のみで表示させるために`className="hidden md:inline-flex"`を指定します。
逆に追加したハンバーガーメニューはスマホサイズのみで表示させるため`className="md:hidden"`を指定します。

```diff jsx
+ "use client";
+ import { RxHamburgerMenu } from "react-icons/rx";
+ import { IconContext } from "react-icons";

export default async function Home() {
  return (
    <main>
      <header className="drop-shadow-xl bg-white">
        <div className=" flex items-center container m-auto justify-between py-10 px-4 text-lg">
          <h2 className=" font-bold text-3xl">タイトル</h2>
+          <div className="hidden md:inline-flex">
            <a href="/" className=" px-3">
              メニュー１
            </a>
            <a href="/" className=" px-3">
              メニュー２
            </a>
            <a href="/" className=" px-3">
              メニュー３
            </a>
            <a href="/" className=" px-3">
              メニュー４
            </a>
            <a href="/" className=" px-3">
              メニュー５
            </a>
          </div>

+         {/* ハンバーガーメニュー */}
+          <IconContext.Provider value={{ size: "30px" }}>
+            <button className="md:hidden">
+              <RxHamburgerMenu />
+            </button>
+          </IconContext.Provider>
        </div>
      </header>
    </main>
  );
}

```

## スライドイン状態を作成する

メニューは`absolute`を利用して画面上に重なって表示されるように作ります。

また、閉じるボタンを追加してメニューのスライドインとスライドアウトを操作できるように準備します。

```diff jsx
"use client";
import { RxHamburgerMenu } from "react-icons/rx";
+ import { RxCross1 } from "react-icons/rx";
import { IconContext } from "react-icons";
+ import styles from "./sidebar.module.css";

export default async function Home() {
  return (
    <main>
      <header className="drop-shadow-xl bg-white">
        <div className=" flex items-center container m-auto justify-between py-10 px-4 text-lg">
          <h2 className=" font-bold text-3xl">タイトル</h2>
          <div className="hidden md:inline-flex">
            <a href="/" className=" px-3">
              メニュー１
            </a>
            <a href="/" className=" px-3">
              メニュー２
            </a>
            <a href="/" className=" px-3">
              メニュー３
            </a>
            <a href="/" className=" px-3">
              メニュー４
            </a>
            <a href="/" className=" px-3">
              メニュー５
            </a>
          </div>

          {/* ハンバーガーメニュー */}
          <IconContext.Provider value={{ size: "30px" }}>
            <button className="md:hidden">
              <RxHamburgerMenu />
            </button>
          </IconContext.Provider>

+          {/* ハンバーガーメニューが展開された表示 */}
+          <div className={styles.sidebar_show}>
+            {/* 閉じるボタン */}
+            <IconContext.Provider value={{ size: "30px" }}>
+              <div className=" flex justify-end">
+                <button className="mr-4 mt-10 h-8 w-8">
+                  <RxCross1 />
+                </button>
+              </div>
+              {/* メニュー */}
+            </IconContext.Provider>
+            <nav className="fixed mt-8 h-full">
+              <div className=" px-12 py-4 font-bold text-2xl">
+                <a href="/">メニュー１</a>
+              </div>
+              <div className=" px-12 py-4 font-bold text-2xl">
+                <a href="/">メニュー２</a>
+              </div>
+              <div className=" px-12 py-4 font-bold text-2xl">
+                <a href="/">メニュー３</a>
+              </div>
+              <div className=" px-12 py-4 font-bold text-2xl">
+                <a href="/">メニュー４</a>
+              </div>
+              <div className=" px-12 py-4 font-bold text-2xl">
+                <a href="/">メニュー５</a>
+              </div>
+            </nav>
+          </div>
        </div>
      </header>
    </main>
  );
}

```

メニューには以下の CSS を当てて、画面右上から幅が 2/3,高さが画面 MAX までメニューを表示します。

`z-index` を指定してメニューが上に重なるように指定します。

```diff jsx
+.sidebar_show {
+  width: 66.666667%;
+  position: absolute;
+  top: 0;
+  height: 100vh;
+  opacity: 0.9;
+  background-color: rgb(255 255 240 / var(--tw-bg-opacity));
+  z-index: 10;
+  right: 0;
+  transition: 0.5s;
}
```

## クリック時のアニメーションをつくる

ハンバーガーメニューのクリック時にスライドイン/アウトするアニメーションは React のステート管理と CSS アニメーションを組み合わせて実現します。

`useState`フックを使ってメニューの開閉状態を管理するステートを追加し、メニューを開閉する関数を定義します。

ハンバーガーメニューアイコンをクリックしたときに`menuFunction`が呼び出され `opneMenu` の true/false が反転します。

`openMenu`状態に応じてハンバーガーメニューに適用する CSS クラスを切り替えることで、メニューの表示/非表示をアニメーションします。

```diff jsx
"use client";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import { IconContext } from "react-icons";
import styles from "./sidebar.module.css";
+ import React, { useState } from "react";

+ export default function Home() {
+  const [openMenu, setOpenMenu] = useState(false);
+  const menuFunction = () => {
+    setOpenMenu(!openMenu);
  };
  return (
    <main>
      <header className="drop-shadow-xl bg-white">
        <div className=" flex items-center container m-auto justify-between py-10 px-4 text-lg">
          <h2 className=" font-bold text-3xl">タイトル</h2>
          <div className="hidden md:inline-flex">
            <a href="/" className=" px-3">
              メニュー１
            </a>
            <a href="/" className=" px-3">
              メニュー２
            </a>
            <a href="/" className=" px-3">
              メニュー３
            </a>
            <a href="/" className=" px-3">
              メニュー４
            </a>
            <a href="/" className=" px-3">
              メニュー５
            </a>
          </div>

          {/* ハンバーガーメニュー */}
          <IconContext.Provider value={{ size: "30px" }}>
+            <button onClick={menuFunction} className="md:hidden">
              <RxHamburgerMenu />
            </button>
          </IconContext.Provider>

          {/* ハンバーガーメニューが展開された表示 */}
          <div
+            className={openMenu ? styles.sidebar_show : styles.sidebar_hidden}
          >
            {/* 閉じるボタン */}
            <IconContext.Provider value={{ size: "30px" }}>
              <div className=" flex justify-end">
+                <button onClick={menuFunction} className="mr-4 mt-10 h-8 w-8">
                  <RxCross1 />
                </button>
              </div>
              {/* メニュー */}
            </IconContext.Provider>
            <nav className="fixed mt-8 h-full">
              <div className=" px-12 py-4 font-bold text-2xl">
                <a href="/">メニュー１</a>
              </div>
              <div className=" px-12 py-4 font-bold text-2xl">
                <a href="/">メニュー２</a>
              </div>
              <div className=" px-12 py-4 font-bold text-2xl">
                <a href="/">メニュー３</a>
              </div>
              <div className=" px-12 py-4 font-bold text-2xl">
                <a href="/">メニュー４</a>
              </div>
              <div className=" px-12 py-4 font-bold text-2xl">
                <a href="/">メニュー５</a>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </main>
  );
}
```

`sidebar_hidden`クラスはメニューを画面外に表示し、`transition`プロパティにより、右側からのスライドのアニメーションが 0.5 秒かけて実行されます。

```diff jsx
.sidebar_show {
  width: 66.666667%;
  position: absolute;
  top: 0;
  height: 100vh;
  opacity: 0.9;
  background-color: rgb(255 255 240 / var(--tw-bg-opacity));
  z-index: 10;
  right: 0;
  transition: 0.5s;
}
+.sidebar_hidden {
+  width: 66.666667%;
+  position: absolute;
+  top: 0;
+  height: 100vh;
+  opacity: 0.9;
+  background-color: rgb(255 255 240 / var(--tw-bg-opacity));
+  z-index: 10;
+  right: -66.666667%;
+  transition: 0.5s;
}
```
