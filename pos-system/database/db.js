import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@3.3.4/dist/dexie.mjs';

export const db = new Dexie('pos_system_db');

db.version(1).stores({
  users: '++id,username,password,role',
  products: '++id,barcode,name,category,stock,price',
  customers: '++id,name,mobile',
  sales: '++id,date,total,paymentMethod',
  saleItems: '++id,saleId,productId,qty,price',
  stockLogs: '++id,productId,type,qty,date'
});

export async function initDefaultAdmin() {
  const count = await db.users.where('username').equals('admin').count();
  if (!count) {
    await db.users.add({
      username: 'admin',
      password: 'admin123',
      role: 'Administrator'
    });
  }
}
