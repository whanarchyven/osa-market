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

const attrOptions = {
  2: ['AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Intel Core i5', 'Intel Core i7'],
  3: ['GeForce RTX 5060', 'GeForce RTX 5060 Ti', 'GeForce RTX 5070', 'GeForce RTX 5080'],
  4: ['16 ГБ', '32 ГБ', '64 ГБ'],
  5: ['8 ГБ', '12 ГБ', '16 ГБ'],
  7: ['512 ГБ', '1024 ГБ', '2048 ГБ'],
  8: ['AMD', 'Intel'],
  9: ['4', '6', '8', '12'],
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const namePrefixes = [
  'Игровой компьютер',
  'ПК для работы',
  'Геймерский ПК',
  'Компактный ПК',
  'Производительный ПК',
]

const imageSet = [
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

async function run() {
  for (let i = 0; i < count; i += 1) {
    const cpu = pick(attrOptions[2])
    const gpu = pick(attrOptions[3])
    const ram = pick(attrOptions[4])
    const ssd = pick(attrOptions[7])

    const name = `${pick(namePrefixes)} ${cpu} / ${gpu} / ${ram} / ${ssd}`
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
      images: imageSet.map((image) => ({
        src: image.src,
        name: image.name,
        alt: name,
      })),
      attributes: Object.entries(attrOptions).map(([id, options]) => ({
        id: Number(id),
        options: [pick(options)],
        visible: true,
        variation: false,
      })),
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
