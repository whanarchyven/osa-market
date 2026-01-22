const axios = require('axios')

const apiUrl = process.env.WC_URL
const key = process.env.WC_KEY
const secret = process.env.WC_SECRET
const categoryId = Number(process.env.WC_CATEGORY_ID || 16)
const count = Number(process.env.WC_COUNT || 10)

if (!apiUrl || !key || !secret) {
  console.error('Missing env vars. Set WC_URL, WC_KEY, WC_SECRET')
  process.exit(1)
}

const client = axios.create({
  baseURL: `${apiUrl.replace(/\/$/, '')}/wc/v3`,
  auth: { username: key, password: secret },
})

const pcAttrOptions = {
  2: ['AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Intel Core i5', 'Intel Core i7'],
  3: ['GeForce RTX 5060', 'GeForce RTX 5060 Ti', 'GeForce RTX 5070', 'GeForce RTX 5080'],
  4: ['16 ГБ', '32 ГБ', '64 ГБ'],
  5: ['8 ГБ', '12 ГБ', '16 ГБ'],
  7: ['512 ГБ', '1024 ГБ', '2048 ГБ'],
  8: ['AMD', 'Intel'],
  9: ['4', '6', '8', '12'],
}

const laptopAttrOptions = {
  processor: ['Intel Core i7-14650HX', 'Intel Core i7-13620H', 'Intel Core i5-13500H'],
  2: ['Intel Core i7', 'Intel Core i5'],
  3: ['GeForce RTX 5060', 'GeForce RTX 5070', 'GeForce RTX 5080'],
  4: ['16 ГБ', '32 ГБ'],
  7: ['512 ГБ', '1024 ГБ'],
  8: ['Intel'],
  9: ['10', '12', '16'],
  10: ['15.6"', '16"', '17.3"'],
  11: ['Игровые', 'Для работы'],
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const pcNamePrefixes = [
  'Игровой компьютер',
  'ПК для работы',
  'Геймерский ПК',
  'Компактный ПК',
  'Производительный ПК',
]

const laptopNamePrefixes = [
  'Ноутбук MSI Katana 17 HX',
  'Ноутбук MSI Katana 16 HX',
  'Ноутбук MSI Katana 17',
  'Ноутбук MSI Katana 15',
]

const laptopSkuSuffixes = [
  'B14WGK-053XRU',
  'B14VGK-102XRU',
  'B14VGK-245XRU',
  'B14VGK-507XRU',
  'B14VGK-913XRU',
]

const pcImageSet = [
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/99044.970.webp',
    name: '99044.970',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/99045.970.webp',
    name: '99045.970',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/99046.970.webp',
    name: '99046.970',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/99047.970.webp',
    name: '99047.970',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/99048.970.webp',
    name: '99048.970',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/99049.970.webp',
    name: '99049.970',
  },
]

const laptopImageSet = [
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/3fd5aef5db82a1d1cff65315c7680abc360d47b3fb317da063a692384500ca76.jpg.webp',
    name: '3fd5aef5db82a1d1cff65315c7680abc360d47b3fb317da063a692384500ca76.jpg',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/014230f1f683b2f1ca8eed4c6049e135aca59d04851f4c4f5c72dd9df45af385.jpg.webp',
    name: '014230f1f683b2f1ca8eed4c6049e135aca59d04851f4c4f5c72dd9df45af385.jpg',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/341a5897dc5de1f7e0053cd623dfcecdf27204a6cb4c0c3efbb7fffcdf32cf1f.jpg.webp',
    name: '341a5897dc5de1f7e0053cd623dfcecdf27204a6cb4c0c3efbb7fffcdf32cf1f.jpg',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/9b391f9ea5b96359c405cb99fc9d0d417a85c8eaa8b9ea6414ddb003cc613154.jpg.webp',
    name: '9b391f9ea5b96359c405cb99fc9d0d417a85c8eaa8b9ea6414ddb003cc613154.jpg',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/9e48e636962f29d0293fa09fbc058e367f31faced4a6c7f47cb72769443c6243.jpg.webp',
    name: '9e48e636962f29d0293fa09fbc058e367f31faced4a6c7f47cb72769443c6243.jpg',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/46c408e032485339a84fdb3c7d08c8ce74298b2ff498ae51da7602e314563ff7.jpg.webp',
    name: '46c408e032485339a84fdb3c7d08c8ce74298b2ff498ae51da7602e314563ff7.jpg',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/7221097fa62427a106fe2339be8f78f29786eda8c6d71e3112a99d4cc7d7b225.jpg.webp',
    name: '7221097fa62427a106fe2339be8f78f29786eda8c6d71e3112a99d4cc7d7b225.jpg',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/bed9e6099547e9de659f8ed2aea28a658526b66bc09643ec08e7bc5f57023d4a.jpg.webp',
    name: 'bed9e6099547e9de659f8ed2aea28a658526b66bc09643ec08e7bc5f57023d4a.jpg',
  },
  {
    src: 'https://zaburdaev.space/wp-content/uploads/2026/01/e56902ba01b2d89e08ac90361229204845fc4250343de84684f3495955edde85.jpg.webp',
    name: 'e56902ba01b2d89e08ac90361229204845fc4250343de84684f3495955edde85.jpg',
  },
]

async function run() {
  for (let i = 0; i < count; i += 1) {
    const isLaptopCategory = categoryId === 58
    const options = isLaptopCategory ? laptopAttrOptions : pcAttrOptions

    const cpu = pick(options[2])
    const gpu = pick(options[3])
    const ram = pick(options[4])
    const ssd = pick(options[7])

    const name = isLaptopCategory
      ? `${pick(laptopNamePrefixes)} ${pick(laptopSkuSuffixes)}`
      : `${pick(pcNamePrefixes)} ${cpu} / ${gpu} / ${ram} / ${ssd}`
    const regularPrice = 110000 + i * 3500
    const salePrice = regularPrice - 6000

    const payload = {
      name,
      type: 'simple',
      status: 'publish',
      regular_price: String(regularPrice),
      sale_price: String(salePrice),
      categories: [{ id: categoryId }],
      manage_stock: true,
      stock_quantity: 8 + i,
      stock_status: 'instock',
      images: (isLaptopCategory ? laptopImageSet : pcImageSet).map((image) => ({
        src: image.src,
        name: image.name,
        alt: name,
      })),
      attributes: [
        ...(isLaptopCategory
          ? [
              {
                id: 0,
                name: 'Процессор',
                options: [pick(laptopAttrOptions.processor)],
                visible: true,
                variation: false,
              },
            ]
          : []),
        ...Object.entries(options)
          .filter(([key]) => key !== 'processor')
          .map(([id, options]) => ({
            id: Number(id),
            options: [pick(options)],
            visible: true,
            variation: false,
          })),
      ],
    }

    const res = await client.post('/products', payload)
    console.log(`Created #${res.data.id}: ${res.data.name}`)
  }
}

run().catch((err) => {
  const status = err?.response?.status
  const data = err?.response?.data
  console.error('Failed:', status || err.message, data || '')
  process.exit(1)
})
