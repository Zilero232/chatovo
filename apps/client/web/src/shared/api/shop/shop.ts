import type { EquipCosmeticInput, ShopOrder, ShopProductKey, ShopState } from '@chatovo/schemas';

import { api } from '../http';

export const getShopState = async (): Promise<ShopState> => {
  const { data } = await api.get('/shop');

  return data;
};

export const createShopOrder = async (productKey: ShopProductKey): Promise<ShopOrder> => {
  const { data } = await api.post('/shop/orders', { productKey });

  return data;
};

export const getShopOrder = async (orderId: string): Promise<ShopOrder> => {
  const { data } = await api.get(`/shop/orders/${orderId}`);

  return data;
};

export const equipCosmetic = async (input: EquipCosmeticInput): Promise<ShopState> => {
  const { data } = await api.post('/shop/equip', input);

  return data;
};
