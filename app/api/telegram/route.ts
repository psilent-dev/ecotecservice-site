type LeadPayload = {
  name: string;
  phone: string;
  service?: string;
  date?: string;
  comment?: string;
};

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

// Telegram parses the message with parse_mode: "HTML" and rejects stray angle brackets.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

  const body = (payload ?? {}) as Partial<LeadPayload>;
  const name = asText(body.name);
  const phone = asText(body.phone);

  if (!name || !phone) {
    return Response.json(
      { error: "Поля name и phone обязательны" },
      { status: 400 },
    );
  }

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
    `<b>Услуга:</b> ${escapeHtml(asText(body.service)) || "Не указана"}`,
    `<b>Дата записи:</b> ${escapeHtml(asText(body.date)) || "Не указана"}`,
    `<b>Комментарий:</b> ${escapeHtml(asText(body.comment)) || "Нет"}`,
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
