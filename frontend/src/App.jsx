import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// ============================================================================
// 🔄 AUTOMATED NAVIGATION AUTO-SCROLL CONTROLLER
// ============================================================================
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Forces immediate viewport reset across structural routing shifts
    });
  }, [pathname]);

  return null;
};

// ============================================================================
// 📦 GLOBAL LAYOUT STRUCTURAL UTILITIES & SIDE WINDOWS
// ============================================================================
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import BottomNav from "./components/layout/BottomNav";
import AdminSidebar from "./components/admin/AdminSidebar";
import AdminHeader from "./components/admin/AdminHeader"; 
import LiveActivity from "./components/common/LiveActivity";

// ============================================================================
// 🔒 SECURED ACCESS ROUTE SECURITY INTERCEPTORS
// ============================================================================
import AdminRoute from "./components/common/AdminRoute";
import PrivateRoute from "./components/common/PrivateRoute";
import PublicOnlyRoute from "./components/common/PublicOnlyRoute";

// ============================================================================
// 🛒 1. MAIN STOREFRONT GENERAL PAGE IMPORTS (FLAT PAGES)
// ============================================================================
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetailPage from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmation";
import TrackOrderPage from "./pages/TrackOrder";
import SearchPage from "./pages/SearchPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import FAQPage from "./pages/FAQPage";
import CategoryPage from "./pages/CategoryPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound"; 

// ============================================================================
// 🔑 2. RIDER AUTHENTICATION SECURITY PATH IMPORTS
// ============================================================================
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

// ============================================================================
// 👤 3. RIDER ACCOUNT PORTAL IMPORTS (src/pages/account/)
// ============================================================================
import GaragePage from "./pages/account/Garage";
import MyProfilePage from "./pages/account/MyProfilePage";
import MyOrdersPage from "./pages/account/MyOrdersPage";
import OrderDetailPage from "./pages/account/OrderDetailPage";
import WishlistPage from "./pages/account/WishlistPage";
import SavedAddressesPage from "./pages/account/SavedAddressesPage";
import LoyaltyPointsPage from "./pages/account/LoyaltyPointsPage";

// ============================================================================
// ⚙️ 4. ADMINISTRATIVE TERMINAL IMPORTS (src/pages/admin/)
// ============================================================================
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductsList from "./pages/admin/AdminProductsList";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminOrdersList from "./pages/admin/AdminOrdersList";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminNotifyMe from "./pages/admin/AdminNotifyMe";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminBundles from "./pages/admin/AdminBundles";
import AdminSettings from "./pages/admin/AdminSettings";

// Sourced back-office custom control panel views
import AdminHomepageEditor from "./pages/admin/AdminHomepageEditor";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminReports from "./pages/admin/AdminReports";
import AdminMediaLibrary from "./pages/admin/AdminMediaLibrary";
import AdminContentEditor from "./pages/admin/AdminContentEditor";
import AdminReferrals from "./pages/admin/AdminReferrals";
import AdminLoyalty from "./pages/admin/AdminLoyalty";
import AdminCategories from "./pages/admin/AdminCategories"; 

// ============================================================================
// 📜 5. COMPLIANCE LEGAL POLICY IMPORTS (src/pages/policies/)
// ============================================================================
import PrivacyPolicyPage from "./pages/policies/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/policies/TermsConditionsPage";
import ShippingPolicyPage from "./pages/policies/ShippingPolicyPage";
import ReturnPolicyPage from "./pages/policies/ReturnPolicyPage";

// ============================================================================
// 📐 DYNAMIC MASTER LAYOUT CONTROLLER LAYER
// ============================================================================
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isAdminLogin = location.pathname === "/admin/login";

  if (isAdminPath && !isAdminLogin) {
    return (
      <div className="flex h-screen bg-deep-black overflow-hidden font-body text-xs text-muted-gray select-none">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-grow overflow-y-auto px-6 py-8 md:px-10 bg-deep-black">
            {children}
          </main>
        </div>
      </div>
    );
  }

  if (isAdminLogin || location.pathname === "/login" || location.pathname === "/register") {
    return <main className="w-full min-h-screen flex items-center justify-center bg-deep-black">{children}</main>;
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
// 🚀 CENTRAL APP INITIALIZATION ROOT TERMINAL
// ============================================================================
function App() {
  return (
    <Router>
      {/* 🔥 SCROLL INTERCEPTOR PLACED DIRECTLY UNDER ROUTER CONTEXT */}
      <ScrollToTop />
      <LayoutWrapper>
        <Routes>
          {/* 🛒 PUBLIC CUSTOMER ACCESSIBLE ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:categorySlug" element={<CategoryPage />} />
          
          {/* Unified dynamic parameter routing tunnel using productSlug strictly */}
          <Route path="/product/:productSlug" element={<ProductDetailPage />} />
          
          <Route path="/cart" element={<CartPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* 🔑 VALIDATION ACCESS ENTRY GATEWAYS */}
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Secure Checkout Tunnel Handshake Steps */}
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/order-confirmation" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} />

          {/* 👤 AUTHENTICATED CUSTOMER PRIVATE WORKSPACE LOCKS */}
          <Route path="/account/garage" element={<PrivateRoute><GaragePage /></PrivateRoute>} />
          <Route path="/account/profile" element={<PrivateRoute><MyProfilePage /></PrivateRoute>} />
          <Route path="/account/orders" element={<PrivateRoute><MyOrdersPage /></PrivateRoute>} />
          <Route path="/account/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
          <Route path="/account/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
          <Route path="/account/addresses" element={<PrivateRoute><SavedAddressesPage /></PrivateRoute>} />
          <Route path="/account/points" element={<PrivateRoute><LoyaltyPointsPage /></PrivateRoute>} />

          {/* ============================================================================
              ⚙️ BACK-OFFICE ADMINISTRATIVE SECURE CHANNELS
              ============================================================================ */}
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

          {/* 📜 COMPLIANCE LEGAL DATA OVERVIEWS */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
          <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="/return-refund-policy" element={<ReturnPolicyPage />} />

          {/* Canvas screen redirect handling */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;