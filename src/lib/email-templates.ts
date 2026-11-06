/**
 * Clean, modern email template builder following the SlotSwap Routine Sheet design system.
 * Palette: Paper (#F4F6F3), Ink (#16231F), Pine (#1D5B4A), Mint (#C2E4CE), Border (#E2E6E2).
 */

interface BaseEmailOptions {
  preheader?: string;
  badge?: {
    text: string;
    bg?: string;
    color?: string;
  };
  title: string;
  recipientName: string;
  introText: string;
  highlightBox?: {
    label: string;
    value: string;
    details?: string;
  };
  cta: {
    label: string;
    url: string;
  };
  footerNote?: string;
}

export function buildRoutineEmailTemplate({
  preheader,
  badge,
  title,
  recipientName,
  introText,
  highlightBox,
  cta,
  footerNote,
}: BaseEmailOptions): string {
  const badgeHtml = badge
    ? `
      <tr>
        <td style="padding-bottom: 16px;">
          <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 4px; background-color: ${badge.bg || '#C2E4CE'}; color: ${badge.color || '#1D5B4A'}; letter-spacing: 0.02em;">
            ${badge.text}
          </span>
        </td>
      </tr>
    `
    : "";

  const highlightHtml = highlightBox
    ? `
      <tr>
        <td style="padding: 20px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4F6F3; border: 1px solid #16231F15; border-radius: 8px; padding: 16px;">
            <tr>
              <td>
                <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #16231F99;">
                  ${highlightBox.label}
                </p>
                <p style="margin: 0; font-size: 15px; font-weight: 700; color: #16231F; font-family: monospace;">
                  ${highlightBox.value}
                </p>
                ${
                  highlightBox.details
                    ? `<p style="margin: 6px 0 0; font-size: 12px; color: #16231Faa;">${highlightBox.details}</p>`
                    : ""
                }
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${preheader ? `<span style="display:none;font-size:1px;color:#fff;max-height:0">${preheader}</span>` : ""}
  <style>
    body { margin: 0; padding: 0; background-color: #F4F6F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; }
    a { color: #1D5B4A; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #F4F6F3; color: #16231F;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px; margin: 0 auto;">
    <!-- Brand Header -->
    <tr>
      <td style="padding: 0 0 24px; text-align: left;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right: 10px; vertical-align: middle;">
              <div style="width: 24px; height: 24px; border-radius: 4px; background-color: #ffffff; border: 1px solid #16231F25; padding: 2px;">
                <table role="presentation" width="100%" height="100%" cellpadding="0" cellspacing="1">
                  <tr>
                    <td style="background-color: #1D5B4A; border-radius: 1px;"></td>
                    <td style="background-color: #F5E39B; border-radius: 1px;"></td>
                  </tr>
                  <tr>
                    <td style="background-color: #BCD7F2; border-radius: 1px;"></td>
                    <td style="background-color: #C2E4CE; border-radius: 1px;"></td>
                  </tr>
                </table>
              </div>
            </td>
            <td style="vertical-align: middle;">
              <span style="font-size: 18px; font-weight: 800; color: #16231F; letter-spacing: -0.02em;">
                Slot<span style="color: #1D5B4A;">Swap</span>
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Card Content -->
    <tr>
      <td style="background-color: #ffffff; border: 1px solid #16231F20; border-radius: 12px; padding: 32px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${badgeHtml}

          <!-- Heading -->
          <tr>
            <td style="padding-bottom: 12px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #16231F; letter-spacing: -0.015em; line-height: 1.25;">
                ${title}
              </h1>
            </td>
          </tr>

          <!-- Greeting & Intro -->
          <tr>
            <td style="padding-bottom: 16px; font-size: 14px; line-height: 1.6; color: #16231Fcc;">
              <p style="margin: 0 0 12px;">Hello ${recipientName},</p>
              <p style="margin: 0;">${introText}</p>
            </td>
          </tr>

          ${highlightHtml}

          <!-- Call to Action Button -->
          <tr>
            <td style="padding: 12px 0 24px; text-align: left;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #1D5B4A;">
                    <a href="${cta.url}" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 13px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                      ${cta.label}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback Plain Link -->
          <tr>
            <td style="padding-top: 16px; border-top: 1px solid #16231F15; font-size: 11px; line-height: 1.5; color: #16231F80;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${cta.url}" target="_blank" style="color: #1D5B4A; word-break: break-all;">
                ${cta.url}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 24px 0 0; text-align: center; font-size: 11px; color: #16231F70; line-height: 1.6;">
        ${footerNote ? `<p style="margin: 0 0 6px;">${footerNote}</p>` : ""}
        <p style="margin: 0;">
          SlotSwap · Automated Multi-Way University Section Swapping
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
