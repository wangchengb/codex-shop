export type DishCategory = '全部' | '招牌' | '热菜' | '凉菜' | '主食'

export interface Dish {
  id: number
  name: string
  subtitle: string
  price: number
  category: Exclude<DishCategory, '全部'>
  spicy: 1 | 2 | 3
  mark: string
}

export interface Review {
  name: string
  source: string
  quote: string
  date: string
}

export interface RestaurantInfo {
  name: string
  phone: string
  address: string
  hours: string[]
}

export interface ReservationForm {
  name: string
  phone: string
  date: string
  time: string
  guests: string
  note: string
}

export const dishes: Dish[] = [
  { id: 1, name: '沸腾水煮牛肉', subtitle: '每日鲜切黄牛肉，刀口辣椒现泼热油', price: 88, category: '招牌', spicy: 3, mark: '桌桌必点' },
  { id: 2, name: '黑豆花麻婆豆腐', subtitle: '汉源花椒配郫县豆瓣，麻香钻进豆腐里', price: 36, category: '招牌', spicy: 2, mark: '拌饭神器' },
  { id: 3, name: '火爆腰花', subtitle: '猛火十八秒，脆嫩无腥，泡椒够劲', price: 58, category: '热菜', spicy: 2, mark: '锅气担当' },
  { id: 4, name: '辣子鸡', subtitle: '鸡肉藏在辣椒山里，越翻越香', price: 62, category: '热菜', spicy: 3, mark: '下酒绝配' },
  { id: 5, name: '红油抄手', subtitle: '每日现包，甜水复合红油，一口一个', price: 24, category: '主食', spicy: 1, mark: '成都味道' },
  { id: 6, name: '蒜泥白肉', subtitle: '薄如灯影，蒜香红油，肥而不腻', price: 38, category: '凉菜', spicy: 1, mark: '开胃先锋' },
]

export const reviews: Review[] = [
  { name: '阿布', source: '常客 · 第 27 次到店', quote: '辣得很有层次，不是只会烧嘴。水煮牛肉端上来那一下，全桌都安静了。', date: '上周六' },
  { name: '小满同学', source: '本地美食博主', quote: '从泡菜到红油都是自己做的，市井馆子的样子，手艺却一点不含糊。', date: '六月食记' },
  { name: '陈叔', source: '附近街坊', quote: '三天不来就想。老板记得我少盐，厨师记得我要加一份豌豆尖。', date: '老客留言' },
]

export const restaurant: RestaurantInfo = {
  name: '巷火川菜馆',
  phone: '028-8888 1024',
  address: '成都市锦江区椒香里 18 号（虚构地址）',
  hours: ['午市 11:00—14:00', '晚市 17:00—22:30'],
}
