import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Lazily created so the build doesn't crash when the key isn't set
let resendClient: Resend | null = null;
function getResend() {
  if (!resendClient) resendClient = new Resend(RESEND_API_KEY);
  return resendClient;
}
// RESEND_API_KEY=re_ваш_ключ
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "BeSmile <noreply@besmile.az>";
const RESEND_TO_EMAIL =
  process.env.RESEND_TO_EMAIL || "besmile.reception@gmail.com";

interface BookingRequest {
  name: string;
  phone: string;
  date: string;
  time: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: BookingRequest = await req.json();

    if (!body.name || !body.phone || !body.date || !body.time) {
      console.error("[v0] Missing required fields:", {
        name: !!body.name,
        phone: !!body.phone,
        date: !!body.date,
        time: !!body.time,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("[v0] Booking request received:", {
      name: body.name,
      phone: body.phone,
      date: body.date,
      time: body.time,
    });

    if (!RESEND_API_KEY) {
      console.warn(
        "[v0] API_KEY not configured. Booking logged but not sent to email service."
      );
      return NextResponse.json(
        {
          success: true,
          id: `booking-${Date.now()}`,
          message:
            "Booking received (email service not configured in development)",
        },
        { status: 200 }
      );
    }

    console.log("[v0] Sending booking email via Resend API...");
    const { data, error } = await getResend().emails.send({
      from: RESEND_FROM_EMAIL,
      to: RESEND_TO_EMAIL,
      subject: `✨ Новая запись — ${body.name} на ${formatDateRu(body.date)}`,
      html: buildBookingEmailHtml(body),
    });

    if (error) {
      console.error("[v0] Resend error:", error);

      return NextResponse.json(
        {
          error: "Failed to send email",
          details: error,
        },
        { status: 500 }
      );
    }

    console.log("[v0] Email sent:", data?.id);
    console.log("[v0] Email sent successfully via Resend:", data.id);

    return NextResponse.json({ success: true, id: data.id }, { status: 200 });
  } catch (error) {
    console.error("[v0] Error in send-booking route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

function formatDateRu(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function buildBookingEmailHtml(body: BookingRequest): string {
  const name = escapeHtml(body.name);
  const phone = escapeHtml(body.phone);
  const date = escapeHtml(formatDateRu(body.date));
  const time = escapeHtml(body.time);
  const message = escapeHtml(body.message || "");
  const phoneHref = body.phone.replace(/[^\d+]/g, "");

return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Новая запись — BeSmile</title>
</head>
<body style="margin:0; padding:0; background-color:#0a0a0a; font-family:Arial, Helvetica, sans-serif; -webkit-font-smoothing:antialiased;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; background-color:#0a0a0a; margin:0; padding:32px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; width:100%; background-color:#111111; border:1px solid #2a2a2a; border-radius:24px; overflow:hidden;">

          <!-- Top line -->
          <tr>
            <td style="padding:0; height:4px; background-color:#f2f2f2; font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 24px 40px; text-align:center; background-color:#111111;">
              <div style="font-size:11px; line-height:18px; letter-spacing:3px; text-transform:uppercase; color:#8f8f8f; margin-bottom:14px;">
                BeSmile Dental Clinic
              </div>
              <div style="font-size:30px; line-height:38px; font-weight:700; color:#ffffff; margin-bottom:12px;">
                Новая запись
              </div>
              <div style="width:56px; height:1px; background-color:#3a3a3a; margin:0 auto 18px auto;"></div>
              <p style="margin:0; font-size:15px; line-height:24px; color:#cfcfcf; max-width:420px; margin-left:auto; margin-right:auto;">
                С сайта поступила новая заявка на прием. Ниже указаны данные клиента и детали записи.
              </p>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="padding:0 24px 24px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; background-color:#161616; border:1px solid #2d2d2d; border-radius:20px;">

                <!-- Name -->
                <tr>
                  <td style="padding:24px 28px; border-bottom:1px solid #2a2a2a;">
                    <div style="font-size:11px; line-height:16px; text-transform:uppercase; letter-spacing:2px; color:#8c8c8c; margin-bottom:8px;">
                      Имя клиента
                    </div>
                    <div style="font-size:22px; line-height:30px; font-weight:700; color:#ffffff;">
                      ${name}
                    </div>
                  </td>
                </tr>

                <!-- Phone -->
                <tr>
                  <td style="padding:24px 28px; border-bottom:1px solid #2a2a2a;">
                    <div style="font-size:11px; line-height:16px; text-transform:uppercase; letter-spacing:2px; color:#8c8c8c; margin-bottom:8px;">
                      Телефон
                    </div>
                    <div style="font-size:20px; line-height:28px; font-weight:600;">
                      <a href="tel:${phoneHref}" style="color:#ffffff; text-decoration:none;">
                        ${phone}
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Date / Time -->
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                      <tr>
                        <td width="50%" style="padding:24px 28px; border-bottom:${message ? "1px solid #2a2a2a" : "0"}; border-right:1px solid #2a2a2a; vertical-align:top;">
                          <div style="font-size:11px; line-height:16px; text-transform:uppercase; letter-spacing:2px; color:#8c8c8c; margin-bottom:8px;">
                            Дата
                          </div>
                          <div style="font-size:18px; line-height:26px; font-weight:600; color:#ffffff;">
                            ${date}
                          </div>
                        </td>
                        <td width="50%" style="padding:24px 28px; border-bottom:${message ? "1px solid #2a2a2a" : "0"}; vertical-align:top;">
                          <div style="font-size:11px; line-height:16px; text-transform:uppercase; letter-spacing:2px; color:#8c8c8c; margin-bottom:8px;">
                            Время
                          </div>
                          <div style="font-size:18px; line-height:26px; font-weight:600; color:#ffffff;">
                            ${time}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${message ? `
                <!-- Message -->
                <tr>
                  <td style="padding:24px 28px;">
                    <div style="font-size:11px; line-height:16px; text-transform:uppercase; letter-spacing:2px; color:#8c8c8c; margin-bottom:10px;">
                      Сообщение
                    </div>
                    <div style="font-size:15px; line-height:25px; color:#d6d6d6;">
                      ${message}
                    </div>
                  </td>
                </tr>
                ` : ""}

              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:8px 24px 32px 24px;">
              <a
                href="tel:${phoneHref}"
                style="display:inline-block; background-color:#f5f5f5; color:#111111; text-decoration:none; font-size:14px; line-height:14px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:16px 30px; border-radius:999px;"
              >
                Позвонить клиенту
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 36px 40px; border-top:1px solid #232323; text-align:center; background-color:#101010;">
              <div style="font-size:12px; line-height:20px; color:#7a7a7a;">
                Автоматическое уведомление с сайта BeSmile.az
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}