// fixReview.js
// Run this from your backend folder with: node fixReview.js
require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./models/Review');
const Product = require('./models/Product');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // 1. Find the review by its comment text
  const review = await Review.findOne({ comment: /very good product/i });

  if (!review) {
    console.log('❌ No review found with that comment. Check the text matches exactly.');
    process.exit(0);
  }

  console.log('✅ Found review:');
  console.log('   Review ID:', review._id.toString());
  console.log('   Review status:', review.status);
  console.log('   Review is attached to product ID:', review.product.toString());

  // 2. Find the real product by name
  const product = await Product.findOne({ name: /Turbo Solid Colors/i });

  if (!product) {
    console.log('❌ No product found matching "Turbo Solid Colors". Check the product name in your DB.');
    process.exit(0);
  }

  console.log('✅ Found product:');
  console.log('   Product ID:', product._id.toString());
  console.log('   Product name:', product.name);

  // 3. Compare
  if (review.product.toString() === product._id.toString()) {
    console.log('\n🟢 IDs MATCH. The review is correctly linked. The bug is something else — report this back.');
  } else {
    console.log('\n🔴 IDs DO NOT MATCH. Fixing now...');
    review.product = product._id;
    await review.save();
    console.log('✅ Fixed! Review is now linked to the correct product.');
  }

  // 4. Also confirm status is approved
  if (review.status !== 'approved') {
    console.log(`⚠️ Note: review status is currently "${review.status}", not "approved". Approve it again in the admin panel if needed.`);
  }

  process.exit(0);
};

run().catch((err) => {
  console.error('Script error:', err);s
  process.exit(1);
});