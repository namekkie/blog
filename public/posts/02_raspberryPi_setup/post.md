---
title: "モニターなしでRaspbery Pi 4をセットアップする"
createdAt: "2024-06-12"
category:
  - "RaspberryPi"
---

# 1. 概要

ずっと欲しいなと思っていた Rasuberry Pi をついに購入しました！

一時期は入手困難となり、とんでも価格で転売されていましたが、現時点では正規価格で購入できました。

さっそくセットアップと思ったのですがディスプレイを持ち合わせていない（しまってあるのを引っ張り出すのがめんどくさい）ため、SSH を使ってノート PC から遠隔でセットアップを行ってみたいと思います。

# 2. 開封

![IMG_7178.jpg](/posts/02_raspberryPi_setup/rasuberryPi.png)

Amazon でスターターキットを購入。

セールで 14,000 円ぐらいでした。

# 3. OS のインストール

[Raspberry Pi Imager](https://www.raspberrypi.com/software/) を使用して、SD カードに OS を書き込みます。今回はスタンダードな`RASPBERRY PI OS(32-BIT)`を書き込みました。

右下の歯車ボタンから Wi-Fi 等の設定を行います。

![Screenshot from 2024-06-12 18-30-34_.png](/posts/02_raspberryPi_setup/Screenshot_from_2024-06-12_18-30-34_.png)

設定を保存したら「書き込む」ボタンを押して SD カードに書き込まれるのを待ちます。

# 4. Raspberry Pi の起動

書き込みが終了したら SD カードを Raspberry Pi に差し込んで電源を入れます。

ホスト PC から SSH で接続します。

```bash
ssh pi@raspberrypi.local
```

## 4.1 SSH で接続できない

SSH で接続すると以下のようなエラーがでる。

```bash
$ ssh pi@raspberrypi.local
ssh: Could not resolve hostname raspberrypi.local: Name or service not known
```

Wi-Fi が繋がっていないことが原因みたいなんですが、

インターネットを頼りに色々と試してみても改善できず、、

ここで Wi−Fi での接続を一旦諦め、

余ってた LAN ケーブルを持ってきて Rasuberry Pi とルーターを有線で接続しました。。

## 4.2 再度 SSH で接続する

Rasuberry Pi とルーターを有線し、再度ホスト PC から SSH で Rasuberry Pi に接続します。

```bash
ssh pi@raspberrypi.local
```

初めて接続する場合、ホストの信頼性を確認されるので「yes」と入力します。

```bash
The authenticity of host 'raspberrypi.local (***)' can't be established.
ED25519 key fingerprint is *** .
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
```

パスワードを聞かれるので入力します。

```bash
pi@raspberrypi.local's password:
```

以下のように表示されれば成功です。

```bash
pi@raspberrypi:~ $
```

# 5. Wi-Fi で接続してみる

SSH で接続できたので Rasuberry Pi の設定を直接変更して Wi-Fi で接続できるようにしてみます。

まず Wi-Fi デバイスの確認をします。

```bash
nmcli device status
```

Wi-Fi デバイスが無効の場合、有効化します（通常、Wi-Fi デバイス名は`wlan0`や`wlp2s0`などです）。

```bash
nmcli radio wifi on
```

利用可能な Wi-Fi ネットワークをスキャンして表示します。

```bash
nmcli device wifi list
```

上記のネットワークから、接続したい Wi-Fi ネットワークの SSID とパスワードを使って接続します。

```bash
nmcli device wifi connect "<SSID>" password "<PASSWORD>"
```

接続を確認します。

```bash
nmcli connection show
```

接続したネットワークの SSID が表示されれば成功です。

# 6. Rasuberry Pi に RDP で接続する

## 6.1 固定 IP アドレスの設定

ネットワークの設定ファイルを編集し、IP アドレス値を固定します。今回は**`192.168.3.20`**で固定してみます。

ネットで固定 IP のやり方を調べると **`/etc/dhcpcd.conf`**を編集するやり方がたくさん出てくるのですが、自分の Rasuberry Pi OS の環境には**`/etc/dhcpcd.conf`** がありませんでした。

調べてみると一定の OS バージョン（**bookworm**）にて仕様が変更されたようです。そのため `nmcli`コマンドを使って編集するらしい。

まずはじめに現在接続しているプロファイルを確認します。

```bash
$ sudo nmcli connection show
NAME                UUID                                  TYPE      DEVICE
1234567890XXXXX     7f78b108-a85e-4980-b751-afd830a48b2a  wifi      wlan0
```

上記のプロファイル名を指定して、IP アドレスを固定します。

```bash
$ sudo nmcli connection modify '1234567890XXXXX' ipv4.method manual ipv4.addresses 192.168.3.20/24 ipv4.gateway 192.168.3.1 ipv4.dns 192.168.3.1
```

設定ができていれば以下のコマンドで確認できます。

```bash
$ nmcli connection show '1234567890XXXXX'
```

ネットワークを再起動して設定を反映させます。SSH で接続している場合は接続が切れます。

```bash
$ sudo nmcli connection reload
$ sudo nmcli connection up '1234567890XXXXX'
```

ホスト PC から変更した IP アドレスに SSH で接続できることを確認します。

```bash
$ ssh pi@192.168.3.20
```

## 6.2 xrdp のインストール

```bash
sudo apt install xrdp
```

## 6.3 Remmina のインストール

```bash
sudo apt install remmina
```

## 6.4 Remmina を使った RDP 接続

Remmina を立ち上げ、左上の「新規作成」アイコンをクリックします。

![Screenshot from 2024-06-12 21-36-37.png](/posts/02_raspberryPi_setup/Screenshot_from_2024-06-12_21-36-37.png)

Rasuberry Pi の IP アドレス、ユーザー名、パスワードを入力し、保存して接続をクリック

![Screenshot from 2024-06-12 21-42-55.png](/posts/02_raspberryPi_setup/Screenshot_from_2024-06-12_21-42-55.png)

無事接続できました！

# 参考文献

[https://okamoto3.com/index.php/2023/11/16/bookworm-static-ip/3295/](https://okamoto3.com/index.php/2023/11/16/bookworm-static-ip/3295/)

[https://geek.tacoskingdom.com/blog/35](https://geek.tacoskingdom.com/blog/35)
