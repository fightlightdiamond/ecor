// Danh sách icon chọn trực quan cho danh mục (tên icon lưu vào DB, vd "Leaf").
// Dùng lucide-vue-next; tên trùng với export của thư viện để FE map lại nếu cần.
import {
  Leaf, Sprout, Flower, Flower2, TreePine, Coffee, CupSoda, Wine, Wheat, Cherry,
  Apple, Cookie, Candy, Utensils, Gift, Package, ShoppingBag, ShoppingCart, Tag, Tags,
  Star, Heart, Crown, Award, Sparkles, Flame, Sun, Moon, Store, Home, Box, Grid3x3,
  type Component,
} from 'lucide-vue-next';

export const ICON_LIST: { name: string; comp: Component }[] = [
  { name: 'Leaf', comp: Leaf },
  { name: 'Sprout', comp: Sprout },
  { name: 'Flower', comp: Flower },
  { name: 'Flower2', comp: Flower2 },
  { name: 'TreePine', comp: TreePine },
  { name: 'Coffee', comp: Coffee },
  { name: 'CupSoda', comp: CupSoda },
  { name: 'Wine', comp: Wine },
  { name: 'Wheat', comp: Wheat },
  { name: 'Cherry', comp: Cherry },
  { name: 'Apple', comp: Apple },
  { name: 'Cookie', comp: Cookie },
  { name: 'Candy', comp: Candy },
  { name: 'Utensils', comp: Utensils },
  { name: 'Gift', comp: Gift },
  { name: 'Package', comp: Package },
  { name: 'ShoppingBag', comp: ShoppingBag },
  { name: 'ShoppingCart', comp: ShoppingCart },
  { name: 'Tag', comp: Tag },
  { name: 'Tags', comp: Tags },
  { name: 'Star', comp: Star },
  { name: 'Heart', comp: Heart },
  { name: 'Crown', comp: Crown },
  { name: 'Award', comp: Award },
  { name: 'Sparkles', comp: Sparkles },
  { name: 'Flame', comp: Flame },
  { name: 'Sun', comp: Sun },
  { name: 'Moon', comp: Moon },
  { name: 'Store', comp: Store },
  { name: 'Home', comp: Home },
  { name: 'Box', comp: Box },
  { name: 'Grid3x3', comp: Grid3x3 },
];

export const ICON_MAP: Record<string, Component> = Object.fromEntries(
  ICON_LIST.map((i) => [i.name, i.comp]),
);
