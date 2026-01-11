import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import Splash from "./pages/Splash";
import Welcome from "./pages/Welcome";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import ProductDetail from "./pages/ProductDetail";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import Notifications from "./pages/Notifications";
import NotificationSettings from "./pages/NotificationSettings";
import Subscriptions from "./pages/Subscriptions";
import DietaryFilters from "./pages/DietaryFilters";
import Admin from "./pages/Admin";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import Favorites from "./pages/Favorites";
import Addresses from "./pages/Addresses";
import Location from "./pages/Location";
import Help from "./pages/Help";
import Offers from "./pages/Offers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/splash" element={<Splash />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Index />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:categoryId" element={<CategoryDetail />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/account" element={<Account />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/notification-settings" element={<NotificationSettings />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/dietary-filters" element={<DietaryFilters />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/location" element={<Location />} />
              <Route path="/help" element={<Help />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/rewards" element={<ComingSoon title="Rewards" description="Earn and redeem points here soon." />} />
              <Route path="/rate" element={<ComingSoon title="Rate Us" description="Your feedback will help us improve." />} />
              <Route path="/privacy" element={<ComingSoon title="Privacy Policy" description="Our terms and privacy policy will appear here." />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PWAInstallBanner />
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
