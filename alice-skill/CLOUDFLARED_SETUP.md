# Cloudflared local webhook setup

## Goal
Expose the local `alice-skill` server to the public internet for real Alice testing without a permanent server.

## Prerequisites
- working local `alice-skill`
- `cloudflared` installed

## Local app

```bash
cd /home/lumber/.openclaw/workspace/alice-skill
npm run dev
```

Health check:

```bash
curl http://127.0.0.1:3000/health
```

## Start tunnel

Default behavior of the helper script is now proxy-aware:
- it prefers `http2`
- it disables `HTTP_PROXY` / `HTTPS_PROXY` env vars for the tunnel process unless told otherwise

```bash
cd /home/lumber/.openclaw/workspace/alice-skill
PORT=3000 ./scripts/cloudflared-tunnel.sh
```

If you explicitly want to try through the current proxy environment:

```bash
cd /home/lumber/.openclaw/workspace/alice-skill
CLOUDFLARED_DISABLE_PROXY=0 CLOUDFLARED_PROTOCOL=http2 PORT=3000 ./scripts/cloudflared-tunnel.sh
```

Or combined app+tunnel run:

```bash
cd /home/lumber/.openclaw/workspace/alice-skill
PORT=3000 ./scripts/run-local-with-cloudflared.sh
```

## Webhook URL
When cloudflared prints a public URL like:

```text
https://random-name.trycloudflare.com
```

set this in Yandex Dialogs backend settings:

```text
https://random-name.trycloudflare.com/alice/webhook
```

## Suggested test flow
1. Start local app
2. Start cloudflared tunnel
3. Verify `/health` locally and publicly
4. Put the public webhook URL into Yandex Dialogs
5. Test in the Dialogs console
6. Then test from a real Alice station

## Diagnostics note
In the current environment, the local app starts correctly, but recent tunnel attempts showed network-level issues:
- ngrok fails when proxy env is active because proxy support is a paid feature there
- cloudflared can obtain a quick tunnel URL but fails to complete edge connectivity in the current network path

See `TUNNEL_DIAGNOSTICS.md` for the latest concrete error signatures and interpretation.
