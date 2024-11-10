---
title: "Next.jsでmarkdownブログを構築"
createdAt: "2022-07-13"
updatedAt: "2022-07-13"
description: "Next.jsでmarkdownファイルを利用したブログの構築手順を解説しています。"
category:
  - "CTF"
  - "AAA"
---

Next.js を使って Markdown のブログサイトの構築を一から行なっていきます。

## Next.js の準備

### プロジェクトの作成

#### test

![markdown dir](/posts/test//h07.png)

https://www.youtube.com/watch?v=WRVsOCh907o

https://twitter.com/jack/status/20

```typescript:file/index.ts
// src/@types/remark-prism.d.ts
declare module "remark-prism" {
  import { Plugin } from "unified";

  const remarkPrism: Plugin;

  export default remarkPrism;
}
```

```diff js:test.js
@@ -4,6 +4,5 @@
+    const foo = bar.baz([1, 2, 3]) + 1;
-    let foo = bar.baz([1, 2, 3]);
```

:::message
メッセージをここに
:::

`puts 'Qiita'` と書くことでインライン表示することも可能です。

> 文頭に>を置くことで引用になります。
> 複数行にまたがる場合、改行のたびにこの記号を置く必要があります。
> **引用の上下にはリストと同じく空行がないと正しく表示されません**
> 引用の中に別の Markdown を使用することも可能です。
>
> > これはネストされた引用です。

[Qiita](http://qiita.com "Qiita Home")

http://qiita.com

| Left align | Right align | Center align |
| :--------- | ----------: | :----------: |
| This       |        This |     This     |
| column     |      column |    column    |
| will       |        will |     will     |
| be         |          be |      be      |
| left       |       right |    center    |
| aligned    |     aligned |   aligned    |

$$
e^{i\theta} = \cos\theta + i\sin\theta
$$

npx create-next-app コマンドを利用して Next.js プロジェクトの作成を行います。
