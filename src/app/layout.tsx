import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KUMO – Asian Style Text Design',
  description: 'Thời trang tối giản lấy cảm hứng từ văn hóa Á Đông. Khám phá bộ sưu tập áo khoác, áo sơ mi, quần, và phụ kiện cao cấp.',
  keywords: ['thời trang', 'tối giản', 'Á Đông', 'streetwear', 'KUMO'],
  openGraph: {
    title: 'KUMO – Asian Style Text Design',
    description: 'Thời trang tối giản lấy cảm hứng từ văn hóa Á Đông',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        {children}
      </body>
    </html>
  );
}
