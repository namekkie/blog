---
title: "picoCTF2024 writeup"
createdAt: "2024-12-14"
category:
  - "CTF"
---

# Forensics

## Verify

ssh でログインすると３つファイルがありました。

```bash
ctf-player@pico-chall$ ls
checksum.txt  decrypt.sh	files
```

`decrypt.sh`に`\files`内の全てのファイルを引数で与えて実行すればいいと思い、`script.sh`を作成して実行しました。

```bash
ctf-player@pico-chall$ echo -e "for file in ./files/*; do\n ./decrypt.sh \"\$file\"\n done" > script.sh
ctf-player@pico-chall$ chmod 755 script.sh
ctf-player@pico-chall$ ./script.sh
~~~
Error: Failed to decrypt './files/8TaaNFiI'. This flag is fake! Keep looking!
picoCTF{trust_but_verify_8eee7195}
bad magic number
Error: Failed to decrypt './files/8sUHOjM7'. This flag is fake! Keep looking!
~~~
```

ただ、実際には`sha256sum`を使って`\files`内のファイルのハッシュ値が`checksum.txt`と一致するものを調べれば良かったみたいです。

```bash
ctf-player@pico-chall$ sha256sum files/* | grep 5848768e56185707f76c1d74f34f4e03fb0573ecc1ca7b11238007226654bcda
5848768e56185707f76c1d74f34f4e03fb0573ecc1ca7b11238007226654bcda  files/8eee7195
ctf-player@pico-chall$ decrypt.sh ./files/8eee7195
picoCTF{trust_but_verify_8eee7195}
```

## Scan Surprise

QRcode を読み取る問題でした。

```bash
zbarimg -q flag.png
QR-Code:picoCTF{p33k_@_b00_7843f77c}
```

## Secret of the Polyglot

PDF ファイルが与えられます。ファイルを開いてみるとフラグの後半部分だけ見えました。
次に`strings`コマンドを実行してみると、PDF だけでなく png のチャンクがあることがわかりました。

```bash
$ strings flag2of2-final.pdf
IHDR
~~~
IEND
%PDF-1.4
~~~
%%EOF
```

png ファイルとして開いてみると、フラグの前半部分も確認できました。

## CanYouSee

画像ファイルが与えられます。
`exiftool`でメタデータを見てみると Base64 で暗号化されたフラグが見つかりました。

## Mob psycho

apk ファイルが与えられます。
`unzip`で解凍して、名前に`flag`が含まれるファイル名を検索したら、16 進数変換されたフラグが記載されてました。

```bash
$ unzip mobpsycho.apk
$ find . -name 'flag*'
./res/color/flag.txt
```

## endianness-v2

バイナリファイルが与えられます。
バイナリエディタで開いてみると、バイトオーダがビックエンディアンになっているのでリトルエンディアンに変換してあげます。

```python
# バイナリモードでファイルオープン
with open("./challengefile", "rb") as file:
    binary_data = file.read()

# 変換後のデータを格納する変数の定義
sort_binary_data = bytearray(len(binary_data))

# 4で割り切れる数+1回ループし、余分なループは例外処理へ
for i in range(int(len(binary_data)/4)+1):
    for j in range(4):
        try:
            sort_binary_data[i*4+j] = binary_data[i*4+3-j]
        except:
            pass

# 変換後のデータを書き込み
with open("output.jpg", "wb") as file:
    file.write(sort_binary_data)
```

## Blast from the past

ファイルのタイムスタンプを書き換える問題。
以下の 7 つを変更する必要がある。

- IFD0: ModifyDate
- ExifIFD: DateTimeOriginal
- ExifIFD: CreateDate
- Composite: SubSecCreateDate
- Composite: SubSecDateTimeOriginal
- Composite: SubSecModifyDate
- Samsung: TimeStamp

`Samsung:TimeStamp`以外は`exiftool`で書き換えできた。

```bash
$ exiftool -AllDates="1970:01:01 00:00:00.001" \
         -SubSecCreateDate="1970:01:01 00:00:00.001" \
         -SubSecDateTimeOriginal="1970:01:01 00:00:00.001" \
         -SubSecModifyDate="1970:01:01 00:00:00.001" \
         -FileModifyDate="1970:01:01 00:00:00.001+00:00" \
         -overwrite_original original.jpg
```

`Samsung:TimeStamp`は書き換えできなかったのでバイナリエディタから直接編集した。
ファイル下部の`Image_UTC_DataXXXXXXXXXXXXXX`となっている部分を`Image_UTC_Data0000000000001`に編集した。

# General

## Binary Search

２分探索を行います。

## Time Machine

過去のコミットログを探します。

```bash
$ git log -p --all --full-history
commit 89d296ef533525a1378529be66b22d6a2c01e530 (HEAD -> master)
Author: picoCTF <ops@picoctf.com>
Date:   Tue Mar 12 00:07:22 2024 +0000

    picoCTF{t1m3m@ch1n3_186cd7d7}

~~~
```

## Super SSH

ssh するだけ。

## endianness

## Commitment Issues

過去のコミットログを探します。

```bash
$ git log -p --all --full-history
~~~
    -picoCTF{s@n1t1z3_9539be6b}
~~~
```

## Collaborative Development

過去のコミットログを探します。

## Blame Game

過去のコミットログを探します。

```bash
$ git log -p --all --full-history
~~~
commit 9ae3e1bc67ad0143c611c5f65399b79850d20983
Author: picoCTF{@sk_th3_1nt3rn_b64c4705} <ops@picoctf.com>
~~~
```

## binhexa

2 進数の計算を入力していく。

## dont-you-love-banners

説明にあるアドレスにアクセスしてみるとパスワードが要求されます。

```bash
$ nc tethys.picoctf.net 53210
*************************************
**************WELCOME****************
*************************************

what is the password?
aaa
Lol, good try, try again and good luck
```

`curl`でアクセスしてみると怪しい文字列があり、それがパスワードでした。

```bash
$ curl tethys.picoctf.net:57271/ --http0.9 -v
*   Trying 3.140.72.182:57271...
* Connected to tethys.picoctf.net (3.140.72.182) port 57271 (#0)
> GET / HTTP/1.1
> Host: tethys.picoctf.net:57271
> User-Agent: curl/7.81.0
> Accept: */*
>
SSH-2.0-OpenSSH_7.6p1 My_Passw@rd_@1234
* Recv failure: 接続が相手からリセットされました
* Closing connection 0
curl: (56) Recv failure: 接続が相手からリセットされました
```

その他にもいくつかクイズがあったので解答します。

```bash
$ nc tethys.picoctf.net 53210
*************************************
**************WELCOME****************
*************************************

what is the password?
My_Passw@rd_@1234
What is the top cyber security conference in the world?
DEFCON
the first hacker ever was known for phreaking(making free phone calls), who was it?
John Draper
player@challenge:~$
```

シェルが実行されました。
問題にあるように`/root/flag.txt`がありましたが権限がなく読み取れません。
`/root/script.py`を見てみると、`/home/player/banner`を読み取って出力していることがわかります。
そこで、`/home/player/banner`に`/root/flag.txt`のシンボリックリンクを張り、`/root/script.py`を実行するとフラグが出力されました。

```bash
player@challenge:~$ rm banner
rm banner
player@challenge:~$ ln -s /root/flag.txt banner
ln -s /root/flag.txt banner

$ nc tethys.picoctf.net 53210
picoCTF{b4nn3r_gr4bb1n9_su((3sfu11y_f7608541}

what is the password?
```

## SansAlpha

指定されたサーバーにアクセスしてみると、数字と一部の記号しか使えないことがわかる。

```bash
SansAlpha$ ls
SansAlpha: Unknown character detected
SansAlpha$ 1
bash: 1: command not found
SansAlpha$ ?
bash: ?: command not found
```

ワイルドカードである`?`は使えるので`/???/???/???`のようにすると`/var/log/sys `のような該当するパスとして認識される。
これを配列として変数(`___`や`____`など)に格納してスライスして使えば任意の文字として扱うことができる。

```bash
SansAlpha$ ___=(/???/???/?????)
SansAlpha$ $___
bash: /etc/ssl/certs: Is a directory
SansAlpha$ ____=(/???/?????/???)
SansAlpha$ $____
bash: /sys/class/bdi: Is a directory
SansAlpha$ ${___:7:1}${___:5:1} # ls
blargh    on-calastran.txt
${___:3:1}${____:7:1}${___:2:1} * # cat *
cat: blargh: Is a directory
The Calastran multiverse is a complex and interconnected web of realities, each
~~~
cosmic harmony.
SansAlpha$ ${___:3:1}${____:7:1}${___:2:1} ??????/* # cat ??????/*
return 0 picoCTF{7h15_mu171v3r53_15_m4dn355_775ac12d}Alpha-9, a distinctive layer within the Calastran multiverse, stands as a
~~~
```

# web

## WebDecode

`about.html`に base64 で暗号化されたフラグが隠れてる

## Unminify

css のクラス名がフラグになっている

## IntroToBurp

Burp で OPT のリクエストを送るときに`opt`をタグごと削除して送信すると、レスポンスにフラグがあった。

## Bookmarklet

chrome の開発者ツールからコンソールを開いて、`javascript`を貼り付けて実行するとフラグが出力されました。
