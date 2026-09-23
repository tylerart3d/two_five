# Tailscale review access

For a link that does not require MagicDNS or browser DNS configuration, also run `tailscale serve --bg --tcp=80 tcp://127.0.0.1:5173` and share `http://` followed by the address printed by `tailscale ip -4`. TCP forwarding accepts the IP host header; Serve's HTTP proxy expects its DNS hostname. Keep the `http://` prefix in the shared link. This endpoint is tailnet-only; traffic between devices is encrypted by Tailscale, although the browser may label the HTTP page "Not secure." No browser security override is required in the tested default configurations. The PDF viewer uses a JavaScript SHA-256 implementation when Web Crypto is unavailable, retaining the PDF version check.

Disable the direct-IP endpoint with `tailscale serve --tcp=80 off`.

Tailscale Serve shares the local development site with authorized tailnet members over HTTPS. It includes the application's explicitly allowed PDF and photo routes. It is a live development preview, not an Internet deployment.

Before starting Vite, set `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` to this machine's exact Tailscale DNS name (from `tailscale status --json`, `Self.DNSName`, without its trailing period). Then run `npm run dev -- --port 5173 --strictPort` from the application repository.

In another terminal, run `tailscale serve --bg http://127.0.0.1:5173`. The first use may require enabling Serve through the account link printed by Tailscale. `tailscale serve status` prints the HTTPS address to share.

The workstation must remain awake and Vite must remain running. Serve persists in the background, but does not start Vite after a reboot. Local research and media remain on the workstation; this does not upload them to Git. Vite remains bound to loopback, with only the exact machine hostname added to its allowed hosts.

Disable sharing with `tailscale serve --https=443 off`. This leaves the local site running.

Reference: https://tailscale.com/docs/reference/tailscale-cli/serve
