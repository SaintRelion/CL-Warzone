const { getDb } = require('../config/firebase');

/**
 * Generic Firestore CRUD operations helper
 */
class FirestoreService {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  get collection() {
    return getDb().collection(this.collectionName);
  }

  /**
   * Create a new document
   */
  async create(data) {
    const docRef = await this.collection.add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Create a document with a specific ID
   */
  async createWithId(id, data) {
    await this.collection.doc(id).set({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id, ...data };
  }

  /**
   * Get a document by ID
   */
  async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Get all documents with optional query parameters
   */
  async findAll(options = {}) {
    const { 
      where = [], 
      orderBy = null, 
      limit = null, 
      offset = null,
      orderDirection = 'desc'
    } = options;

    let query = this.collection;

    // Apply where clauses
    for (const [field, operator, value] of where) {
      query = query.where(field, operator, value);
    }

    // Apply ordering
    if (orderBy) {
      query = query.orderBy(orderBy, orderDirection);
    }

    // Apply offset (startAfter for pagination)
    if (offset && offset > 0) {
      // For simple offset, we need to get all and slice
      // For production, use cursor-based pagination
    }

    // Apply limit
    if (limit) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();
    const docs = [];
    snapshot.forEach(doc => {
      docs.push({ id: doc.id, ...doc.data() });
    });

    return docs;
  }

  /**
   * Find documents with pagination
   */
  async findWithPagination(options = {}) {
    const {
      where = [],
      orderBy = 'createdAt',
      orderDirection = 'desc',
      page = 1,
      limit = 20
    } = options;

    // Get total count
    let countQuery = this.collection;
    for (const [field, operator, value] of where) {
      countQuery = countQuery.where(field, operator, value);
    }
    const countSnapshot = await countQuery.count().get();
    const total = countSnapshot.data().count;

    // Get paginated data
    let query = this.collection;
    for (const [field, operator, value] of where) {
      query = query.where(field, operator, value);
    }
    
    query = query.orderBy(orderBy, orderDirection);
    
    // Calculate offset
    const offset = (page - 1) * limit;
    if (offset > 0) {
      query = query.offset(offset);
    }
    query = query.limit(limit);

    const snapshot = await query.get();
    const docs = [];
    snapshot.forEach(doc => {
      docs.push({ id: doc.id, ...doc.data() });
    });

    return {
      data: docs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update a document
   */
  async update(id, data) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) return null;

    await docRef.update({
      ...data,
      updatedAt: new Date().toISOString()
    });

    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  }

  /**
   * Delete a document
   */
  async delete(id) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) return false;

    await docRef.delete();
    return true;
  }

  /**
   * Find one document by query
   */
  async findOne(where = []) {
    let query = this.collection;
    
    for (const [field, operator, value] of where) {
      query = query.where(field, operator, value);
    }
    
    query = query.limit(1);
    
    const snapshot = await query.get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Count documents
   */
  async count(where = []) {
    let query = this.collection;
    
    for (const [field, operator, value] of where) {
      query = query.where(field, operator, value);
    }
    
    const snapshot = await query.count().get();
    return snapshot.data().count;
  }

  /**
   * Aggregate sum of a field
   */
  async sum(field, where = []) {
    let query = this.collection;
    
    for (const [fieldName, operator, value] of where) {
      query = query.where(fieldName, operator, value);
    }
    
    const snapshot = await query.get();
    let total = 0;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data[field]) {
        total += Number(data[field]) || 0;
      }
    });
    
    return total;
  }
}

module.exports = FirestoreService;
