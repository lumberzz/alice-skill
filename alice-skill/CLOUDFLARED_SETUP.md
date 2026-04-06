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

```bash
cd /home/lumber/.openclaw/workspace/alice-skill
PORT=3000 ./scripts/cloudflared-tunnel.sh
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

## Note
cloudflared is currently not installed in this environment, so these scripts are prepared but the tunnel itself still requires binary installation on the host.
