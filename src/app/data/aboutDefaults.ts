// About page content types and defaults

export interface AboutContent {
  hero: { image: string; title: string; subtitle: string };
  brandStory: { paragraphs: string[]; image: string };
  founder: {
    name: string;
    title: string;
    image: string;
    bio: string[];
    quote: string;
    stats: { label: string; value: string }[];
  };
  coreValues: { id: string; title: string; subtitle: string; description: string }[];
  timeline: { id: string; year: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  gallery: { id: string; src: string; alt: string }[];
  trends: { id: string; title: string; desc: string }[];
  vision: { image: string };
  brandQuote: { text: string; author: string };
  cta: { image: string; title: string };
}

export const defaultAboutContent: AboutContent = {
  hero: {
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80',
    title: 'Về KUMO',
    subtitle: 'Tái định nghĩa sự tối giản — từ Sài Gòn đến thế giới.',
  },
  brandStory: {
    paragraphs: [
      'KUMO, trong tiếng Nhật có nghĩa là \u201cđám mây\u201d, được thành lập với niềm tin rằng thời trang đẹp nhất là khi nó không cần cố gắng thu hút sự chú ý. Giống như những đám mây lặng lẽ trôi trên bầu trời, thiết kế của chúng tôi tìm kiếm sự cân bằng giữa hiện diện và vắng mặt.',
      'Lấy cảm hứng từ triết lý thẩm mỹ Wabi-Sabi của Nhật Bản — tôn vinh vẻ đẹp trong sự không hoàn hảo — mỗi sản phẩm KUMO là sự giao thoa giữa nghệ thuật thủ công Việt Nam và tư duy thiết kế tối giản Á Đông. Chúng tôi không chạy theo xu hướng; chúng tôi tạo ra những tác phẩm vượt thời gian.',
      'Từ xưởng nhỏ đầu tiên ở Sài Gòn, KUMO đã phát triển thành một thương hiệu được yêu mến khắp Đông Nam Á, nhưng vẫn giữ nguyên tinh thần ban đầu: ít hơn là nhiều hơn.',
    ],
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
  },
  founder: {
    name: 'Trần Minh Khôi',
    title: 'Nhà sáng lập & Giám đốc Sáng tạo',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    bio: [
      'Sinh năm 1992 tại TP. Hồ Chí Minh, Trần Minh Khôi lớn lên trong một gia đình có ba thế hệ làm nghề may. Từ nhỏ, anh đã được bao quanh bởi tiếng máy may và mùi vải mới — những ký ức đã gieo mầm cho niềm đam mê thời trang suốt đời.',
      'Sau khi tốt nghiệp ngành Thiết kế Thời trang tại Đại học Mỹ thuật TP.HCM, Khôi dành 3 năm làm việc tại Tokyo, nơi anh được đắm chìm trong triết lý thẩm mỹ tối giản của Nhật Bản. Chính tại đây, ý tưởng về KUMO được hình thành — kết hợp kỹ nghệ thủ công Việt Nam với tư duy thiết kế Wabi-Sabi.',
      'Năm 2020, giữa đại dịch, Khôi quyết định quay về Sài Gòn và thành lập KUMO trong một xưởng nhỏ 20m² tại Quận 3. Với chỉ 2 thợ may và một cái máy in lụa cũ, anh bắt đầu tạo ra những thiết kế đầu tiên mang triết lý \u201cít hơn là nhiều hơn\u201d.',
      'Ngày nay, với đội ngũ hơn 50 nghệ nhân và nhà thiết kế, Khôi vẫn trực tiếp giám sát từng bộ sưu tập, đảm bảo mỗi sản phẩm KUMO đều mang hơi thở của người sáng lập — sự tĩnh lặng có chủ đích, nơi mỗi đường may đều kể một câu chuyện.',
    ],
    quote: 'Tôi không thiết kế quần áo. Tôi thiết kế khoảng không giữa con người và sự tự do của họ.',
    stats: [
      { label: 'Năm kinh nghiệm', value: '10+' },
      { label: 'BST đã ra mắt', value: '12' },
      { label: 'Giải thưởng', value: '8' },
    ],
  },
  coreValues: [
    { id: 'cv1', title: 'Tối giản', subtitle: 'MINIMALISM', description: 'Chúng tôi tin rằng vẻ đẹp nằm ở sự tinh gọn. Mỗi thiết kế loại bỏ những gì thừa thãi, giữ lại tinh hoa, tạo nên phong cách vượt thời gian.' },
    { id: 'cv2', title: 'Chất lượng', subtitle: 'QUALITY', description: 'Từ chất liệu cao cấp đến đường may tỉ mỉ, mỗi sản phẩm KUMO đều trải qua quy trình kiểm soát chất lượng nghiêm ngặt trước khi đến tay bạn.' },
    { id: 'cv3', title: 'Bền vững', subtitle: 'SUSTAINABILITY', description: 'Cam kết sử dụng nguyên liệu thân thiện với môi trường và quy trình sản xuất có trách nhiệm. Thời trang đẹp không nên đánh đổi bằng tương lai.' },
    { id: 'cv4', title: 'Thủ công', subtitle: 'CRAFTSMANSHIP', description: 'Mỗi sản phẩm mang dấu ấn của những nghệ nhân lành nghề Việt Nam, kết hợp kỹ thuật thủ công truyền thống với thiết kế hiện đại.' },
  ],
  timeline: [
    { id: 'tl1', year: '2020', title: 'Khởi nguồn', description: 'KUMO ra đời tại một xưởng nhỏ ở TP. Hồ Chí Minh với tầm nhìn mang triết lý tối giản Á Đông vào thời trang đường phố Việt Nam.' },
    { id: 'tl2', year: '2021', title: 'Bộ sưu tập đầu tiên', description: 'Ra mắt BST "Khoảng Không" — bộ sưu tập đầu tay lấy cảm hứng từ thiền định và kiến trúc Nhật Bản, nhận được nhiều đánh giá tích cực.' },
    { id: 'tl3', year: '2022', title: 'Mở rộng quy mô', description: 'Mở studio thiết kế chính thức tại Quận 1. Hợp tác với các nghệ nhân dệt truyền thống tại Hội An và Đà Lạt.' },
    { id: 'tl4', year: '2023', title: 'Vươn tầm quốc tế', description: 'Sản phẩm KUMO có mặt tại 5 quốc gia Đông Nam Á. Ra mắt BST "Tĩnh Lặng" gây tiếng vang lớn trong cộng đồng thời trang.' },
    { id: 'tl5', year: '2024', title: 'Bền vững & Đổi mới', description: 'Chuyển đổi 80% nguyên liệu sang nguồn bền vững. Ra mắt chương trình tái chế vải và đóng gói thân thiện với môi trường.' },
    { id: 'tl6', year: '2025', title: 'Kỷ nguyên số', description: 'Ra mắt nền tảng thương mại điện tử mới, chương trình Loyalty KUMO Points, và trải nghiệm cá nhân hóa cho khách hàng.' },
    { id: 'tl7', year: '2026', title: 'Tương lai phía trước', description: 'BST Xuân Hè 2026 "Khoảng Không Ở Giữa" — tiếp tục hành trình tái định nghĩa sự tối giản trong thời trang Á Đông.' },
  ],
  stats: [
    { value: '50.000+', label: 'Khách hàng tin dùng' },
    { value: '200+', label: 'Sản phẩm thiết kế' },
    { value: '6', label: 'Quốc gia phân phối' },
    { value: '15+', label: 'Giải thưởng thời trang' },
  ],
  gallery: [
    { id: 'g1', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', alt: 'Nghệ thuật dệt vải truyền thống' },
    { id: 'g2', src: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?w=600&q=80', alt: 'Thời trang tối giản Á Đông' },
    { id: 'g3', src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80', alt: 'Xưởng thiết kế KUMO' },
    { id: 'g4', src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80', alt: 'Bộ sưu tập thời trang' },
    { id: 'g5', src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80', alt: 'Fashion editorial KUMO' },
    { id: 'g6', src: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80', alt: 'Chi tiết thủ công tinh xảo' },
    { id: 'g7', src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80', alt: 'Phong cách đường phố' },
    { id: 'g8', src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80', alt: 'Thời trang hiện đại' },
  ],
  trends: [
    { id: 'tr1', title: 'Thời trang bền vững', desc: 'Xu hướng tất yếu của tương lai. KUMO cam kết 100% nguyên liệu bền vững vào năm 2028, từ vải organic cotton đến sợi tái chế.' },
    { id: 'tr2', title: 'Genderless Fashion', desc: 'Xóa nhòa ranh giới giới tính trong thiết kế. BST mới của KUMO hướng đến phong cách phi giới tính, tôn vinh sự tự do cá nhân.' },
    { id: 'tr3', title: 'Kỹ thuật số & Thủ công', desc: 'Kết hợp công nghệ in 3D và AI trong thiết kế với kỹ thuật may thủ công truyền thống, tạo nên những sản phẩm độc nhất vô nhị.' },
    { id: 'tr4', title: 'Slow Fashion', desc: 'KUMO tin vào thời trang chậm — sản xuất có ý thức, chất lượng vượt trội, và sản phẩm được tạo ra để tồn tại lâu dài, không phải một mùa rồi bỏ.' },
  ],
  vision: {
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
  },
  brandQuote: {
    text: 'Thời trang không chỉ là những gì bạn mặc, mà là cách bạn cảm nhận khoảng không giữa bạn và thế giới.',
    author: 'Triết lý sáng lập KUMO',
  },
  cta: {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
    title: 'Khám phá Bộ sưu tập KUMO',
  },
};
