export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  description: string;
  details: string[];
  images: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  tags: string[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export const products: Product[] = [
  {
    id: "p001",
    name: "Áo khoác Void Oversized",
    price: 289000,
    originalPrice: 389000,
    category: "Áo khoác",
    subcategory: "Áo khoác",
    description: "Một món đồ tuyên ngôn trong sắc đen tối giản thuần khiết. Dáng oversized lấy cảm hứng từ văn hóa đường phố Nhật Bản. Được cắt từ vải canvas cotton dày dặn với đường vai không cấu trúc tinh tế.",
    details: [
      "100% Cotton Canvas dày",
      "Dáng oversized không cấu trúc",
      "Hai túi trước sâu",
      "Lót satin bên trong",
      "Khuyến nghị giặt khô",
      "Sản xuất tại Việt Nam"
    ],
    images: [
      "https://images.unsplash.com/photo-1644483878398-b57d19f84ff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxhY2slMjBqYWNrZXQlMjBjbG90aGluZyUyMHByb2R1Y3R8ZW58MXx8fHwxNzc0MjgyNzA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1562693538-b13cc8095b97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHN0cmVldCUyMGZhc2hpb24lMjBtb2RlbCUyMG91dGRvb3J8ZW58MXx8fHwxNzc0MjgyNzEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1768818653161-0ad28dede131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwc2hvb3QlMjBzdHVkaW8lMjBtb25vY2hyb21lJTIwbW9kZWx8ZW58MXx8fHwxNzc0MjgyNzE1fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Đen", "Than"],
    rating: 4.8,
    reviewCount: 124,
    stock: 8,
    isBestseller: true,
    isFlashSale: true,
    flashSalePrice: 229000,
    tags: ["oversized", "áo khoác", "tối giản"]
  },
  {
    id: "p002",
    name: "Áo sơ mi Shiro Essential",
    price: 189000,
    category: "Áo",
    subcategory: "Sơ mi",
    description: "Sắc trắng tinh khôi, đường cắt hoàn hảo. Một món đồ thiết yếu cho tủ đồ hiện đại. Dáng rộng thoải mái với đường vai trễ tinh tế. Chất vải thoáng khí dễ dàng qua các mùa.",
    details: [
      "100% Cotton Ai Cập cao cấp",
      "Dáng trễ vai thoải mái",
      "Cúc xà cừ",
      "Cổ tay áo có thể điều chỉnh",
      "Giặt máy ở 30°C",
      "Sản xuất tại Bồ Đào Nha"
    ],
    images: [
      "https://images.unsplash.com/photo-1722310752951-4d459d28c678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG92ZXJzaXplZCUyMHNoaXJ0JTIwZmFzaGlvbiUyMHByb2R1Y3R8ZW58MXx8fHwxNzc0MjgyNzEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1761778304143-4c89e7dd2457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMGZsYXQlMjBsYXklMjB3aGl0ZXxlbnwxfHx8fDE3NzQyODI3MDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Trắng", "Kem", "Xám nhạt"],
    rating: 4.6,
    reviewCount: 89,
    stock: 24,
    isNew: true,
    tags: ["sơ mi", "trắng", "thiết yếu", "cotton"]
  },
  {
    id: "p003",
    name: "Quần tây Kurai Straight",
    price: 249000,
    originalPrice: 299000,
    category: "Quần & Váy",
    subcategory: "Quần tây",
    description: "Đường nét gọn gàng, độ rủ hoàn hảo. Chiếc quần ống đứng này phản chiếu sự chính xác của kỹ thuật may đo Nhật Bản với phong thái thư thái, hiện đại. Cạp quần rộng với đường xếp ly tinh tế.",
    details: [
      "Hỗn hợp 70% Len, 30% Polyester",
      "Dáng đứng",
      "Cạp chun rộng",
      "Túi xẻ hai bên",
      "Túi viền phía sau",
      "Khuyến nghị giặt khô"
    ],
    images: [
      "https://images.unsplash.com/photo-1760616172899-0681b97a2de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRyb3VzZXJzJTIwcGFudHMlMjBtaW5pbWFsJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzQyODI3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1663766976204-ead9fb54d388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmYXNoaW9uJTIwc3RyZWV0d2VhciUyMG1vbm9jaHJvbWV8ZW58MXx8fHwxNzc0MjgyNzA2fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Đen", "Xanh navy đậm", "Than"],
    rating: 4.7,
    reviewCount: 67,
    stock: 15,
    isBestseller: true,
    tags: ["quần tây", "tối giản", "may đo"]
  },
  {
    id: "p004",
    name: "Túi Tote Mugen",
    price: 359000,
    category: "Phụ kiện",
    subcategory: "Túi xách",
    description: "Sức chứa vô hạn, không thỏa hiệp. Chiếc túi tote có cấu trúc này được chế tác thủ công từ da nguyên tấm, tạo nên lớp màu thời gian phong phú. Một tuyên ngôn thầm lặng về gu thẩm mỹ.",
    details: [
      "Da nguyên tấm nhuộm thảo mộc",
      "Kích thước: 38 × 30 × 12 cm",
      "Túi kéo trong + 2 túi phụ",
      "Khóa từ tính",
      "Lót trong bằng canvas cotton",
      "Thủ công tại Việt Nam"
    ],
    images: [
      "https://images.unsplash.com/photo-1711113456416-7d96c9bc31fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBiYWclMjBsdXh1cnklMjBkYXJrfGVufDF8fHx8MTc3NDI4MjcxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1761778304143-4c89e7dd2457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMGZsYXQlMjBsYXklMjB3aGl0ZXxlbnwxfHx8fDE3NzQyODI3MDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["Một kích thước"],
    colors: ["Đen", "Nâu vàng", "Nâu đậm"],
    rating: 4.9,
    reviewCount: 203,
    stock: 5,
    isNew: true,
    isFlashSale: true,
    flashSalePrice: 299000,
    tags: ["túi", "da", "tote", "phụ kiện"]
  },
  {
    id: "p005",
    name: "Áo Hoodie Kage",
    price: 219000,
    category: "Áo",
    subcategory: "Hoodie",
    description: "Cái bóng trong hình hài. Chiếc hoodie vải French terry dày dặn này tạo nên sự cân bằng hoàn hảo giữa cấu trúc và sự thoải mái. Một đồng phục cho những người theo chủ nghĩa tối giản hiện đại.",
    details: [
      "400gsm Cotton French Terry",
      "Lót trong chải lông",
      "Gấu và cổ tay áo bo gân",
      "Mũ trùm đầu có dây rút",
      "Túi kangaroo",
      "Vải đã xử lý chống co rút"
    ],
    images: [
      "https://images.unsplash.com/photo-1683642765591-2370edc15193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMGNsb3RoaW5nJTIwc3RvcmUlMjBkYXJrfGVufDF8fHx8MTc3NDI4MjcwNHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1770363759574-3aa49179bc67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZhc2hpb24lMjBlZGl0b3JpYWwlMjBibGFjayUyMHdoaXRlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzQyODI3MD38MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Đen", "Trắng ngà", "Xám đá"],
    rating: 4.5,
    reviewCount: 156,
    stock: 30,
    tags: ["hoodie", "french terry", "thường ngày", "streetwear"]
  },
  {
    id: "p006",
    name: "Đầm quấn Rei",
    price: 279000,
    originalPrice: 349000,
    category: "Đầm",
    subcategory: "Đầm quấn",
    description: "Mềm mại, thanh thoát, nhẹ nhàng. Lấy cảm hứng từ chuyển động của nước, chiếc đầm quấn bằng vải crepe nhẹ này chuyển động đẹp mắt theo cơ thể. Điều chỉnh vạt quấn cho vóc dáng của bạn.",
    details: [
      "100% Viscose Crepe",
      "Khóa quấn có thể điều chỉnh",
      "Độ dài dưới đầu gối",
      "Thân áo có lót",
      "Khuyến nghị giặt tay",
      "Sản xuất tại Nhật Bản"
    ],
    images: [
      "https://images.unsplash.com/photo-1732209988927-396f5103ede8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGZhc2hpb24lMjBtb2RlbCUyMGx1eHVyeXxlbnwxfHx8fDE3NzQyODI3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1770363759574-3aa49179bc67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZhc2hpb24lMjBlZGl0b3JpYWwlMjBibGFjayUyMHdoaXRlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzQyODI3MD38MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Đen", "Ngà", "Đỏ đậm"],
    rating: 4.6,
    reviewCount: 91,
    stock: 12,
    isBestseller: true,
    tags: ["đầm", "đầm quấn", "sang trọng", "nữ tính"]
  },
  {
    id: "p007",
    name: "Áo khoác Linen Ma",
    price: 449000,
    category: "Áo khoác",
    subcategory: "Áo choàng",
    description: "Không gian và sự tĩnh lặng. Chiếc áo khoác linen mang tính điêu khắc này được định nghĩa bởi phom dáng rộng rãi và đường nét tinh tế. Khóa tối giản. Sự hiện diện tối đa.",
    details: [
      "100% Linen cao cấp",
      "Dáng giải cấu trúc",
      "Khóa một cúc",
      "Hai túi sâu",
      "Hoàn toàn không lót để thoáng khí",
      "Sản xuất tại Việt Nam"
    ],
    images: [
      "https://images.unsplash.com/photo-1768818653161-0ad28dede131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwc2hvb3QlMjBzdHVkaW8lMjBtb25vY2hyb21lJTIwbW9kZWx8ZW58MXx8fHwxNzc0MjgyNzE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1644483878398-b57d19f84ff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxhY2slMjBqYWNrZXQlMjBjbG90aGluZyUyMHByb2R1Y3R8ZW58MXx8fHwxNzc0MjgyNzA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Yến mạch", "Đen", "Xanh xám"],
    rating: 4.9,
    reviewCount: 48,
    stock: 6,
    isNew: true,
    tags: ["áo khoác", "linen", "oversized", "sang trọng"]
  },
  {
    id: "p008",
    name: "Chân váy xếp ly Nami",
    price: 169000,
    category: "Quần & Váy",
    subcategory: "Chân váy",
    description: "Những đường xếp ly như sóng chuyển động. Chiếc chân váy midi này có đường xếp ly accordion tinh tế trên chất vải hoàn thiện satin cao cấp. Một sự hài hòa giữa cấu trúc và sự mềm mại.",
    details: [
      "95% Polyester, 5% Elastane",
      "Xếp ly Accordion",
      "Cạp chun",
      "Độ dài Midi (dưới đầu gối)",
      "Có thể giặt máy",
      "Sản xuất tại Hàn Quốc"
    ],
    images: [
      "https://images.unsplash.com/photo-1663766976204-ead9fb54d388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmYXNoaW9uJTIwc3RyZWV0d2VhciUyMG1vbm9jaHJvbWV8ZW58MXx8fHwxNzc0MjgyNzA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1732209988927-396f5103ede8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGZhc2hpb24lMjBtb2RlbCUyMGx1eHVyeXxlbnwxfHx8fDE3NzQyODI3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Đen", "Bạc", "Xanh navy đậm"],
    rating: 4.4,
    reviewCount: 72,
    stock: 18,
    isFlashSale: true,
    flashSalePrice: 129000,
    tags: ["chân váy", "xếp ly", "midi", "sang trọng"]
  }
];

export const reviews: Review[] = [
  {
    id: "r001",
    productId: "p001",
    userName: "Linh Nguyễn",
    rating: 5,
    comment: "Tuyệt đẹp. Chất lượng vượt trội và phom dáng hoàn hảo. Rất đáng đồng tiền.",
    date: "2026-03-10",
    verified: true
  },
  {
    id: "r002",
    productId: "p001",
    userName: "Min Jae",
    rating: 5,
    comment: "Vải chất lượng rất cao và thiết kế tối giản. Chính xác là những gì tôi đang tìm kiếm.",
    date: "2026-03-05",
    verified: true
  },
  {
    id: "r003",
    productId: "p001",
    userName: "Trần Anh",
    rating: 4,
    comment: "Thích dáng cắt oversized. Hơi rộng một chút, nên chọn lùi một size.",
    date: "2026-02-28",
    verified: true
  },
  {
    id: "r004",
    productId: "p002",
    userName: "Sakura H.",
    rating: 5,
    comment: "Chất lượng vải đặc biệt tốt. Đường cắt gọn gàng và vượt thời gian.",
    date: "2026-03-12",
    verified: true
  },
  {
    id: "r005",
    productId: "p002",
    userName: "Phương L.",
    rating: 4,
    comment: "Áo sơ mi mặc hàng ngày tuyệt vời. Thích phong cách tối giản.",
    date: "2026-03-08",
    verified: false
  }
];

export const categories = [
  { id: "all", name: "Tất cả", count: products.length },
  { id: "outerwear", name: "Áo khoác", count: products.filter(p => p.category === "Áo khoác").length },
  { id: "tops", name: "Áo", count: products.filter(p => p.category === "Áo").length },
  { id: "bottoms", name: "Quần & Váy", count: products.filter(p => p.category === "Quần & Váy").length },
  { id: "dresses", name: "Đầm", count: products.filter(p => p.category === "Đầm").length },
  { id: "accessories", name: "Phụ kiện", count: products.filter(p => p.category === "Phụ kiện").length },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price);
};
