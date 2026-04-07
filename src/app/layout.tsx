import type { Metadata } from 'next';
import './globals.css';
import GlobalProviders from './GlobalProviders';

export const metadata: Metadata = {
  title: 'KUMO – Asian Style Text Design',
  description: 'Thời trang tối giản lấy cảm hứng từ văn hóa Á Đông. Khám phá bộ sưu tập áo khoác, áo sơ mi, quần, và phụ kiện cao cấp.',
  keywords: ['thời trang', 'tối giản', 'Á Đông', 'streetwear', 'KUMO', 'thời trang Việt Nam', 'minimalist fashion'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'KUMO – Asian Style Text Design',
    description: 'Thời trang tối giản lấy cảm hứng từ văn hóa Á Đông. Khám phá bộ sưu tập áo khoác, áo sơ mi, quần, và phụ kiện cao cấp.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'KUMO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KUMO – Asian Style Text Design',
    description: 'Thời trang tối giản lấy cảm hứng từ văn hóa Á Đông',
  },
  other: {
    'google-site-verification': '',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'KUMO',
      description: 'Thời trang tối giản lấy cảm hứng từ văn hóa Á Đông',
      foundingDate: '2020',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'TP. Hồ Chí Minh',
        addressCountry: 'VN',
      },
    },
    {
      '@type': 'WebSite',
      name: 'KUMO – Asian Style Text Design',
      description: 'Thời trang tối giản lấy cảm hứng từ văn hóa Á Đông',
      inLanguage: 'vi',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GlobalProviders>
          {children}
        </GlobalProviders>
      </body>
    </html>
  );
}
