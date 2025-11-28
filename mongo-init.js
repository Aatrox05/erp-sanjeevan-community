// Initialize MongoDB database with users and collections
db = db.getSiblingDB('erp_sanjeevan');

// Create application user
db.createUser({
  user: 'erpsanjeevan',
  pwd: 'erpsanjeevan123',
  roles: [
    {
      role: 'readWrite',
      db: 'erp_sanjeevan'
    }
  ]
});

// Create collections
db.createCollection('users');
db.createCollection('leaves');
db.createCollection('notifications');
db.createCollection('events');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.leaves.createIndex({ applicantId: 1 });
db.leaves.createIndex({ department: 1 });
db.leaves.createIndex({ hodStatus: 1 });
db.leaves.createIndex({ adminStatus: 1 });
db.notifications.createIndex({ userId: 1 });
db.events.createIndex({ date: 1 });

console.log('✅ MongoDB initialized successfully!');
