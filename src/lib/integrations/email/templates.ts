// Email HTML Templates for Labs Stdio (Responsive, Sleek Dark & Clean Minimalist)

export function renderClientInquiryConfirmationEmail(data: {
  fullName: string;
  productName: string;
  selectedFeatures: string[];
  sprintSpeed: string;
  estimatedWeeks: number;
  estimatedCost: number;
}): string {
  const featuresList = data.selectedFeatures.length > 0
    ? data.selectedFeatures.map((f) => `<li style="margin-bottom: 6px; color: #475467;">• ${f}</li>`).join("")
    : '<li style="color: #98a2b3;">Standard System Discovery</li>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Brief & Estimate Received - Labs Stdio</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0e12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #101828;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0c0e12; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          <!-- Header -->
          <tr>
            <td style="background-color: #07080b; padding: 32px; border-bottom: 2px solid #a6f30d;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                      LABS<span style="color: #a6f30d;">.</span>STDIO
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background: rgba(166, 243, 13, 0.15); border: 1px solid rgba(166, 243, 13, 0.4); border-radius: 999px; font-size: 11px; font-weight: 700; color: #a6f30d; text-transform: uppercase;">
                      Proposal Received
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #101828; letter-spacing: -0.3px;">
                Halo, ${data.fullName} 👋
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475467;">
                Terima kasih telah mengajukan brief proyek melalui Scope Estimator Labs Stdio. Kami telah mengkalkulasi spesifikasi dan timeline awal untuk <strong>${data.productName}</strong>.
              </p>

              <!-- Estimate Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border: 1px solid #eaecf0; border-radius: 12px; margin-bottom: 24px; padding: 20px;">
                <tr>
                  <td width="50%" style="padding: 10px; border-right: 1px solid #eaecf0;">
                    <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #667085; margin-bottom: 4px;">Estimasi Anggaran</div>
                    <div style="font-size: 26px; font-weight: 800; color: #101828;">$${data.estimatedCost.toLocaleString()}</div>
                    <div style="font-size: 11px; color: #027a48; font-weight: 600; margin-top: 2px;">Fixed Scope Basis</div>
                  </td>
                  <td width="50%" style="padding: 10px; padding-left: 20px;">
                    <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #667085; margin-bottom: 4px;">Estimasi Pengerjaan</div>
                    <div style="font-size: 26px; font-weight: 800; color: #101828;">${data.estimatedWeeks} Minggu</div>
                    <div style="font-size: 11px; color: #667085; font-weight: 600; margin-top: 2px;">Sprint: ${data.sprintSpeed}</div>
                  </td>
                </tr>
              </table>

              <!-- Scope Items -->
              <h2 style="font-size: 14px; font-weight: 700; color: #101828; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Fitur & Modul Terpilih
              </h2>
              <ul style="margin: 0 0 28px 0; padding-left: 18px; font-size: 13px; line-height: 1.6;">
                ${featuresList}
              </ul>

              <!-- Next Steps Box -->
              <div style="background: #f4fbf1; border: 1px solid #cbf0b9; border-radius: 12px; padding: 18px; margin-bottom: 28px;">
                <h3 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #1a4d10;">
                  🚀 Tahap Selanjutnya
                </h3>
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #2e6620;">
                  Lead Architect kami sedang meninjau kelayakan teknis brief Anda. Kami akan menghubungi Anda dalam waktu 1x24 jam untuk menjadwalkan Discovery Call (Google Meet).
                </p>
              </div>

              <!-- CTA Button -->
              <table width="100%">
                <tr>
                  <td align="center">
                    <a href="https://labsstdio.com" style="display: inline-block; background-color: #07080b; color: #a6f30d; text-decoration: none; font-size: 13px; font-weight: 700; padding: 14px 28px; border-radius: 999px; letter-spacing: 0.3px;">
                      Kunjungi Labs Stdio Website
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 32px; border-top: 1px solid #eaecf0; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #667085; font-weight: 600;">
                Labs Stdio • High-Performance Digital Product Studio
              </p>
              <p style="margin: 0; font-size: 11px; color: #98a2b3;">
                Jakarta & Global Remote • hello@labsstdio.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function renderAdminLeadAlertEmail(data: {
  fullName: string;
  email: string;
  company?: string | null;
  productName: string;
  estimatedCost: number;
  estimatedWeeks: number;
  projectDetails?: string | null;
  selectedFeatures: string[];
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; background: #07080b; color: #ffffff; padding: 30px;">
  <div style="max-width: 560px; margin: 0 auto; background: #111318; border: 1px solid #222630; border-radius: 14px; padding: 28px;">
    <div style="color: #a6f30d; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-bottom: 8px;">
      🚨 INCOMING LEAD ALERT
    </div>
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">
      Brief Baru Masuk: ${data.productName}
    </h2>
    <table width="100%" style="font-size: 13px; border-collapse: collapse; margin-bottom: 20px;">
      <tr><td style="padding: 8px 0; color: #8892a0;">Nama Klien:</td><td style="font-weight: 600; color: #fff;">${data.fullName}</td></tr>
      <tr><td style="padding: 8px 0; color: #8892a0;">Email:</td><td style="font-weight: 600; color: #a6f30d;">${data.email}</td></tr>
      <tr><td style="padding: 8px 0; color: #8892a0;">Perusahaan:</td><td style="font-weight: 600; color: #fff;">${data.company || "Direct Personal"}</td></tr>
      <tr><td style="padding: 8px 0; color: #8892a0;">Estimasi Budget:</td><td style="font-weight: 700; color: #a6f30d; font-size: 16px;">$${data.estimatedCost.toLocaleString()}</td></tr>
      <tr><td style="padding: 8px 0; color: #8892a0;">Target Waktu:</td><td style="font-weight: 600; color: #fff;">${data.estimatedWeeks} Minggu</td></tr>
    </table>
    <div style="background: #191c24; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 13px; color: #cbd5e1;">
      <strong>Catatan Proyek:</strong><br>${data.projectDetails || "Tidak ada rincian tambahan."}
    </div>
    <a href="http://localhost:3000/admin" style="display: inline-block; background: #a6f30d; color: #000; font-weight: 700; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-size: 13px;">
      Buka di Admin CRM Leads &rarr;
    </a>
  </div>
</body>
</html>
  `.trim();
}
