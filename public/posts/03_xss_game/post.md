---
title: "XSS Gameをやってみた"
createdAt: "2024-06-14"
category:
  - "CTF"
---

# XSS Game とは

Google が公開している XSS を実際に行えるサイト。
https://xss-game.appspot.com/

# level 1

```jsx
# Our search engine broke, we found no results :-(
message = "Sorry, no results were found for <b>" + query + "</b>."
message += " <a href='?'>Try again</a>."
```

ソースコードの 45 行目を見てみると、"<" や ">" の文字を変換するといった XSS 対策がされておらず、入力した値がそのまま評価されてしまうので、`<script>alert()</script>` と javascript を入力すると、alert 文が実行されクリアできました。

# level 2

level 1 と同様に`<script>alert()</script>` を入力してみますが、alert は表示されません。

```jsx
html += "<blockquote>" + posts[i].message + "</blockquote";
```

index.html の 30 行目を見てみると script タグをフィルタリングしているようなので script タグ以外で alert を実行させる必要があります。

やり方はいろいろあるみたいです。

`<img src=/ onerror=alert()>`

`<video src=/ onerror=alert()></video>`

`<svg onload=alert()>`

img タグのやりかたでクリアできました

# level 3

早速ソースコードを見てみます

```html
<div class="tab" id="tab1" onclick="chooseTab('1')">Image 1</div>
<div class="tab" id="tab2" onclick="chooseTab('2')">Image 2</div>
<div class="tab" id="tab3" onclick="chooseTab('3')">Image 3</div>
```

タブをクリックすると`chooseTab()` が呼ばれていることがわかります。

`chooseTab()` を見てみると受け取った引数で画像のファイル名を指定している部分がありました。ここに level2 同様のやり方が使えそうです。

```html
html += "<img src='/static/level3/cloud" + num + ".jpg' />";
```

`aaa' onerror=alert()>//`

とするとクリアできました。

# level 4

タイトルに「timer」とあるように入力した秒数だけカウントしてから`alert()`が呼ばれているようです。

ソースコードを見てみると、`timier.html`の 21 行目に入力した内容が入るようになっていました。

```html
<img src="/static/loading.gif" onload="startTimer('{{ timer }}');" />
```

あとに続く`)` や`'` を適切に当てはめると

`3');alert('` でクリアできました。

# level 5

メールアドレスを入力するページで、`Next >>`をクリックしたときにリダイレクトされていました。

![Screenshot from 2024-06-14 21-26-59.png](/posts/03_xss_game/Screenshot_from_2024-06-14_21-26-59.png)

ソースコードを見てみるとリダイレクトするページを指定するために URL パラメータが使用されていることがわかります。

```html
<a href="{{ next }}">Next >></a>
```

以下のように指定するとクリアできました。
`https://xss-game.appspot.com/level5/frame/signup?next=javascript:alert("XSS")`

# level 6

ソースコードを見てみます。

```jsx
// Take the value after # and use it as the gadget filename.
function getGadgetName() {
  return window.location.hash.substr(1) || "/static/gadget.js";
}

includeGadget(getGadgetName());
```

まずはじめに`getGadgetName()`が呼び出され、`https://xss-game.appspot.com/level6/frame#` に続いて入力したものを`url` として`includeGadget()` に渡しています。

```jsx
// This will totally prevent us from loading evil URLs!
if (url.match(/^https?:\/\//)) {
  setInnerText(
    document.getElementById("log"),
    'Sorry, cannot load a URL containing "http".'
  );
  return;
}

// Load this awesome gadget
scriptEl.src = url;
```

次に`includeGadget()` 内で`url` に「http」や「https」が含まれていないかチェックして、含まれていたらリターン、含まれていなければ`url` のリンク先にある JavaScript ファイルを読み込みます。

```jsx
// Show log messages
scriptEl.onload = function () {
  setInnerText(document.getElementById("log"), "Loaded gadget from " + url);
};
scriptEl.onerror = function () {
  setInnerText(
    document.getElementById("log"),
    "Couldn't load gadget from " + url
  );
};

document.head.appendChild(scriptEl);
```

その後に`onload` と`onerror` をセットして`<script>`要素を`<head>`セクションに追加しています。

これを見ると`url` に`alert()` が記述されたファイルのリンクを渡してやれば良さそうです。

`alert()`が記述されたファイルのアップロードは[tempsend.com](http://tempsend.com)を利用しました。

`https://xss-game.appspot.com/level6/frame#//tempsend.com/kdccm/e5469d/1718409462/alert.js`

のように入力するとクリアできました。

# 全クリ

![Screenshot from 2024-06-15 09-27-18.png](/posts/03_xss_game/Screenshot_from_2024-06-15_09-27-18.png)
