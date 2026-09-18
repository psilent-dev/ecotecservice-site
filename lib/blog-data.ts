export type BlogArticle = {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  excerpt: string;
  image: string;
  imageAlt: string;
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "kogda-menyat-maslo-v-akpp",
    title: "Когда менять масло в АКПП: регламент и симптомы износа",
    category: "ТО",
    readingTime: "5 мин",
    excerpt:
      "Разбираем интервалы замены ATF, признаки подгорания и когда частичная замена уже не спасает коробку.",
    image:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Работа в ремзоне автосервиса при регламентном обслуживании",
  },
  {
    slug: "prichiny-stuka-v-podveske",
    title: "Причины стука в подвеске на неровностях: гайд по диагностике",
    category: "Подвеска",
    readingTime: "7 мин",
    excerpt:
      "Как отличить стук стойки от сайлентблока, что проверить на подъёмнике и когда нужен развал-схождение.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Автомобиль на подъёмнике во время диагностики подвески",
  },
  {
    slug: "ne-gorit-chek-mashina-ne-edet",
    title: "Не горит чек, но машина не едет: частые проблемы с автоэлектрикой",
    category: "Электрика",
    readingTime: "4 мин",
    excerpt:
      "Почему ЭБУ молчит при просадке питания, как ловят утечку тока и что смотреть, если сканер не видит ошибки.",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Диагностика автомобиля в моторном отсеке",
  },
];
