import { z } from "zod";

const PHONE_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(80, "Имя слишком длинное"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Укажите телефон в формате +7 (XXX) XXX-XX-XX"),
  service: z.string().trim().max(120).optional(),
  date: z.string().trim().max(80).optional(),
  comment: z.string().trim().max(2000).optional(),
});

export function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function isHoneypotFilled(body: Record<string, unknown>) {
  return ["confirm_email", "honeypot"].some((key) => {
    const value = body[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "Некорректный JSON в теле запроса" },
      { status: 400 },
    );
  }

  const body = asRecord(payload);

  if (isHoneypotFilled(body)) {
    return Response.json({ success: true }, { status: 200 });
  }

  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message || "Некорректные данные заявки" },
      { status: 400 },
    );
  }

  const { name, phone, service, date, comment } = parsed.data;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error(
      "Не заданы переменные окружения TELEGRAM_BOT_TOKEN и/или TELEGRAM_CHAT_ID",
    );
    return Response.json(
      { error: "Отправка заявки не настроена" },
      { status: 500 },
    );
  }

  const text = [
    "<b>🚗 Новая заявка с сайта</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Услуга:</b> ${escapeHtml(service || "") || "Не указана"}`,
    `<b>Дата записи:</b> ${escapeHtml(date || "") || "Не указана"}`,
    `<b>Комментарий:</b> ${escapeHtml(comment || "") || "Нет"}`,
  ].join("\n");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        `Telegram sendMessage ответил ${response.status}:`,
        await response.text(),
      );
      return Response.json(
        { error: "Не удалось отправить заявку" },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Ошибка запроса к Telegram API:", error);
    return Response.json(
      { error: "Не удалось отправить заявку" },
      { status: 502 },
    );
  }

  return Response.json({ success: true }, { status: 200 });
}
