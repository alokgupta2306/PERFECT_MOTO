import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  FolderTree, 
  Layers, 
  Sliders, 
  Percent, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Image, 
  FileText, 
  Award, 
  Share2, 
  Bell, 
  Settings, 
  LogOut 
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const AdminSidebar = () => {
  const location = useLocation();
  const { logoutUser } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Structural groupings dividing operations, marketing, infrastructure, and core settings
  const menuGroups = [
    {
      title: "Core Operations",
      items: [
        { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { label: "Orders Ledger", path: "/admin/orders", icon: ShoppingBag },
        { label: "Products Catalog", path: "/admin/products", icon: FolderTree },
        { label: "Add New Product", path: "/admin/products/add", icon: PlusCircle },
        { label: "Category Taxonomy", path: "/admin/categories", icon: Layers }
      ]
    },
    {
      title: "Marketing & Retention",
      items: [
        { label: "Voucher Coupons", path: "/admin/coupons", icon: Percent },
        { label: "Cross-Sell Bundles", path: "/admin/bundles", icon: Sliders },
        { label: "Loyalty Ledger", path: "/admin/loyalty", icon: Award },
        { label: "Referral Networks", path: "/admin/referrals", icon: Share2 }
      ]
    },
    {
      title: "Content & Moderation",
      items: [
        { label: "Homepage Canvas", path: "/admin/homepage", icon: Sliders },
        { label: "Review Moderation", path: "/admin/reviews", icon: MessageSquare },
        { label: "Waitlist Queues", path: "/admin/notify-me", icon: Bell },
        { label: "Media CDN Library", path: "/admin/media", icon: Image },
        { label: "Variable Workspace", path: "/admin/content", icon: FileText }
      ]
    },
    {
      title: "Infrastructure",
      items: [
        { label: "Financial Reports", path: "/admin/reports", icon: BarChart3 },
        { label: "Customer Profiles", path: "/admin/customers", icon: Users },
        { label: "System Controls", path: "/admin/settings", icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 h-screen bg-card-dark border-r border-border-dark flex flex-col justify-between shrink-0 font-heading select-none">
      {/* Sidebar Header Brand Shell */}
      <div className="p-6 border-b border-border-dark">
        <Link to="/admin" className="block">
          <span className="font-bold text-xl tracking-wider text-primary-gold">
            CORE<span className="text-pure-white font-light">COCKPIT</span>
          </span>
          <span className="block text-[9px] text-muted-gray uppercase tracking-widest mt-0.5 font-sans font-medium">
            PerfectMoto Back-Office v3.0
          </span>
        </Link>
      </div>

      {/* Navigation Groups Menu Scroller */}
      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin scrollbar-thumb-border-dark">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <h4 className="text-[10px] font-bold text-muted-gray uppercase tracking-widest pl-3 mb-2">
              {group.title}
            </h4>
            <nav className="space-y-0.5">
              {group.items.map((item, itemIdx) => {
                const IconComponent = item.icon;
                const activeRouteState = isActive(item.path);
                return (
                  <Link
                    key={itemIdx}
                    to={item.path}
                    className={`h-9 px-3 rounded-lg flex items-center gap-3 border transition-all text-xs font-bold uppercase tracking-wider ${
                      activeRouteState
                        ? "bg-primary-gold/10 border-primary-gold/30 text-primary-gold shadow-gold-glow/5"
                        : "bg-transparent border-transparent text-muted-gray hover:text-pure-white hover:bg-deep-black/40"
                    }`}
                  >
                    <IconComponent size={14} className={activeRouteState ? "text-primary-gold" : "text-muted-gray"} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Session Termination Controls Section */}
      <div className="p-4 border-t border-border-dark bg-deep-black/20">
        <button
          onClick={logoutUser}
          className="w-full h-10 border border-border-dark hover:border-error-red/40 bg-transparent text-muted-gray hover:text-error-red flex items-center justify-center gap-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <LogOut size={14} />
          <span>Exit Cockpit</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;