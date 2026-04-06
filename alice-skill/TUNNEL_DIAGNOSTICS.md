# Tunnel Diagnostics

## Current result
Local `alice-skill` starts correctly and answers on:
- `http://127.0.0.1:3000/health`

## Tunnel attempts performed

### ngrok with current proxy environment
Observed environment:
- `HTTP_PROXY=http://127.0.0.1:10809/`
- `HTTPS_PROXY=http://127.0.0.1:10809/`

Result:
- ngrok fails immediately
- error indicates HTTP/S proxy support is a paid feature

Representative error:
- `authentication failed: Running the agent with an http/s proxy is a paid feature`
- `ERR_NGROK_9009`

### cloudflared with current proxy environment
Result:
- quick tunnel URL is allocated
- connection to Cloudflare edge fails on QUIC path

Representative error:
- `failed to dial to edge with quic: timeout: no recent network activity`

### cloudflared without proxy env and forced HTTP/2
Command style used:
- run with `env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy ...`
- force `--protocol http2`

Result:
- quick tunnel URL is allocated
- edge connection still fails

Representative error:
- `TLS handshake with edge error: EOF`

## Interpretation
The local app is healthy.
The failure is not in the Alice service itself.
The failure is in the current network environment:
- proxy/VPN interaction
- and/or Cloudflare edge connectivity policy on the active route

## Best current path
1. Keep local + cloudflared as the preferred first choice in principle.
2. But in the current network environment, treat tunnel connectivity as blocked/unreliable.
3. Be ready to switch to a hosted demo path if tunnel networking cannot be changed.

## Hosted fallback kept in reserve
If tunnel networking remains blocked, the next fallback should be:
- Render-hosted demo deployment
- with stateless config
- using `mock-rpc` rather than local persistent OpenClaw transport

That path requires a Render account connected to a Git repository.
