import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// ============================================================================
// AUTO-SCROLL CONTROLLER
// ============================================================================
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

// ============================================================================
// EAGER IMPORTS: only what every page needs immediately
// ============================================================================
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import BottomNav from "./components/layout/BottomNav";
import LiveActivity from "./components/common/LiveActivity";
import AdminRoute from "./components/common/AdminRoute";
import PrivateRoute from "./components/common/PrivateRoute";
import PublicOnlyRoute from "./components/common/PublicOnlyRoute";
import Home from "./pages/Home";

// ============================================================================
// LAZY IMPORTS: loaded only when the route is visited
// ============================================================================
// Admin layout pieces (customers never download these)
const AdminSidebar = lazy(() => import("./components/admin/AdminSidebar"));
const AdminHeader = lazy(() => import("./components/admin/AdminHeader"));

// Storefront
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetail"));
const CartPage = lazy(() => import("./pages/Cart"));
const CheckoutPage = lazy(() => import("./pages/Checkout"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmation"));
const TrackOrderPage = lazy(() => import("./pages/TrackOrder"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPassword"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ServiceAppointment = lazy(() => import("./pages/ServiceAppointment"));

// Auth
const LoginPage = lazy(() => import("./pages/Login"));
const RegisterPage = lazy(() => import("./pages/Register"));

// Account
const MyProfilePage = lazy(() => import("./pages/account/MyProfilePage"));
const MyOrdersPage = lazy(() => import("./pages/account/MyOrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/account/OrderDetailPage"));
const WishlistPage = lazy(() => import("./pages/account/WishlistPage"));
const SavedAddressesPage = lazy(() => import("./pages/account/SavedAddressesPage"));
const LoyaltyPointsPage = lazy(() => import("./pages/account/LoyaltyPointsPage"));

// Admin
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProductsList = lazy(() => import("./pages/admin/AdminProductsList"));
const AdminAddProduct = lazy(() => import("./pages/admin/AdminAddProduct"));
const AdminEditProduct = lazy(() => import("./pages/admin/AdminEditProduct"));
const AdminOrdersList = lazy(() => import("./pages/admin/AdminOrdersList"));
const AdminOrderDetail = lazy(() => import("./pages/admin/AdminOrderDetail"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminNotifyMe = lazy(() => import("./pages/admin/AdminNotifyMe"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminBundles = lazy(() => import("./pages/admin/AdminBundles"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminServiceAppointments = lazy(() => import("./pages/admin/AdminServiceAppointments"));
const AdminHomepageEditor = lazy(() => import("./pages/admin/AdminHomepageEditor"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminMediaLibrary = lazy(() => import("./pages/admin/AdminMediaLibrary"));
const AdminContentEditor = lazy(() => import("./pages/admin/AdminContentEditor"));
const AdminReferrals = lazy(() => import("./pages/admin/AdminReferrals"));
const AdminLoyalty = lazy(() => import("./pages/admin/AdminLoyalty"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));

// Policies
const PrivacyPolicyPage = lazy(() => import("./pages/policies/PrivacyPolicyPage"));
const TermsConditionsPage = lazy(() => import("./pages/policies/TermsConditionsPage"));
const ShippingPolicyPage = lazy(() => import("./pages/policies/ShippingPolicyPage"));
const ReturnPolicyPage = lazy(() => import("./pages/policies/ReturnPolicyPage"));

// ============================================================================
// LOADING FALLBACK
// ============================================================================
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-border-dark border-t-primary-gold rounded-full animate-spin" />
  </div>
);

// ============================================================================
// LAYOUT CONTROLLER
// ============================================================================
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isAdminLogin = location.pathname === "/admin/login";

  if (isAdminPath && !isAdminLogin) {
    return (
      <div className="flex h-screen bg-deep-black overflow-hidden font-body text-xs text-muted-gray select-none">
        <Suspense fallback={<div className="w-64 bg-card-dark" />}>
          <AdminSidebar />
        </Suspense>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Suspense fallback={<div className="h-16 bg-card-dark" />}>
            <AdminHeader />
          </Suspense>
          <main className="flex-grow overflow-y-auto px-6 py-8 md:px-10 bg-deep-black">
            {children}
          </main>
        </div>
      </div>
    );
  }

  if (isAdminLogin || location.pathname === "/login" || location.pathname === "/register") {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-deep-black">
        {children}
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black font-body text-pure-white select-none relative">
      <Header />
      <main className="flex-grow pb-16 md:pb-8">{children}</main>
      <LiveActivity />
      <Footer />
      <BottomNav />
    </div>
  );
};

// ============================================================================
// APP ROOT
// ============================================================================
function App() {
  return (
    <Router>
      <ScrollToTop />
      <LayoutWrapper>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:categorySlug" element={<CategoryPage />} />
            <Route path="/product/:productSlug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/track" element={<TrackOrderPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/service" element={<ServiceAppointment />} />

            {/* Auth */}
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Checkout */}
            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/order-confirmation" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} />

            {/* Account */}
            <Route path="/account/profile" element={<PrivateRoute><MyProfilePage /></PrivateRoute>} />
            <Route path="/account/orders" element={<PrivateRoute><MyOrdersPage /></PrivateRoute>} />
            <Route path="/account/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
            <Route path="/account/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
            <Route path="/account/addresses" element={<PrivateRoute><SavedAddressesPage /></PrivateRoute>} />
            <Route path="/account/points" element={<PrivateRoute><LoyaltyPointsPage /></PrivateRoute>} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProductsList /></AdminRoute>} />
            <Route path="/admin/products/add" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
            <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminEditProduct /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrdersList /></AdminRoute>} />
            <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
            <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
            <Route path="/admin/notify-me" element={<AdminRoute><AdminNotifyMe /></AdminRoute>} />
            <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
            <Route path="/admin/bundles" element={<AdminRoute><AdminBundles /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
            <Route path="/admin/loyalty" element={<AdminRoute><AdminLoyalty /></AdminRoute>} />
            <Route path="/admin/referrals" element={<AdminRoute><AdminReferrals /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
            <Route path="/admin/homepage" element={<AdminRoute><AdminHomepageEditor /></AdminRoute>} />
            <Route path="/admin/media" element={<AdminRoute><AdminMediaLibrary /></AdminRoute>} />
            <Route path="/admin/content" element={<AdminRoute><AdminContentEditor /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/service-appointments" element={<AdminRoute><AdminServiceAppointments /></AdminRoute>} />

            {/* Policies */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/return-refund-policy" element={<ReturnPolicyPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </LayoutWrapper>
    </Router>
  );
}

export default App;