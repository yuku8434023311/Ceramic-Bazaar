import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import os from 'os';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

// Fallback Ceramic Bazaar Firebase credentials
const CERAMIC_PROJECT_ID = "ceramic-bazaar";
const CERAMIC_CLIENT_EMAIL = "firebase-adminsdk-fbsvc@ceramic-bazaar.iam.gserviceaccount.com";
const CERAMIC_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvuw6XH0J2j/j+\nn3yTIPSXZd7Hwqif04gY6Z3w3EbzpGbzWhr6JqJXpgTXhMHYSXDhojLwl75g1v7E\ne0elNoD713LspGs6grKW9roizyoamGD4vHkd3vsbC4YHolTgZnuQeRAK2F0ccUYj\nwsUVLwP2ZqZPsO/y0cMcB7NhNbM1fjr/8TJHqVSvneHYyotzlxSHXwtz6lXIQk4B\neuNCyEkW4t+ZYeKJtHb3AmkPVfXiUzmMRUEhks+kRoyCo5xw0FzqqEIgG5yxkiyG\nwJolcVnR5dt9CbLHm3IZHzZ0bs6s2pg+f9xsVYziQu2BeIJRnlmkZK7koj6g7qeV\nNKCCN/7XAgMBAAECggEAQ+pu5qAJr0nQSRP5cOFlNlgEJD8KrY5yxHIRfQOdFk+9\nDCMQVwp0Zpx+tY6U3lLv4fwuZMa4qLOeze/5ThRFAFARlfyrhnb5r5eWc5qOIq4u\nmCM7SfyiHp8zAyNNW1awPbNULGTXg4URvwNo6Nl9Vg7xCs6OxdEk72HYhWLcKnlE\n3sWib8hsprNm9MlgCw1mddhYt4DLyb6+55NkM3syXG7TnO14zNNucuM3kVFSWIZ3\nkMzoXQdLnRH83ckz9YFDcV7uxQy7bQja85Ouii2sQd7katMjD8c+2kC3KOfj4Zcw\n1cw0IF2hdIoVGulT/hDpoLcwxZ1R79RZC7YuLerBvQKBgQDjGGxIk/MACv8O10AK\nELAEm4Pl2cKzC/L1Jl+sXbJ8LpON38PXGAQwZUHP8ikozhJ7Uhnm03vaJv3FnaMl\nuo5V7m3E6/zBy8dER6f8Mjk7M3GaKVXdYlwbSSY+ElFlfBG1ZJg8OUqEExGg/Xtc\nSc/YznYWI6pl/QV8BQ96imReYwKBgQDGGP0hergcNAaX21kAimRXOFLuf9C7Kgxm\njY0DeIPF97I2bEgFJPFJkr28++nRrzp15b/SGJsanpi4bF8s/OzW36lotiEaqo/G\ndXTS32wQ8D1w46Nw3DDYFVj9TJdTdIrnj66m/Z++Stf0dOy9kZVzhfDDysvlBSOd\nw3zDe4yd/QKBgQDN5GS4YLrd/RpGQE2lUn/jjYPGLuphHqJGNWZkhga+pBPPe2K5\nbuLNZeCHQgyjHEKRYFxvdKpDnTpTopo6KKvHqQYIldRxd+nQNA9PjdFppTiIBpX8\nw6Kycl2jxUPa+OOtS+jiISc4G3nONkNT5u/0pytU4z0ofoAscwIXncVl9QKBgCMv\n4x6kRrmzwAwPSULgUixv88Mrbu8f6+33bLnWGUn70mr6VtybEETqTMuZz5GQV4kD\nk0wFVN+oliYEEe/SyVrthZD08PJko38z89lVGEP1+GPp+2kbo41uVU1A4oxPYjD5\ng6Nj35EUiEGC115g0rQfcYHFruvyOr5WL/4lHvgdAoGAP/QuMDCxB30PYRLlgvv5\nF6fJgUPWm2E5iAkabR2qQ4p0jyOCsBVf12VkG+jzdPsdsnINN53mJ5hxYEH5gHPi\nwnO61tvgI0/By18i6E0SRdKfBtKSNMKlKfnwKp8dzKtyWrYyFlUC9dOh6NFlb1jH\nb5fVt3ichK1pnPGtRzk02Yk=\n-----END PRIVATE KEY-----`;

function cleanPrivateKey(key?: string): string | undefined {
  if (!key) return undefined;
  let clean = key.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.substring(1, clean.length - 1);
  }
  return clean.replace(/\\n/g, '\n');
}

// Set up Firebase Admin SDK
let admin: any = null;
let firestore: any = null;
let useFirestore = false;

try {
  admin = require('firebase-admin');
  
  let projectId = process.env.FIREBASE_PROJECT_ID || CERAMIC_PROJECT_ID;
  let clientEmail = process.env.FIREBASE_CLIENT_EMAIL || CERAMIC_CLIENT_EMAIL;
  let privateKey = cleanPrivateKey(process.env.FIREBASE_PRIVATE_KEY) || CERAMIC_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    const filenameParts = ['serviceAccountKey', 'json'];
    const serviceAccountPath = path.resolve(process.cwd(), filenameParts.join('.'));
    if (fs.existsSync(serviceAccountPath)) {
      try {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        if (serviceAccount.project_id && serviceAccount.client_email && serviceAccount.private_key) {
          projectId = serviceAccount.project_id;
          clientEmail = serviceAccount.client_email;
          privateKey = cleanPrivateKey(serviceAccount.private_key) || CERAMIC_PRIVATE_KEY;
        }
      } catch (e: any) {}
    }
  }

  if (!admin.apps.length) {
    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
      });
      console.log('🔥 Initialized Firebase Admin SDK successfully.');
    } else if (process.env.FIRESTORE_EMULATOR_HOST) {
      admin.initializeApp({
        projectId: projectId || 'demo-project',
      });
    }
  }

  if (admin.apps.length) {
    firestore = admin.firestore();
    useFirestore = true;
    console.log('🔥 Connected to Firebase Firestore in the Cloud.');
  }
} catch (err: any) {
  console.warn('⚠️ Could not load firebase-admin or initialize:', err.message || err);
}

// Local file database fallback engine (Serverless Safe)
class LocalFileDb {
  private filePath: string;
  private data: Record<string, any[]> = {};
  private lastMtime = 0;
  private lastCheckTime = 0;

  constructor() {
    const isVercel = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION);
    const envPath = process.env.DATABASE_PATH;
    
    if (envPath) {
      this.filePath = path.resolve(envPath);
    } else if (isVercel) {
      // Vercel serverless runtime: use writable /tmp folder
      this.filePath = path.join(os.tmpdir(), 'ceramic_bazaar_mock.json');
      try {
        if (!fs.existsSync(this.filePath)) {
          const localSeed = path.resolve(process.cwd(), 'firebase-mock.json');
          if (fs.existsSync(localSeed)) {
            fs.copyFileSync(localSeed, this.filePath);
          }
        }
      } catch (err) {
        this.filePath = path.resolve(process.cwd(), 'firebase-mock.json');
      }
    } else {
      this.filePath = path.resolve(process.cwd(), 'firebase-mock.json');
    }
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(content);
      } else {
        const rootMock = path.resolve(process.cwd(), 'firebase-mock.json');
        if (fs.existsSync(rootMock)) {
          this.data = JSON.parse(fs.readFileSync(rootMock, 'utf8'));
        } else {
          this.data = {};
        }
      }
    } catch (e) {
      this.data = {};
    }
  }

  private save() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e: any) {
      // Non-fatal on serverless
    }
  }

  getCollection(name: string): any[] {
    if (!this.data[name]) {
      this.load();
    }
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }

  saveCollection(name: string, items: any[]) {
    this.data[name] = items;
    this.save();
  }
}

const localDb = new LocalFileDb();

// Helper database operations
async function getCollectionDocs(collectionName: string): Promise<any[]> {
  if (useFirestore && firestore) {
    try {
      const snapshot = await firestore.collection(collectionName).get();
      return snapshot.docs.map((doc: any) => {
        const data = doc.data();
        // Convert any Firestore Timestamps to ISO strings
        const cleaned: any = { id: doc.id };
        for (const k of Object.keys(data)) {
          if (data[k] && typeof data[k] === 'object' && typeof data[k].toDate === 'function') {
            cleaned[k] = data[k].toDate().toISOString();
          } else {
            cleaned[k] = data[k];
          }
        }
        return cleaned;
      });
    } catch (e) {
      console.error(`Firestore fetch error on ${collectionName}, falling back to local:`, e);
      return localDb.getCollection(collectionName).map((item: any) => ({ ...item }));
    }
  } else {
    // Return shallow copies so relational includes don't pollute the in-memory master collection
    return localDb.getCollection(collectionName).map((item: any) => ({ ...item }));
  }
}

async function getDoc(collectionName: string, id: string): Promise<any | null> {
  if (useFirestore && firestore) {
    try {
      const doc = await firestore.collection(collectionName).doc(id).get();
      if (!doc.exists) return null;
      const data = doc.data();
      const cleaned: any = { id: doc.id };
      for (const k of Object.keys(data)) {
        if (data[k] && typeof data[k] === 'object' && typeof data[k].toDate === 'function') {
          cleaned[k] = data[k].toDate().toISOString();
        } else {
          cleaned[k] = data[k];
        }
      }
      return cleaned;
    } catch (e) {
      console.error(`Firestore fetch error on ${collectionName}/${id}, falling back:`, e);
    }
  }
  const items = await getCollectionDocs(collectionName);
  return items.find(item => item.id === id) || null;
}

async function saveDoc(collectionName: string, id: string, data: any) {
  if (useFirestore && firestore) {
    try {
      // Remove undefined values to prevent firestore validation errors
      const cleanData: any = {};
      for (const k of Object.keys(data)) {
        if (data[k] !== undefined && k !== 'id') {
          cleanData[k] = data[k];
        }
      }
      await firestore.collection(collectionName).doc(id).set(cleanData, { merge: true });
      return;
    } catch (e) {
      console.error(`Firestore set error on ${collectionName}/${id}:`, e);
      throw e;
    }
  }
  const rawItems = localDb.getCollection(collectionName);
  const index = rawItems.findIndex(item => item.id === id);
  if (index >= 0) {
    rawItems[index] = { ...rawItems[index], ...data };
  } else {
    rawItems.push({ id, ...data });
  }
  localDb.saveCollection(collectionName, rawItems);
}

async function deleteDoc(collectionName: string, id: string) {
  if (useFirestore && firestore) {
    try {
      await firestore.collection(collectionName).doc(id).delete();
      return;
    } catch (e) {
      console.error(`Firestore delete error on ${collectionName}/${id}:`, e);
      throw e;
    }
  }
  const rawItems = localDb.getCollection(collectionName);
  const updated = rawItems.filter(item => item.id !== id);
  localDb.saveCollection(collectionName, updated);
}

// Generate a unique ID (similar to Prisma cuid)
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Filtering Helper
function matchesFilter(item: any, where: any): boolean {
  if (!where) return true;
  for (const key of Object.keys(where)) {
    const filterVal = where[key];
    if (filterVal === undefined) continue;

    // Handle Prisma specific unique composite keys
    if (key === 'userId_productId' && filterVal) {
      if (item.userId !== filterVal.userId || item.productId !== filterVal.productId) {
        return false;
      }
      continue;
    }

    if (key === 'OR' && Array.isArray(filterVal)) {
      const orMatches = filterVal.some(subWhere => matchesFilter(item, subWhere));
      if (!orMatches) return false;
      continue;
    }
    
    const itemVal = item[key];
    
    if (filterVal && typeof filterVal === 'object' && !Array.isArray(filterVal)) {
      if ('contains' in filterVal) {
        const query = String(filterVal.contains);
        const mode = filterVal.mode;
        const subject = String(itemVal ?? '');
        if (mode === 'insensitive') {
          if (!subject.toLowerCase().includes(query.toLowerCase())) return false;
        } else {
          if (!subject.includes(query)) return false;
        }
      }
      
      const getNumericValue = (val: any): number => {
        if (val instanceof Date) return val.getTime();
        if (typeof val === 'string') {
          if (val.includes('T') && val.includes('Z')) {
            const parsed = Date.parse(val);
            if (!isNaN(parsed)) return parsed;
          }
          const num = Number(val);
          if (!isNaN(num)) return num;
          const parsed = Date.parse(val);
          if (!isNaN(parsed)) return parsed;
        }
        return Number(val);
      };

      const itemNum = getNumericValue(itemVal);
      if ('gte' in filterVal && itemNum < getNumericValue(filterVal.gte)) return false;
      if ('lte' in filterVal && itemNum > getNumericValue(filterVal.lte)) return false;
      if ('gt' in filterVal && itemNum <= getNumericValue(filterVal.gt)) return false;
      if ('lt' in filterVal && itemNum >= getNumericValue(filterVal.lt)) return false;
      if ('in' in filterVal && Array.isArray(filterVal.in)) {
        if (!filterVal.in.includes(itemVal)) return false;
      }
      if ('not' in filterVal && itemVal === filterVal.not) return false;
    } else {
      if (key === 'email' && typeof itemVal === 'string' && typeof filterVal === 'string') {
        if (itemVal.toLowerCase() !== filterVal.toLowerCase()) return false;
      } else if (itemVal !== filterVal) {
        return false;
      }
    }
  }
  return true;
}

// Sorting Helper
function sortItems(items: any[], orderBy: any) {
  if (!orderBy) return;
  const sortRules = Array.isArray(orderBy) ? orderBy : [orderBy];
  
  items.sort((a, b) => {
    for (const rule of sortRules) {
      const field = Object.keys(rule)[0];
      const direction = rule[field]; // "asc" or "desc"
      
      let valA = a[field];
      let valB = b[field];
      
      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';
      
      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

// Select Helper
function applySelect(item: any, select: any) {
  if (!select) return item;
  const result: any = {};
  for (const key of Object.keys(select)) {
    if (select[key]) {
      result[key] = item[key];
    }
  }
  return result;
}

// Relationship Inclusion Helper
async function resolveIncludes(items: any[], include: any, modelName: string) {
  if (!include || items.length === 0) return;
  
  if (modelName === 'product') {
    if (include.category) {
      const categories = await getCollectionDocs('categories');
      const catMap = new Map(categories.map(c => [c.id, c]));
      for (const item of items) {
        item.category = catMap.get(item.categoryId) || null;
      }
    }
    if (include.reviews) {
      const reviews = await getCollectionDocs('reviews');
      const users = await getCollectionDocs('users');
      const userMap = new Map(users.map(u => [u.id, u]));
      
      const reviewsByProduct = new Map<string, any[]>();
      for (const r of reviews) {
        let list = reviewsByProduct.get(r.productId);
        if (!list) {
          list = [];
          reviewsByProduct.set(r.productId, list);
        }
        const revCopy = { ...r };
        if (include.reviews.include?.user) {
          const reviewer = userMap.get(revCopy.userId);
          revCopy.user = reviewer ? { fullName: reviewer.fullName } : { fullName: "Anonymous User" };
        }
        list.push(revCopy);
      }
      
      for (const item of items) {
        const prodReviews = reviewsByProduct.get(item.id) || [];
        prodReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const takeLimit = typeof include.reviews.take === 'number' ? include.reviews.take : undefined;
        item.reviews = takeLimit !== undefined ? prodReviews.slice(0, takeLimit) : prodReviews;
      }
    }
    if (include.variants) {
      const variants = await getCollectionDocs('productVariants');
      const varsByProduct = new Map<string, any[]>();
      for (const v of variants) {
        let list = varsByProduct.get(v.productId);
        if (!list) {
          list = [];
          varsByProduct.set(v.productId, list);
        }
        list.push(v);
      }
      for (const item of items) {
        item.variants = varsByProduct.get(item.id) || [];
      }
    }
  }

  if (modelName === 'review' && include.user) {
    const users = await getCollectionDocs('users');
    const userMap = new Map(users.map(u => [u.id, u]));
    for (const item of items) {
      const reviewer = userMap.get(item.userId);
      item.user = reviewer ? { fullName: reviewer.fullName } : { fullName: "Anonymous User" };
    }
  }
  
  if (modelName === 'category' && include._count?.select?.products) {
    const products = await getCollectionDocs('products');
    const counts = new Map<string, number>();
    for (const p of products) {
      if (p.categoryId) {
        counts.set(p.categoryId, (counts.get(p.categoryId) || 0) + 1);
      }
    }
    for (const item of items) {
      item._count = { products: counts.get(item.id) || 0 };
    }
  }
  
  if ((modelName === 'cartItem' || modelName === 'wishlistItem' || modelName === 'orderItem') && include.product) {
    const products = await getCollectionDocs('products');
    const categories = await getCollectionDocs('categories');
    const catMap = new Map(categories.map(c => [c.id, c]));
    const prodMap = new Map(products.map(p => {
      const pCopy = { ...p };
      if (pCopy.categoryId) pCopy.category = catMap.get(pCopy.categoryId) || null;
      return [p.id, pCopy];
    }));
    for (const item of items) {
      item.product = prodMap.get(item.productId) || null;
    }
  }

  if (modelName === 'order') {
    if (include.items) {
      const orderItems = await getCollectionDocs('orderItems');
      const itemsByOrder = new Map<string, any[]>();
      for (const oi of orderItems) {
        let list = itemsByOrder.get(oi.orderId);
        if (!list) {
          list = [];
          itemsByOrder.set(oi.orderId, list);
        }
        list.push(oi);
      }
      for (const item of items) {
        item.items = itemsByOrder.get(item.id) || [];
      }
    }
    if (include.tracking) {
      const orderTrackings = await getCollectionDocs('orderTrackings');
      const trackingByOrder = new Map<string, any[]>();
      for (const ot of orderTrackings) {
        let list = trackingByOrder.get(ot.orderId);
        if (!list) {
          list = [];
          trackingByOrder.set(ot.orderId, list);
        }
        list.push(ot);
      }
      for (const item of items) {
        const list = trackingByOrder.get(item.id) || [];
        list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(a.createdAt).getTime());
        item.tracking = list;
      }
    }
    if (include.address) {
      const addresses = await getCollectionDocs('addresses');
      const addrMap = new Map(addresses.map(a => [a.id, a]));
      for (const item of items) {
        item.address = addrMap.get(item.addressId) || null;
      }
    }
    if (include.user) {
      const users = await getCollectionDocs('users');
      const userMap = new Map(users.map(u => [u.id, u]));
      for (const item of items) {
        item.user = userMap.get(item.userId) || null;
      }
    }
  }
}

// Wrapper for Prisma Client Compatibility
class ModelWrapper {
  constructor(private collectionName: string, private modelName: string) {}

  async findMany(args: any = {}) {
    let items = await getCollectionDocs(this.collectionName);
    
    // Filter
    if (args.where) {
      items = items.filter(item => matchesFilter(item, args.where));
    }
    
    // Sort
    if (args.orderBy) {
      sortItems(items, args.orderBy);
    }
    
    // Take / Limit
    if (typeof args.take === 'number') {
      items = items.slice(0, args.take);
    }
    
    // Include relationships
    if (args.include) {
      await resolveIncludes(items, args.include, this.modelName);
    }
    
    // Select fields
    if (args.select) {
      items = items.map(item => applySelect(item, args.select));
    }
    
    return items;
  }

  async findUnique(args: any) {
    if (args.where && args.where.id) {
      const doc = await getDoc(this.collectionName, args.where.id);
      if (!doc) return null;
      
      const items = [doc];
      if (args.include) {
        await resolveIncludes(items, args.include, this.modelName);
      }
      return args.select ? applySelect(items[0], args.select) : items[0];
    }
    
    // Composite key match OR other query matching
    const items = await this.findMany(args);
    return items.length > 0 ? items[0] : null;
  }

  async findFirst(args: any = {}) {
    const items = await this.findMany(args);
    return items.length > 0 ? items[0] : null;
  }

  async count(args: any = {}) {
    let items = await getCollectionDocs(this.collectionName);
    if (args.where) {
      items = items.filter(item => matchesFilter(item, args.where));
    }
    return items.length;
  }

  async create(args: any) {
    const id = args.data.id || generateId();
    const now = new Date().toISOString();
    
    // Extract relations
    const dataWithoutRelations: any = {};
    const nestedRelations: any = {};
    
    for (const key of Object.keys(args.data)) {
      const val = args.data[key];
      if (val && typeof val === 'object' && val.create !== undefined) {
        nestedRelations[key] = val.create;
      } else {
        dataWithoutRelations[key] = val;
      }
    }

    const docData = {
      id,
      createdAt: now,
      updatedAt: now,
      ...dataWithoutRelations,
    };
    
    await saveDoc(this.collectionName, id, docData);

    // Save nested relations
    for (const key of Object.keys(nestedRelations)) {
      const relationData = nestedRelations[key];
      const itemsToCreate = Array.isArray(relationData) ? relationData : [relationData];
      
      if (this.modelName === 'order' && key === 'items') {
        const orderItemWrapper = prisma.orderItem;
        for (const item of itemsToCreate) {
          await orderItemWrapper.create({
            data: {
              ...item,
              orderId: id,
            }
          });
        }
      }
      
      if (this.modelName === 'order' && key === 'tracking') {
        const orderTrackingWrapper = prisma.orderTracking;
        for (const item of itemsToCreate) {
          await orderTrackingWrapper.create({
            data: {
              ...item,
              orderId: id,
            }
          });
        }
      }
    }
    
    const items = [docData];
    if (args.include) {
      await resolveIncludes(items, args.include, this.modelName);
    }
    return args.select ? applySelect(items[0], args.select) : items[0];
  }

  async update(args: any) {
    const existing = await this.findUnique({ where: args.where });
    if (!existing) {
      throw new Error(`Record to update not found in ${this.modelName}.`);
    }
    
    const now = new Date().toISOString();
    const updatedData = {
      ...existing,
      ...args.data,
      updatedAt: now,
    };
    
    for (const key of Object.keys(updatedData)) {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    }
    
    await saveDoc(this.collectionName, existing.id, updatedData);
    
    const items = [updatedData];
    if (args.include) {
      await resolveIncludes(items, args.include, this.modelName);
    }
    return args.select ? applySelect(items[0], args.select) : items[0];
  }

  async updateMany(args: any) {
    let items = await getCollectionDocs(this.collectionName);
    if (args.where) {
      items = items.filter(item => matchesFilter(item, args.where));
    }
    
    const now = new Date().toISOString();
    let count = 0;
    for (const item of items) {
      const updatedData = {
        ...item,
        ...args.data,
        updatedAt: now,
      };
      await saveDoc(this.collectionName, item.id, updatedData);
      count++;
    }
    return { count };
  }

  async delete(args: any) {
    const existing = await this.findUnique({ where: args.where });
    if (!existing) {
      throw new Error(`Record to delete not found in ${this.modelName}.`);
    }
    
    await deleteDoc(this.collectionName, existing.id);
    return existing;
  }

  async deleteMany(args: any = {}) {
    let items = await getCollectionDocs(this.collectionName);
    if (args.where) {
      items = items.filter(item => matchesFilter(item, args.where));
    }
    
    let count = 0;
    for (const item of items) {
      await deleteDoc(this.collectionName, item.id);
      count++;
    }
    return { count };
  }

  async upsert(args: any) {
    const existing = await this.findUnique({ where: args.where });
    if (existing) {
      return this.update({
        where: { id: existing.id },
        data: args.update,
      });
    } else {
      const createData = { ...args.create };
      if (args.where.email && !createData.email) {
        createData.email = args.where.email;
      }
      if (args.where.slug && !createData.slug) {
        createData.slug = args.where.slug;
      }
      return this.create({ data: createData });
    }
  }

  async aggregate(args: any) {
    const items = await this.findMany();
    const result: any = {};
    if (args._sum) {
      result._sum = {};
      for (const field of Object.keys(args._sum)) {
        if (args._sum[field]) {
          const sumVal = items.reduce((acc, item) => acc + (Number(item[field]) || 0), 0);
          result._sum[field] = sumVal;
        }
      }
    }
    return result;
  }
}

// Expose mock client object mimicking Prisma Client
export const prisma = {
  user: new ModelWrapper('users', 'user'),
  category: new ModelWrapper('categories', 'category'),
  product: new ModelWrapper('products', 'product'),
  productVariant: new ModelWrapper('productVariants', 'productVariant'),
  address: new ModelWrapper('addresses', 'address'),
  cartItem: new ModelWrapper('cartItems', 'cartItem'),
  wishlistItem: new ModelWrapper('wishlistItems', 'wishlistItem'),
  order: new ModelWrapper('orders', 'order'),
  orderItem: new ModelWrapper('orderItems', 'orderItem'),
  orderTracking: new ModelWrapper('orderTrackings', 'orderTracking'),
  supportTicket: new ModelWrapper('supportTickets', 'supportTicket'),
  coupon: new ModelWrapper('coupons', 'coupon'),
  pushToken: new ModelWrapper('pushTokens', 'pushToken'),
  review: new ModelWrapper('reviews', 'review'),
  stockAlert: new ModelWrapper('stockAlerts', 'stockAlert'),
  banner: new ModelWrapper('banners', 'banner'),
  
  $disconnect: async () => {
    // No-op for Firestore/LocalDB
  }
};

export { admin as firebaseAdmin, useFirestore };
