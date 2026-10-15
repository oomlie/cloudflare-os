// The pages every MCP gatekeeper serves in a browser tab during connect: "you can close this
// window", "that link expired", and "it didn't work, here's why".
//
// Anything a gatekeeper asks the user is *not* here. Only `gatekeeper-mcp` has a question to ask (see
// its `connect-form.ts`); the gateway's endpoint is a deployment setting, so it has no form and would
// carry the form's markup and CSS for nothing.

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}

export function htmlResponse(body: string, status = 200): Response {
  return new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

/**
 * The palette and page frame every connect page shares.
 *
 * These pages open in their own browser tab, outside the Workshop, so they cannot reach Tailwind or
 * Kumo. The tokens are copied from `workshop-frontend/src/styles.css` (both palettes) so the tab
 * still reads as the same product. Only the base palette is copied: a deployment's admin-chosen
 * accent lives in the Workshop's AdminConfig, which a gatekeeper has no business reading.
 *
 * Form controls are absent, since a gatekeeper with a form appends its own rules, which is why the
 * tokens are CSS variables rather than literals.
 */
export const PAGE_STYLE = `
  :root {
    color-scheme: light dark;
    --font: "FT Kunst Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", sans-serif;
    /* Catppuccin Latte */
    --base: #eff1f5;
    --control: #eff1f5;
    --line: #ccd0da;
    --text: #4c4f69;
    --strong: #3d3f57;
    --subtle: #6c6f85;
    --brand: #8839ef;
    --danger: #d20f39;
    /* Kumo's primary button is "contrast": text-colored in light mode, the accent in dark. */
    --contrast: #4c4f69;
    --on-contrast: #eff1f5;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      /* Catppuccin Mocha */
      --base: #1e1e2e;
      --control: #181825;
      --line: #45475a;
      --text: #cdd6f4;
      --strong: #cdd6f4;
      --subtle: #a6adc8;
      --brand: #cba6f7;
      --danger: #f38ba8;
      --contrast: #cba6f7;
      --on-contrast: #11111b;
    }
  }

  body { font: 15px/1.5 var(--font); margin: 0; padding: 48px 20px; display: flex;
         justify-content: center; background: var(--base); color: var(--text);
         -webkit-font-smoothing: antialiased; }
  main { width: 100%; max-width: 420px; }
  h1 { font-size: 17px; font-weight: 600; color: var(--strong); margin: 0 0 6px;
       letter-spacing: -0.01em; }
  p.sub { margin: 0 0 24px; color: var(--subtle); font-size: 14px; }
  p.err { color: var(--danger); font-size: 13px; margin: 0 0 16px; }
`;

export const SELF_CLOSING_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Connected</title></head>
<body><p>Connected. You can close this window.</p><script>window.close();</script></body></html>`;

export const INVALID_LINK_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Link expired</title><style>${PAGE_STYLE}</style></head>
<body><main><h1>This link has expired</h1>
<p class="sub">Start the connection again.</p></main></body></html>`;

/** A minimal page reporting that connecting failed, with a reason the user can act on. */
export function errorPageHtml(title: string, detail: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title><style>${PAGE_STYLE}</style></head>
<body><main><h1>${escapeHtml(title)}</h1>
<p class="sub">${escapeHtml(detail)}</p></main></body></html>`;
}
