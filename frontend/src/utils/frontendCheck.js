import api from "./api";

export const runFrontendCheck = async () => {
  const endpoints = [
    { name: "Products", url: "/products?limit=5" },
    { name: "Categories", url: "/categories" },
    { name: "Bundles", url: "/bundles" },
    { name: "Homepage", url: "/homepage" },
    { name: "Bikes", url: "/bikes" },
    { name: "Activity", url: "/activity/recent" },
    { name: "Settings", url: "/settings" },
  ];

  console.log("=== FRONTEND API CONNECTION CHECK ===");
  for (const ep of endpoints) {
    try {
      const res = await api.get(ep.url);
      console.log(`✅ ${ep.name} — OK`);
    } catch (e) {
      console.log(`❌ ${ep.name} — FAILED: ${e.response?.status} ${e.response?.data?.message || e.message}`);
    }
  }
  console.log("=== CHECK COMPLETE ===");
};