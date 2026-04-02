import { createBrowserRouter } from 'react-router';
import Root from './pages/Root';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmPage from './pages/OrderConfirmPage';
import FlashSalePage from './pages/FlashSalePage';
import RewardsPage from './pages/RewardsPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'about', Component: AboutPage },
      { path: 'shop', Component: ProductListPage },
      { path: 'shop/:id', Component: ProductDetailPage },
      { path: 'cart', Component: CartPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'checkout/confirm', Component: OrderConfirmPage },
      { path: 'flash-sale', Component: FlashSalePage },
      { path: 'rewards', Component: RewardsPage },
      { path: 'blog', Component: BlogPage },
      { path: 'blog/:id', Component: BlogDetailPage },
      { path: 'account', Component: AccountPage },
      { path: 'admin', Component: AdminPage },
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
