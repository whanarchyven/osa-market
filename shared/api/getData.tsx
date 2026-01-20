import type { PageData, HeaderPageData, RazdelKataloga } from '../types/api'

// Симуляция получения данных с API
export async function getData(): Promise<PageData[]> {
  // В реальном приложении здесь будет fetch к API
  // const response = await fetch('https://zaburdaev.space/wp-json/wp/v2/pages?slug=main')
  // return response.json()

  return [
    {
      id: 76,
      date: "2026-01-19T14:48:55",
      date_gmt: "2026-01-19T11:48:55",
      guid: {
        rendered: "https://zaburdaev.space/?page_id=76"
      },
      modified: "2026-01-19T15:00:48",
      modified_gmt: "2026-01-19T12:00:48",
      slug: "main",
      status: "publish",
      type: "page",
      link: "https://zaburdaev.space/main/",
      title: {
        rendered: "Главная страница"
      },
      content: {
        rendered: "",
        protected: false
      },
      excerpt: {
        rendered: "",
        protected: false
      },
      author: 1,
      featured_media: 0,
      parent: 0,
      menu_order: 0,
      comment_status: "closed",
      ping_status: "closed",
      template: "",
      meta: {
        _acf_changed: false,
        footnotes: ""
      },
      class_list: [
        "post-76",
        "page",
        "type-page",
        "status-publish",
        "hentry"
      ],
      acf: {
        zaglavnyj_blok: {
          slogan: "Твоя игровая мощь начинается здесь",
          opisanie: "Ноутбуки, готовые сборки ПК и периферия от ведущих брендов. Собери свою идеальную систему.",
          fakty: [
            {
              zagolovok: "5000+",
              opisanie: "товаров в каталоге"
            },
            {
              zagolovok: "24/7",
              opisanie: "поддержка"
            },
            {
              zagolovok: "3 года",
              opisanie: "гарантии"
            }
          ],
          preimushhestva: [
            {
              preimushhestvo: "Бесплатная доставка от 10 000 ₽"
            },
            {
              preimushhestvo: "Рассрочка 0%"
            },
            {
              preimushhestvo: "Возврат 14 дней"
            }
          ],
          nazvanie_bloka_s_tovarami: "Избранные товары",
          opisanie_bloka_s_tovarami: "Лучшие предложения недели",
          tovary: [
            {
              tovar: {
                ID: 69,
                post_author: "1",
                post_date: "2026-01-18 15:26:49",
                post_date_gmt: "2026-01-18 12:26:49",
                post_content: "<p>Мощный игровой ПК: AMD Ryzen 5 7600 | RTX 5060 Ti 8Gb | DDR5 32Gb</p>",
                post_title: "Игровой компьютер AMD Ryzen 5 7600/RTX5060 Ti 8Gb/B650M/DDR5 32Gb/SSD 1Tb/750W/mATX",
                post_excerpt: "Окунитесь в мир бескомпромиссного гейминга с нашим новым игровым компьютером, созданным для побед и полного погружения!",
                post_status: "publish",
                comment_status: "open",
                ping_status: "closed",
                post_password: "",
                post_name: "igrovoj-kompyuter-amd-ryzen-5-7600-rtx5060-ti-8gb",
                to_ping: "",
                pinged: "",
                post_modified: "2026-01-19 14:39:09",
                post_modified_gmt: "2026-01-19 11:39:09",
                post_content_filtered: "",
                post_parent: 0,
                guid: "https://zaburdaev.space/?post_type=product&p=69",
                menu_order: 0,
                post_type: "product",
                post_mime_type: "",
                comment_count: "0",
                filter: "raw"
              }
            },
            {
              tovar: {
                ID: 70,
                post_author: "1",
                post_date: "2026-01-18 16:00:00",
                post_date_gmt: "2026-01-18 13:00:00",
                post_content: "<p>Мощный игровой ноутбук MSI с RTX 5070</p>",
                post_title: "MSI Katana 17 B13VFK Gaming Laptop RTX 5070/i7-13620H/32GB/1TB",
                post_excerpt: "Игровой ноутбук премиум-класса для настоящих геймеров",
                post_status: "publish",
                comment_status: "open",
                ping_status: "closed",
                post_password: "",
                post_name: "msi-katana-17-gaming-laptop",
                to_ping: "",
                pinged: "",
                post_modified: "2026-01-19 14:39:09",
                post_modified_gmt: "2026-01-19 11:39:09",
                post_content_filtered: "",
                post_parent: 0,
                guid: "https://zaburdaev.space/?post_type=product&p=70",
                menu_order: 0,
                post_type: "product",
                post_mime_type: "",
                comment_count: "0",
                filter: "raw"
              }
            },
            {
              tovar: {
                ID: 71,
                post_author: "1",
                post_date: "2026-01-18 17:00:00",
                post_date_gmt: "2026-01-18 14:00:00",
                post_content: "<p>Видеокарта ASUS ROG Strix</p>",
                post_title: "ASUS ROG Strix GeForce RTX 5080 OC 16GB GDDR7",
                post_excerpt: "Флагманская видеокарта для 4K гейминга",
                post_status: "publish",
                comment_status: "open",
                ping_status: "closed",
                post_password: "",
                post_name: "asus-rog-strix-rtx-5080",
                to_ping: "",
                pinged: "",
                post_modified: "2026-01-19 14:39:09",
                post_modified_gmt: "2026-01-19 11:39:09",
                post_content_filtered: "",
                post_parent: 0,
                guid: "https://zaburdaev.space/?post_type=product&p=71",
                menu_order: 0,
                post_type: "product",
                post_mime_type: "",
                comment_count: "0",
                filter: "raw"
              }
            }
          ],
          ssylka_na_video: "https://28bit.ru/wa-data/public/site/promo2.mp4?v1.2.2"
        }
      }
    }
  ]
}

// Симуляция получения данных шапки
export async function getHeaderData(): Promise<RazdelKataloga[]> {
  // В реальном приложении здесь будет fetch к API
  // const response = await fetch('https://zaburdaev.space/wp-json/wp/v2/pages?slug=header')
  // const data = await response.json()
  // return data[0].acf.razdely_kataloga

  return [
    {
      kategoriya: {
        naimenovanie_kategorii: "Ноутбуки",
        ikonka_kategorii: "https://zaburdaev.space/wp-content/uploads/2026/01/laptop.png",
        ssylka_na_kategoriyu: {
          term_id: 58,
          name: "Ноутбуки",
          slug: "laptops",
          term_group: 0,
          term_taxonomy_id: 58,
          taxonomy: "product_cat",
          description: "Самые топовые ноутбуки",
          parent: 0,
          count: 0,
          filter: "raw"
        },
        gruppy_filtrov: [
          {
            gruppa_filtrov: {
              zagolovok_filtra: "Популярные бренды",
              slug_taksonomii: "brand",
              varianty_filtra: [
                { variant_filtra: { zagolovok: "MSI", znachenie: "msi" } },
                { variant_filtra: { zagolovok: "Asus", znachenie: "asus" } }
              ]
            }
          },
          {
            gruppa_filtrov: {
              zagolovok_filtra: "По назначению",
              slug_taksonomii: "reason",
              varianty_filtra: [
                { variant_filtra: { zagolovok: "Игровые", znachenie: "gaming" } },
                { variant_filtra: { zagolovok: "Для работы", znachenie: "work" } },
                { variant_filtra: { zagolovok: "Ультрабуки", znachenie: "ultrabooks" } }
              ]
            }
          }
        ]
      }
    }
  ]
}
