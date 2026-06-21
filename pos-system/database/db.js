import Dexie, { liveQuery } from 'https://unpkg.com/dexie@3.2.4/dist/dexie.mjs';

export const db = new Dexie('pos_system_db');

db.version(1).stores({
  users: '++id,username,password,role',
  products: '++id,barcode,name,category',
  customers: '++id,name,mobile',
  sales: '++id,date,total,paymentMethod',
  saleItems: '++id,saleId,productId,qty,price',
  stockLogs: '++id,productId,type,qty,date'
});

export async function initDefaultAdmin() {
  try {
    const count = await db.users.where('username').equals('admin').count();
    if (!count) {
      await db.users.add({
        username: 'admin',
        password: 'admin123',
        role: 'Administrator'
      });
      console.log('✓ Default admin user created');
    } else {
      console.log('✓ Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

export async function verifyDB() {
  try {
    const version = await db.version;
    console.log('✓ IndexedDB connected:', db.name);
    return true;
  } catch (error) {
    console.error('✗ IndexedDB error:', error);
    return false;
  }
}
