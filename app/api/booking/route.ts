import { z } from "zod";

import { SITE_CONFIG } from "@/lib/constants";

const PHONE_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(80, "Имя слишком длинное")
    .optional(),
  userName: z.string().trim().max(80).optional(),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Укажите телефон в формате +7 (XXX) XXX-XX-XX"),
  car: z.string().trim().max(120).optional(),
  service: z.string().trim().max(120).optional(),
  date: z.string().trim().max(80).optional(),
  comment: z.string().trim().max(2000).optional(),
  username: z.string().trim().max(64).optional(),
});

type TelegramInlineKeyboard = {
  inline_keyboard: Array<
    Array<{ text: string; url?: string; callback_data?: string }>
  >;
};

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

function fallback(value: string | undefined, placeholder: string) {
  const trimmed = value?.trim();
  return trimmed ? escapeHtml(trimmed) : placeholder;
}

function createOrderId() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function normalizeChatId(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return String(Math.trunc(value));
  }

  if (typeof value === "string" && /^\d{5,20}$/.test(value.trim())) {
    return value.trim();
  }

  return undefined;
}

function clientTicketText(input: {
  orderId: string;
  car?: string;
  service?: string;
  date?: string;
  phone: string;
}) {
  return [
    `🔷 <b>Заявка №${escapeHtml(input.orderId)} успешно принята!</b>`,
    "",
    `🚙 <b>Автомобиль:</b> ${fallback(input.car, "Не указан")}`,
    `🔧 <b>Услуга:</b> ${fallback(input.service, "Не указана")}`,
    `📅 <b>Желаемое время:</b> ${fallback(input.date, "Не указано")}`,
    `📲 <b>Контактный номер:</b> ${escapeHtml(input.phone)}`,
    "",
    "⏱ Мастер свяжется с вами в течение <b>10–15 минут</b> для подтверждения записи.",
    "",
    "📍 <i>Ростов-на-Дону, Экотек Сервис</i>",
  ].join("\n");
}

function adminTicketText(input: {
  orderId: string;
  name: string;
  username?: string;
  car?: string;
  service?: string;
  date?: string;
  phone: string;
  comment?: string;
}) {
  const telegram = input.username
    ? input.username.startsWith("@")
      ? input.username
      : `@${input.username}`
    : "Не указан";

  return [
    `🔷 <b>Новая заявка №${escapeHtml(input.orderId)}</b>`,
    "",
    `👤 <b>Клиент:</b> ${escapeHtml(input.name)}`,
    `💬 <b>Telegram:</b> ${escapeHtml(telegram)}`,
    `🚙 <b>Автомобиль:</b> ${fallback(input.car, "Не указан")}`,
    `🔧 <b>Услуга:</b> ${fallback(input.service, "Не указана")}`,
    `📅 <b>Желаемое время:</b> ${fallback(input.date, "Не указано")}`,
    `📲 <b>Контактный номер:</b> ${escapeHtml(input.phone)}`,
    `📝 <b>Комментарий:</b> ${fallback(input.comment, "Нет")}`,
    "",
    "📍 <i>Ростов-на-Дону, Экотек Сервис</i>",
  ].join("\n");
}

function ticketKeyboard(orderId: string): TelegramInlineKeyboard {
  return {
    inline_keyboard: [
      [
        {
          text: "🗺 Маршрут на картах",
          url: SITE_CONFIG.mapsUrl,
        },
      ],
      [
        {
          text: "💬 Написать в сервис",
          callback_data: `contact_master_${orderId}`,
        },
      ],
    ],
  };
}

async function sendTelegramMessage(input: {
  botToken: string;
  chatId: string;
  text: string;
  replyMarkup?: TelegramInlineKeyboard;
}) {
  const response = await fetch(
    `https://api.telegram.org/bot${input.botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: input.chatId,
        text: input.text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: input.replyMarkup,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Telegram sendMessage ${response.status}: ${details}`);
  }
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
    return Response.json({ success: true, orderId: createOrderId() }, { status: 200 });
  }

  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message || "Некорректные данные заявки" },
      { status: 400 },
    );
  }

  const {
    name,
    userName,
    phone,
    car,
    service,
    date,
    comment,
    username,
  } = parsed.data;
  const clientName = (userName || name || "").trim();

  if (clientName.length < 2) {
    return Response.json(
      { error: "Имя должно содержать минимум 2 символа" },
      { status: 400 },
    );
  }

  const clientChatId = normalizeChatId(body.chatId);
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId =
    process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  const orderId = createOrderId();

  if (!botToken) {
    console.error("Не задана переменная окружения TELEGRAM_BOT_TOKEN");
    return Response.json(
      { error: "Отправка заявки не настроена" },
      { status: 500 },
    );
  }

  if (!clientChatId && !adminChatId) {
    console.error(
      "Не заданы TELEGRAM_ADMIN_CHAT_ID / TELEGRAM_CHAT_ID и не передан chatId клиента",
    );
    return Response.json(
      { error: "Отправка заявки не настроена" },
      { status: 500 },
    );
  }

  const ticket = {
    orderId,
    name: clientName,
    username,
    car,
    service,
    date,
    phone,
    comment,
  };

  let delivered = false;

  if (clientChatId) {
    try {
      await sendTelegramMessage({
        botToken,
        chatId: clientChatId,
        text: clientTicketText(ticket),
        replyMarkup: ticketKeyboard(orderId),
      });
      delivered = true;
    } catch (error) {
      console.error("Не удалось отправить подтверждение клиенту в Telegram:", error);
    }
  }

  if (adminChatId) {
    try {
      await sendTelegramMessage({
        botToken,
        chatId: adminChatId,
        text: adminTicketText(ticket),
        replyMarkup: ticketKeyboard(orderId),
      });
      delivered = true;
    } catch (error) {
      console.error("Не удалось отправить заявку в админский чат:", error);
    }
  }

  if (!delivered) {
    return Response.json(
      { error: "Не удалось отправить заявку" },
      { status: 502 },
    );
  }

  return Response.json({ success: true, orderId }, { status: 200 });
}
