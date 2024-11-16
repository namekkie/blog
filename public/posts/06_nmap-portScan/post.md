---
title: "nmapを使ったポートスキャンをやってみる"
createdAt: "2024-07-24"
category:
  - "hacking"
---

# 環境

◆ ターゲット

IP アドレス：192.168.3.20

OS：Raspbariy Pi OS

◆ 攻撃者

IP アドレス：192.168.3.7

OS：Ubuntu

# ポートスキャンの種類と仕組み

## TCP スキャン

ターゲット側の 8000 番ポートで HTTP サーバーを起動する。

```bash
$ python3 -m http.server
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

攻撃側から 8000 番ポートに TCP スキャンを行う。

```bash
$ nmap 192.168.3.20 -p 8000 -sT
```

ターゲットの HTTP サーバーのログに`192.168.3.7`から接続要求が行われたログが記録される。

```bash
----------------------------------------
Exception occurred during processing of request from ('192.168.3.7', 34536)
Traceback (most recent call last):
  File "/usr/lib/python3.11/socketserver.py", line 691, in process_request_thread
    self.finish_request(request, client_address)
  File "/usr/lib/python3.11/http/server.py", line 1306, in finish_request
    self.RequestHandlerClass(request, client_address, self,
  File "/usr/lib/python3.11/http/server.py", line 667, in __init__
    super().__init__(*args, **kwargs)
  File "/usr/lib/python3.11/socketserver.py", line 755, in __init__
    self.handle()
  File "/usr/lib/python3.11/http/server.py", line 432, in handle
    self.handle_one_request()
  File "/usr/lib/python3.11/http/server.py", line 400, in handle_one_request
    self.raw_requestline = self.rfile.readline(65537)
                           ^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3.11/socket.py", line 706, in readinto
    return self._sock.recv_into(b)
           ^^^^^^^^^^^^^^^^^^^^^^^
ConnectionResetError: [Errno 104] Connection reset by peer
----------------------------------------
```

またパケットキャプチャからも３ウェイハンドシェイクによって TCP コネクションが確立されたことがわかる。

![Untitled](/posts/06_nmap-portScan/Untitled.png)

ちなみに`8001`などオープンしていないポートに対して TCP スキャンを行うと。ターゲットが`RST`を返してくる。nmap は`RST` が返ってくるとポートが閉じていると判断する。

![Untitled](/posts/06_nmap-portScan/Untitled%201.png)

また、ポートの指定なしで TCP スキャンを行うと、ターゲットの journald に`192.168.3.7`から接続要求があったログがが記録された。

```bash
$ nmap 192.168.3.20 -sT
```

```bash
$ journalctl -f

Jul 24 22:53:31 raspberrypi xrdp[803]: [INFO ] Socket 12: AF_INET6 connection received from ::ffff:192.168.3.7 port 50970
Jul 24 22:53:31 raspberrypi xrdp[2703]: [INFO ] Using default X.509 certificate: /etc/xrdp/cert.pem
Jul 24 22:53:31 raspberrypi xrdp[2703]: [INFO ] Using default X.509 key file: /etc/xrdp/key.pem
Jul 24 22:53:31 raspberrypi xrdp[2703]: [ERROR] Cannot read private key file /etc/xrdp/key.pem: Permission denied
Jul 24 22:53:31 raspberrypi xrdp[2703]: [ERROR] libxrdp_force_read: header read error
Jul 24 22:53:31 raspberrypi xrdp[2703]: [ERROR] [ITU-T X.224] Connection Sequence: CR-TPDU (Connection Request) failed
Jul 24 22:53:31 raspberrypi xrdp[2703]: [ERROR] xrdp_sec_incoming: xrdp_iso_incoming failed
Jul 24 22:53:31 raspberrypi xrdp[2703]: [ERROR] xrdp_rdp_incoming: xrdp_sec_incoming failed
Jul 24 22:53:31 raspberrypi xrdp[2703]: [ERROR] xrdp_process_main_loop: libxrdp_process_incoming failed
Jul 24 22:53:31 raspberrypi xrdp[2703]: [ERROR] xrdp_iso_send: trans_write_copy_s failed
Jul 24 22:53:31 raspberrypi xrdp[2703]: [ERROR] Sending [ITU T.125] DisconnectProviderUltimatum failed

```

## SYN スキャン

同様にターゲット側の 8000 番ポートで HTTP サーバーを起動する。

```bash
$ python3 -m http.server
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

攻撃側から 8000 番ポートに SYN スキャンを行う。

```bash
$ nmap 192.168.3.20 -p 8000 -sS
```

ターゲットの HTTP サーバーのログには何も記録されない。

パケットキャプチャを見てみると、`8000` に`192.168.3.7`から接続要求が来ていることがわかる。

ただし、TCP スキャンと異なるのはターゲットからの`SYN` に対して`RST` を返すことで接続処理を強制的に終了させている。

![Untitled](/posts/06_nmap-portScan/Untitled%202.png)

もちろんポートの指定なしで SYN スキャンを行っても、ターゲットの journald にはログが残っていなかった。

ちなみに`8001`などオープンしていないポートに対して TCP スキャンを行うと。ターゲットが`RST`を返してくる。nmap は`RST` が返ってくるとポートが閉じていると判断する。ここは TCP スキャンと違いはなかった。

## UDP スキャン

ターゲット側の 8000 番ポートで UDP を待ち受けます。

```bash
$ nc -ulvp 8000
```

攻撃側から 8000 番ポートに UDP スキャンを行う。

```bash
$ nmap 192.168.3.20 -p 8000 -sU
```

UDP はコネクションレスのプロトコルで一方通行であるため、ポートがアクティブ状態であれば何の応答も返ってこない。逆に非アクティブ状態であれば ICMP パケットを返答する。

![Untitled](/posts/06_nmap-portScan/Untitled%203.png)
