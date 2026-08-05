export type CartItem = {
  gearId: string;
  title: string;
  brand: string;
  image?: string;
  pricePerDay: number | string;
  stock: number;
  quantity: number;
};
