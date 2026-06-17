const files = ['authRoutes','categoryRoutes','productRoutes','orderRoutes','paymentRoutes','bikeRoutes','couponRoutes','bundleRoutes','notifyMeRoutes','reviewRoutes','activityRoutes','trackRoutes','uploadRoutes'];
files.forEach(f => {
  try {
    const r = require('./routes/' + f);
    console.log(f, '->', typeof r);
  } catch(e) {
    console.log(f, '-> ERROR:', e.message);
  }
});