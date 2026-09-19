/**
 * Тексты и данные главной страницы.
 * Меняйте строки здесь — компоненты только читают этот файл.
 */

/** Имена услуг в форме записи. Одно место для чипов, услуг, прайса и модалки. */
export const BOOKING_SERVICE = {
  to: "Техническое обслуживание (ТО)",
  suspension: "Ремонт подвески",
  electric: "Автоэлектрика",
  engine: "Ремонт ДВС",
  welding: "Сварочные работы",
  other: "Другое",
} as const;

export const BOOKING_SERVICES = [
  BOOKING_SERVICE.to,
  BOOKING_SERVICE.suspension,
  BOOKING_SERVICE.electric,
  BOOKING_SERVICE.engine,
  BOOKING_SERVICE.welding,
  BOOKING_SERVICE.other,
] as const;

export type BookingService = (typeof BOOKING_SERVICES)[number];

export const siteData = {
  contact: {
    name: "ЭКОТЕК СЕРВИС",
    phone: "+7 (906) 422-17-72",
    rawPhone: "+79064221772",
    address: "г. Ростов-на-Дону, ул. Борко, 3/5",
    workingHours: "Пн-Сб: 09:00 — 18:00",
    logoPath: "/logo.svg",
    mapsUrl: "https://yandex.ru/maps/?text=ECOTEC%20SERVICE",
  },

  header: {
    liveStatus: "Сегодня свободно 2 подъемника",
    bookingButton: "Заказать звонок",
    menuAriaLabel: "Открыть меню",
    mobileDescription: "Автосервис / Мультибренд",
    navAriaLabel: "Основная навигация",
    mobileNavAriaLabel: "Мобильная навигация",
    nav: [
      { href: "/#services", label: "Услуги" },
      { href: "/#pricing", label: "Прайс-лист" },
      { href: "/#before-after", label: "До / После" },
      { href: "/#reviews", label: "Отзывы" },
      { href: "/#blog", label: "Блог" },
      { href: "/#contacts", label: "Контакты" },
    ],
  },

  hero: {
    titleBefore: "Автосервис",
    titleCity: "в Ростове-на-Дону",
    titleAccent: "ремонт любой сложности",
    subtitle:
      "Честные цены, гарантия на работы, запчасти в наличии. Приезжайте — посмотрим, скажем как есть.",
    primaryCta: "Записаться на сервис",
    secondaryCta: "Рассчитать стоимость",
    image: "gallery/hero.jpg",
    imageAlt: "Автомобиль в ремонтной зоне автосервиса",
    ratingBadge: "4.9 ★ Рейтинг на картах",
    guaranteeBadge: "100% Гарантия",
    chips: [
      { label: "ТО", service: BOOKING_SERVICE.to },
      { label: "Ремонт подвески", service: BOOKING_SERVICE.suspension },
      { label: "Автоэлектрика", service: BOOKING_SERVICE.electric },
      { label: "Ремонт ДВС", service: BOOKING_SERVICE.engine },
      { label: "Сварочные работы", service: BOOKING_SERVICE.welding },
    ],
    advantages: [
      {
        title: "Допуск в ремзону",
        description: "Присутствуйте при ремонте и диагностике вашего авто",
        icon: "eye",
      },
      {
        title: "Фиксированная смета",
        description: "Согласовываем цену до начала работ. Никаких доплат по факту",
        icon: "clipboard",
      },
      {
        title: "Запчасти в наличии",
        description: "Собственный склад расходников и подбор за 15 минут",
        icon: "package",
      },
    ],
  },

  services: {
    title: "Предоставляемые услуги",
    subtitle:
      "Полный цикл работ: от ТО и диагностики до ремонта ДВС, электрики и сварки — с гарантией на результат.",
    cta: "Узнать цену / Записаться",
    items: [
      {
        title: "Техническое обслуживание (ТО)",
        description:
          "Регламентные работы, замена масла, фильтров и жидкостей с диагностикой по чек-листу.",
        bookingService: BOOKING_SERVICE.to,
        icon: "wrench",
        className: "md:col-span-2",
      },
      {
        title: "Ремонт подвески и ходовой",
        description:
          "Стойки, рычаги, сайлентблоки и развал-схождение — без лишних замен «на всякий случай».",
        bookingService: BOOKING_SERVICE.suspension,
        icon: "car",
      },
      {
        title: "Автоэлектрика и компьютерная диагностика",
        description:
          "Ошибки ЭБУ, проводка, датчики и поиск скрытых неисправностей сканером.",
        bookingService: BOOKING_SERVICE.electric,
        icon: "cpu",
      },
      {
        title: "Капитальный и текущий ремонт ДВС",
        description:
          "ГБЦ, ГРМ, маслосъём, замена прокладок и восстановление ресурса двигателя.",
        bookingService: BOOKING_SERVICE.engine,
        icon: "cog",
        className: "md:col-span-2",
      },
      {
        title: "Сварочные работы и ремонт выхлопных систем",
        description:
          "Аргон, кузовной ремонт, банки, гофры и устранение прогаров выхлопа.",
        bookingService: BOOKING_SERVICE.welding,
        icon: "flame",
        className: "md:col-span-2 lg:col-span-2",
      },
    ],
  },

  gallery: {
    title: "Процесс работы и результаты",
    subtitle: "Реальные кадры из нашей ремзоны и примеры выполненных работ",
    filterAriaLabel: "Фильтр галереи",
    lightboxDescription: "Полноэкранный просмотр фотографии из галереи",
    closeAriaLabel: "Закрыть",
    filters: [
      { id: "all", label: "Все" },
      { id: "workshop", label: "Ремзона" },
      { id: "before-after", label: "До / После" },
      { id: "engine", label: "ДВС и Сварка" },
    ],
    items: [
      {
        id: "workshop-1",
        title: "Рабочий пост в ремзоне",
        category: "workshop",
        file: "workshop-bay.jpg",
        src: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "engine-1",
        title: "Капитальный ремонт ДВС",
        category: "engine",
        file: "engine-overhaul.jpg",
        src: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "before-after-1",
        title: "Восстановление геометрии подвески",
        category: "before-after",
        file: "suspension-geometry.jpg",
        src: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "engine-2",
        title: "Сварка выхлопной системы",
        category: "engine",
        file: "exhaust-welding.jpg",
        src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "workshop-2",
        title: "Диагностика на подъёмнике",
        category: "workshop",
        file: "lift-diagnostics.jpg",
        src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "before-after-2",
        title: "Кузовной ремонт: до и после",
        category: "before-after",
        file: "body-before-after.jpg",
        src: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
      },
    ],
  },

  pricing: {
    title: "Прозрачный прайс-лист",
    subtitle:
      "Ориентировочные цены и сроки. Точную стоимость подтвердим после диагностики — без скрытых работ.",
    searchPlaceholder: "Поиск работы (например: замена масла, ГРМ, тормоза)...",
    searchAriaLabel: "Поиск работы",
    filterAriaLabel: "Фильтр категорий прайса",
    emptyText: "По вашему запросу работы не найдены",
    emptyCta: "Запросить расчет у мастера",
    bookCta: "Записаться",
    showMore: "Показать еще",
    columns: {
      work: "Работа",
      time: "Срок",
      price: "Цена",
      book: "Запись",
    },
    categories: [
      { id: "all", label: "Все" },
      { id: "to", label: "ТО", bookingService: BOOKING_SERVICE.to },
      { id: "suspension", label: "Подвеска", bookingService: BOOKING_SERVICE.suspension },
      { id: "electric", label: "Автоэлектрика", bookingService: BOOKING_SERVICE.electric },
      { id: "engine", label: "ДВС", bookingService: BOOKING_SERVICE.engine },
      { id: "welding", label: "Сварка", bookingService: BOOKING_SERVICE.welding },
    ],
    items: [
      { id: "to-oil", category: "to", title: "Замена масла", price: 2500, timeEstimate: "от 40 мин." },
      { id: "to-filters", category: "to", title: "Замена фильтров", price: 1800, timeEstimate: "от 30 мин." },
      { id: "to-spark", category: "to", title: "Замена свечей зажигания", price: 2200, timeEstimate: "от 45 мин." },
      { id: "to-complex", category: "to", title: "Комплексное ТО", price: 8900, timeEstimate: "от 2,5 ч." },
      { id: "susp-shock", category: "suspension", title: "Замена амортизаторов", price: 8000, timeEstimate: "от 2 ч." },
      { id: "susp-silent", category: "suspension", title: "Замена сайлентблоков", price: 6500, timeEstimate: "от 3 ч." },
      { id: "susp-brakes", category: "suspension", title: "Замена тормозных колодок / дисков", price: 4500, timeEstimate: "от 1,5 ч." },
      { id: "susp-align", category: "suspension", title: "Развал-схождение", price: 2500, timeEstimate: "от 40 мин." },
      { id: "el-diag", category: "electric", title: "Компьютерная диагностика", price: 1500, timeEstimate: "от 30 мин." },
      { id: "el-leak", category: "electric", title: "Поиск утечки тока", price: 3500, timeEstimate: "от 1,5 ч." },
      { id: "el-gen", category: "electric", title: "Ремонт генератора / стартера", price: 5500, timeEstimate: "от 2 ч." },
      { id: "el-ecu", category: "electric", title: "Устранение ошибок ЭБУ", price: 3000, timeEstimate: "от 1 ч." },
      { id: "eng-timing", category: "engine", title: "Замена ремня / цепи ГРМ", price: 12000, timeEstimate: "от 4 ч." },
      { id: "eng-seals", category: "engine", title: "Замена маслосъемных колпачков", price: 15000, timeEstimate: "от 6 ч." },
      { id: "eng-valves", category: "engine", title: "Регулировка клапанов", price: 4500, timeEstimate: "от 2 ч." },
      { id: "eng-overhaul", category: "engine", title: "Капитальный ремонт", price: 85000, timeEstimate: "от 3 дн." },
      { id: "weld-flex", category: "welding", title: "Замена гофры глушителя", price: 4000, timeEstimate: "от 1 ч." },
      { id: "weld-argon", category: "welding", title: "Сварка аргоном", price: 2500, timeEstimate: "от 40 мин." },
      { id: "weld-sills", category: "welding", title: "Ремонт порогов / арок", price: 12000, timeEstimate: "от 8 ч." },
      { id: "weld-exhaust", category: "welding", title: "Ремонт выхлопной системы", price: 5500, timeEstimate: "от 2 ч." },
    ],
  },

  reviews: {
    title: "Что о нас говорят клиенты",
    ratingSummary: "4.9 ★ на основе 250+ отзывов в Яндекс Картах и 2ГИС",
    ratingAriaLabel: "Оценка 5 из 5",
    cta: "Оставить отзыв на Яндекс Картах",
    sourceLabels: {
      yandex: "Яндекс Карты",
      "2gis": "2ГИС",
    },
    items: [
      {
        id: "alexey-x5",
        name: "Алексей",
        car: "BMW X5 (F15)",
        text: "Приехал на регламентное ТО: масло, фильтры и чек-лист по мотору. Ничего лишнего не навязали, по срокам уложились в день, после замены ошибок по маслу не было.",
        date: "август 2026",
        source: "yandex",
      },
      {
        id: "marina-camry",
        name: "Марина",
        car: "Toyota Camry",
        text: "Стучала подвеска на мелких ямах. Заменили стойки и сайлентблоки, сразу сделали развал-схождение. Машина снова едет ровно, без лишних «замен на всякий случай».",
        date: "июль 2026",
        source: "2gis",
      },
      {
        id: "dmitry-tiguan",
        name: "Дмитрий",
        car: "Volkswagen Tiguan",
        text: "Горела ошибка ЭБУ, другие сервисы крутили только сброс. Здесь сняли логи сканером, нашли датчик и утечку по проводке. После ремонта Check Engine не возвращался.",
        date: "июнь 2026",
        source: "yandex",
      },
      {
        id: "olga-sportage",
        name: "Ольга",
        car: "Kia Sportage",
        text: "Нужно было комплексное ТО перед поездкой. Сделали по регламенту, показали износ колодок без давления «менять всё сразу». Прозрачно по работам и по срокам.",
        date: "май 2026",
        source: "2gis",
      },
      {
        id: "ivan-cclass",
        name: "Иван",
        car: "Mercedes-Benz C-Class",
        text: "Уводило руль и ела резину. Диагностика ходовой подтвердила износ рычагов, после замены и сход-развала авто перестало тянуть. Объяснили, что именно ломалось.",
        date: "апрель 2026",
        source: "yandex",
      },
      {
        id: "sergey-tucson",
        name: "Сергей",
        car: "Hyundai Tucson",
        text: "Села батарея и плавали обороты. Компьютерная диагностика показала утечку тока и ошибку по генератору, починили за визит. Без «давайте поменяем полмашины».",
        date: "март 2026",
        source: "2gis",
      },
    ],
  },

  blog: {
    title: "Полезные статьи и советы экспертов",
    readMore: "Читать статью",
  },

  contacts: {
    title: "Контакты",
    subtitle:
      "Приезжайте в ремзону или запишитесь по телефону — скажем, что с авто, до начала работ.",
    cards: [
      { kind: "phone", title: "Телефон" },
      { kind: "address", title: "Адрес" },
      { kind: "hours", title: "Режим работы" },
    ],
    form: {
      nameLabel: "Имя",
      namePlaceholder: "Иван",
      phoneLabel: "Телефон",
      submit: "Перезвоните мне",
      submitting: "Отправка...",
      secondaryCta: "Записаться на диагностику",
      success: "Заявка отправлена. Мы перезвоним в течение 10 минут.",
      validationError: "Укажите имя и телефон в формате +7 (XXX) XXX-XX-XX",
      submitError: "Не удалось отправить заявку",
      telegramComment: "Заявка с блока Контакты",
    },
  },

  footer: {
    year: 2026,
    copyright: "Все права защищены.",
  },

  booking: {
    title: "Запись на сервис",
    subtitle: "Оставьте данные, и мы перезвоним для подтверждения времени",
    closeAriaLabel: "Закрыть",
    nameLabel: "Имя",
    namePlaceholder: "Иван",
    phoneLabel: "Телефон",
    serviceLabel: "Услуга",
    servicePlaceholder: "Выберите услугу",
    dateLabel: "Желаемая дата",
    dateHint: "Выберите удобную дату для записи",
    dateSelectedPrefix: "Выбрано:",
    commentLabel: "Комментарий / Описание проблемы",
    commentPlaceholder: "Опишите, что случилось с автомобилем",
    submit: "Записаться",
    submitting: "Отправка...",
    success: "Заявка успешно отправлена! Мы свяжемся с вами в течение 10 минут",
    validationError: "Укажите имя и телефон в формате +7 (XXX) XXX-XX-XX",
    submitError: "Не удалось отправить заявку. Попробуйте ещё раз.",
  },
} as const;

export type SiteData = typeof siteData;
export type GalleryFilterId = (typeof siteData.gallery.filters)[number]["id"];
export type GalleryCategory = Exclude<GalleryFilterId, "all">;
export type PriceCategoryId = (typeof siteData.pricing.categories)[number]["id"];
export type PriceCategory = Exclude<PriceCategoryId, "all">;
export type ReviewSource = (typeof siteData.reviews.items)[number]["source"];
