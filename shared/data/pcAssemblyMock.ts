/**
 * Заготовка без WP (демо или сторибук). Основная страница берёт данные из «sborka-pk».
 */

import type {
  PcAssemblyBenefitSlide,
  PcAssemblyBuild,
} from '@/shared/types/pcAssemblyPage'

export type {
  PcAssemblyBenefitSlide,
  PcAssemblyBuild,
  PcAssemblyBuildAdvantage,
  PcAssemblyBuildReview,
  PcAssemblyIconKey,
} from '@/shared/types/pcAssemblyPage'

export const PC_ASSEMBLY_BUILDS: PcAssemblyBuild[] = [
  {
    id: 'mock-gaming-1080',
    title: 'Игровая сборка до 120 FPS в Full HD',
    cardImageSrc:
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
    gallerySrcs: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1200&q=80',
    ],
    advantages: [
      {
        iconKey: 'cpu',
        title: 'Производительный CPU',
        description: 'Подобран под ваши задачи без переплаты',
      },
    ],
    modalIntro: '',
    description: 'Компактная игровая система — демо-контент.',
    review: {
      firstName: 'Гость',
      lastName: '',
      photoSrc:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      text: '«Тестовый отзыв».',
    },
  },
]

export const PC_ASSEMBLY_BENEFITS: PcAssemblyBenefitSlide[] = [
  {
    id: 'b1',
    iconKey: 'wand',
    title: 'Подбор железа',
    description:
      'Совместимость и бюджет — без случайных бутылочных горлышек.',
  },
]
