const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
require('dotenv').config();

dns.setServers(['8.8.8.8', '1.1.1.1']);

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB!');
    try {
      // Delete the old admin if it exists
      await User.deleteOne({ username: 'admin' });
      console.log('🗑️ Old admin user deleted (if there was one).');

      // Create the new admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({ username: 'admin', password: hashedPassword });
      
      console.log('✅ SUCCESS: Admin user created! Username: admin, Password: admin123');
    } catch (err) {
      console.error('❌ Error creating user:', err);
    } finally {
      mongoose.connection.close();
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });