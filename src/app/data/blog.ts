export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: number;
  image: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "b001",
    title: "Triết lý Wabi-Sabi trong Thời trang Hiện đại",
    slug: "wabi-sabi-modern-fashion",
    excerpt: "Khám phá cách thẩm mỹ cổ xưa của Nhật Bản về sự không hoàn hảo và vô thường đang định hình lại thời trang tối giản ngày nay.",
    content: `Wabi-sabi, triết lý Nhật Bản hàng thế kỷ tìm thấy vẻ đẹp trong sự không hoàn hảo và vô thường, đang trải qua một sự hồi sinh âm thầm trong thời trang đương đại. Khi ngành công nghiệp phản ứng lại nhiều thập kỷ của sự hoàn hảo bóng bẩy quá mức, các nhà thiết kế đang tìm đến khung thẩm mỹ sâu sắc này để định hướng.

Nguyên lý của wabi-sabi dạy chúng ta trân trọng vẻ đẹp thô mộc hoặc chưa hoàn thiện tự nhiên. Trong thời trang, điều này chuyển dịch thành những đường viền thô, sợi tự nhiên nhăn một cách duyên dáng, và những phom dáng đề cao chức năng hơn là sự trang trí.

Tại KUMO, chúng tôi rút ra nguồn cảm hứng sâu sắc từ triết lý này. Mỗi trang phục được thiết kế để trở nên đẹp hơn theo thời gian sử dụng, để kể một câu chuyện thông qua sự tiến hóa của nó. Sự phai màu nhẹ của một chiếc áo khoác cotton, cách vải linen mềm đi theo thời gian, lớp màu thời gian (patina) nhẹ nhàng phát triển trên da — đây không phải là lỗi mà là những đặc điểm quý giá.

Người tiêu dùng hiện đại, đặc biệt là ở châu Á và ngày càng tăng trên toàn thế giới, đang hướng tới thẩm mỹ này. Phản ứng chống lại sự dư thừa của thời trang nhanh, khao khát những đồ vật có ý nghĩa và tuổi thọ, sự trân trọng đối với thủ công — tất cả đều phù hợp hoàn hảo với thế giới quan wabi-sabi.

Mùa này, hãy tìm kiếm những gấu áo cố ý chưa hoàn thiện, những loại vải thoáng khí và chuyển động tự nhiên, và bảng màu rút ra từ đất và đá. Đây không phải là xu hướng nhất thời mà là sự trở lại với những giá trị cơ bản hơn.`,
    category: "Triết lý",
    author: "Minh Anh Trần",
    authorAvatar: "https://images.unsplash.com/photo-1732209988927-396f5103ede8?w=100&h=100&fit=crop",
    date: "2026-03-15",
    readTime: 6,
    image: "https://images.unsplash.com/photo-1770363759574-3aa49179bc67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZhc2hpb24lMjBlZGl0b3JpYWwlMjBibGFjayUyMHdoaXRlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzQyODI3MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["triết lý", "nhật bản", "tối giản", "wabi-sabi"]
  },
  {
    id: "b002",
    title: "Cách Xây dựng Tủ đồ Nhộng (Capsule Wardrobe) năm 2026",
    slug: "capsule-wardrobe-2026",
    excerpt: "Hướng dẫn dứt khoát để tuyển chọn một tủ đồ tối giản, linh hoạt, phù hợp cho mọi dịp.",
    content: `Khái niệm tủ đồ nhộng (capsule wardrobe) đã phát triển đáng kể kể từ khi Susie Faux đặt ra thuật ngữ này vào những năm 1970. Ngày nay, việc xây dựng một tủ đồ thực sự chức năng đòi hỏi sự hiểu biết không chỉ về những món đồ kinh điển, mà còn về cách thẩm mỹ đương đại và nhu cầu lối sống giao thoa.

Bắt đầu với nền tảng: năm món đồ thiết yếu tạo nên khung xương cho mọi trang phục. Một chiếc sơ mi trắng cắt may chuẩn, quần tây đen may đo, một chiếc áo khoác tối màu chất lượng, một chiếc đầm tông màu trung tính và một chiếc túi có cấu trúc. Đây là những điểm neo của bạn.

Từ đây, hãy thêm những món đồ tạo ra sự kết hợp. Mục tiêu là tối đa số lượng bộ trang phục từ tối thiểu số món đồ. Hãy nghĩ về chất liệu, khối lượng và tỷ lệ thay vì xu hướng. Một món đồ có thể mặc trong nhiều ngữ cảnh — văn phòng, cuối tuần, buổi tối — có giá trị bằng ba món đồ chuyên dụng.

Chất lượng hơn số lượng không chỉ là một lời sáo rỗng mà là một thực tế toán học. Một trang phục mặc 100 lần có chi phí cho mỗi lần mặc thấp hơn nhiều so với trang phục chỉ mặc 5 lần. Hãy đầu tư vào những loại vải già đi một cách duyên dáng: linen, len, da, cotton chất lượng cao.

Bảo trì tủ đồ nhộng của bạn hàng năm. Loại bỏ bất cứ thứ gì không được mặc trong 12 tháng. Thay thế những món đồ đã mòn bằng những bản nâng cấp được cân nhắc kỹ lưỡng. Tủ đồ nhộng là một hệ thống sống, không phải là một công thức cố định.`,
    category: "Hướng dẫn Phong cách",
    author: "Ji Yeon Park",
    authorAvatar: "https://images.unsplash.com/photo-1663766976204-ead9fb54d388?w=100&h=100&fit=crop",
    date: "2026-03-08",
    readTime: 8,
    image: "https://images.unsplash.com/photo-1764698192249-641a17d7a4fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYmxvZyUyMHN0eWxlJTIwbWFnYXppbmUlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc0MjgyNzA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["tủ đồ nhộng", "hướng dẫn phong cách", "tối giản", "mẹo thời trang"]
  },
  {
    id: "b003",
    title: "Từ Seoul đến Sài Gòn: Sự trỗi dậy của Thời trang Đông Nam Á",
    slug: "seoul-saigon-fashion-rise",
    excerpt: "Cách các nhà thiết kế Việt Nam và khu vực đang định nghĩa lại thời trang cao cấp trên trường quốc tế.",
    content: `Cảnh quan thời trang của Đông Nam Á đang trải qua một sự chuyển mình sâu sắc. Khu vực từng được liên tưởng chủ yếu với gia công may mặc giờ đây đang nổi lên như một lực lượng sáng tạo đáng kể, sản sinh ra những nhà thiết kế đang định nghĩa lại ý nghĩa của sự sang trọng châu Á.

Thời trang Việt Nam nói riêng đã thu hút sự chú ý quốc tế. Các nhà thiết kế từ Hà Nội và TP.HCM đang khai thác những truyền thống dệt may phong phú — những đường thêu tinh xảo của các dân tộc thiểu số, những đường nét sạch sẽ của áo dài được hiện đại hóa cho phom dáng đương đại, chất lượng lụa có nguồn gốc địa phương.

Mối liên kết Seoul-Sài Gòn đã trở nên đặc biệt thú vị. Sự thống trị toàn cầu của thời trang Hàn Quốc thông qua K-pop và K-drama đã tạo ra sự thèm muốn thẩm mỹ châu Á trên toàn thế giới. Giờ đây, sự thèm muốn đó đang mở rộng ra ngoài những nét riêng của Hàn Quốc sang một sự trân trọng rộng lớn hơn cho chủ nghĩa tối giản và thủ công châu Á.

Điều thống nhất những thẩm mỹ mới nổi này là sự tôn trọng sâu sắc đối với chất liệu, sự ưu tiên cho sự tiết chế thay vì dư thừa, và sự hiểu biết rằng sự sang trọng cuối cùng là về chất lượng trải nghiệm — xúc giác, thị giác, cảm xúc — hơn là sự hiện diện của logo.

Tại KUMO, chúng tôi coi mình là một phần của phong trào này: một thương hiệu Việt Nam rút tỉa tinh hoa từ sự tối giản Nhật Bản, sự chính xác của Hàn Quốc và di sản Đông Nam Á của chính chúng tôi.`,
    category: "Văn hóa",
    author: "Linh Phương",
    authorAvatar: "https://images.unsplash.com/photo-1562693538-b13cc8095b97?w=100&h=100&fit=crop",
    date: "2026-02-28",
    readTime: 7,
    image: "https://images.unsplash.com/photo-1683642765591-2370edc15193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMGNsb3RoaW5nJTIwc3RvcmUlMjBkYXJrfGVufDF8fHx8MTc3NDI4MjcwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["thời trang châu á", "việt nam", "văn hóa", "sang trọng"]
  },
  {
    id: "b004",
    title: "Am hiểu về Vải: Cách nhận biết Chất lượng Chất liệu",
    slug: "fabric-intelligence-material-quality",
    excerpt: "Những gì đôi tay cảm nhận được mà đôi mắt không thấy. Hướng dẫn đánh giá chất lượng vải như một chuyên gia.",
    content: `Hiểu biết về chất lượng vải là một trong những kỹ năng giá trị nhất mà người tiêu dùng thời trang có thể phát triển. Nó phân biệt giữa những món đồ mua sắm có cân nhắc với những lần mua sắm theo cảm tính đầy hối tiếc, và sự sang trọng thực sự với hàng nhái.

Bài kiểm tra đầu tiên luôn là xúc giác. Vải chất lượng có trọng lượng và cảm giác tay đặc trưng — một thực thể mà các giải pháp thay thế rẻ tiền thiếu thốn. Hãy lướt vải qua các ngón tay một cách chậm rãi. Cotton chất lượng cao có cảm giác mịn, mát; linen chất lượng có kết cấu tự nhiên không thô ráp.

Mật độ sợi (thread count) quan trọng trong cotton, nhưng nó phức tạp hơn là một con số. Mật độ sợi trên 400 ở cotton chất lượng thấp thực tế có thể tệ hơn 200 ở các giống cao cấp. Chất lượng của sợi cotton, chiều dài và độ bền của nó, quan trọng hơn là chỉ số mật độ đơn thuần.

Với len, hãy tìm kiếm cấu trúc dệt chặt chẽ. Kéo nhẹ theo cả hai hướng — len chất lượng sẽ trở lại hình dáng ban đầu. Len dệt lỏng hoặc cấp thấp sẽ bị biến dạng. Trọng lượng nên mang lại cảm giác thực tế mà không gây nặng nề.

Hãy học cách xác định thành phần sợi tự nhiên bằng thử nghiệm đốt (cẩn thận, thực hiện bên ngoài). Sợi tự nhiên cháy và để lại tro; sợi tổng hợp chảy ra và tạo thành những hạt nhựa. Đây là bài kiểm tra dứt khoát khi nhãn mác gây hiểu lầm.`,
    category: "Kiến thức",
    author: "Minh Anh Trần",
    authorAvatar: "https://images.unsplash.com/photo-1732209988927-396f5103ede8?w=100&h=100&fit=crop",
    date: "2026-02-20",
    readTime: 5,
    image: "https://images.unsplash.com/photo-1761778304143-4c89e7dd2457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMGZsYXQlMjBsYXklMjB3aGl0ZXxlbnwxfHx8fDE3NzQyODI3MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["vải", "chất lượng", "kiến thức", "chất liệu"]
  }
];

export const blogCategories = ["Tất cả", "Triết lý", "Hướng dẫn Phong cách", "Văn hóa", "Kiến thức", "Xu hướng"];
