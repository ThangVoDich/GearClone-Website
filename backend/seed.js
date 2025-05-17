const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch((err) => console.error("❌ Lỗi kết nối:", err));

const products = [
  // Laptop
  {
    name: "Laptop Gaming ASUS ROG",
    price: 29990000,
    image: "https://nvs.tn-cdn.net/2022/03/laptop-gaming-asus-rog-strix-g17-G713QM-K4183T-9.jpg",
    description: "Laptop gaming hiệu năng cao từ ASUS.",
    category: "laptop",
    subcategory: "laptop-gaming"
  },
   {
    name: "Laptop Gaming ASUS ROG Strix G17",
    price: 32990000,
    image: "https://vn.store.asus.com/media/catalog/product/cache/74e490e088db727ef90851ac50e1fa20/g/7/g713rm-ll016w_1.png",
    description: "ASUS ROG Strix G17 – màn 17.3ʺ 144 Hz, Ryzen 7 6800H, RTX 3060.",
    category: "laptop",
    subcategory: "laptop-gaming"
  },
  {
    name: "Laptop Gaming ASUS ROG Zephyrus G14",
    price: 35990000,
    image: "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_1__7_45.png",
    description: "ROG Zephyrus G14 – siêu di động, Ryzen 9 7940HS, RTX 4060.",
    category: "laptop",
    subcategory: "laptop-gaming"
  },
  {
    name: "Laptop Gaming MSI GF63 Thin 11UC",
    price: 22990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/828x0/filters:format(webp):quality(75)/2023_2_16_638121561917638077_msi-gaming-gf63-thin-11uc-1228vn-i7-11800h-5.jpg",
    description: "MSI GF63 Thin – i7-11800H, RTX 3050, trọng lượng 1.86 kg.",
    category: "laptop",
    subcategory: "laptop-gaming"
  },
   {
    "name": "ASUS ROG Zephyrus G14 GA402NJ",
    "price": 32990000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/0511/ASUS-Gaming-ROG-Zephyrus-G14-GA402NJ-7.jpg",
    "description": "Ultrabook gaming 14″, Ryzen 7 7735HS + RTX 3050, màn 144 Hz.",
    "category": "laptop",
    "subcategory": "laptop-gaming"
  },
  {
    "name": "ASUS ROG Strix G16 G614JV",
    "price": 36990000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/Tin-Tuc/11/11/asus-gaming-rog-strix-g16-g614jv-n415w-1.jpg",
    "description": "Core i7-13650HX, RTX 4060, màn 16″ 2.5 K 240 Hz, 3 quạt ROG IC.",
    "category": "laptop",
    "subcategory": "laptop-gaming"
  },
  {
    "name": "Dell Inspiron 15 3530",
    "price": 18490000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/800x0/dell_inspiron_15_3520_71061229_3_f8c508fdf9.jpg",
    "description": "Laptop 15-inch mỏng nhẹ, Intel Core i5 13th, đủ cổng kết nối cho công việc.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "HP Pavilion 14-dv2075TU",
    "price": 19690000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/0511/HP-Pavilion-14-fpt-2.jpg",
    "description": "Thiết kế thanh thoát, vi xử lý Intel Core i5 Gen 12, pin sạc nhanh 50 %.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "ASUS Vivobook S 15 OLED S5507QA",
    "price": 23990000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/800x0/laptop_asus_vivobook_s_15_oled_s5507qa_ma089ws_1_7a7b76755e.jpg",
    "description": "OLED 3K 120 Hz, Snapdragon X Elite AI, chỉ 1,42 kg.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "Lenovo IdeaPad Slim 3 15IRH8",
    "price": 17490000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/0511/Lenovo-IdeaPad-Slim-3-15IRH8-fpt-3.jpg",
    "description": "Màn 15.6ʺ FHD, Core i7-13620H, RAM 16 GB – phù hợp Excel/Power BI.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "Acer Aspire 5 A515-58GM",
    "price": 20990000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/0511/Acer-Gaming-Aspire-5-A515-58-15.jpg",
    "description": "Core i5 13420H + RTX 2050, vỏ nhôm 1,7 kg – làm việc & chỉnh sửa ảnh nhẹ.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "Dell Vostro V3430",
    "price": 16990000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/800x0/Dell_Vostro_V3430_10_f23c0745ae.jpg",
    "description": "14ʺ FHD, Core i5-1335U, card MX550 2 GB, ExpressCharge 80 %/h.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "ASUS ZenBook 14 OLED UX3405MA",
    "price": 29990000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/Tin-Tuc/11/7/zenbook-14-oled-ux3405ma-pp475w-3.jpg",
    "description": "OLED 14ʺ 3K, Core Ultra 9, nặng 1,2 kg – ultrabook cao cấp.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "HP 15s fq5161TU",
    "price": 16590000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/0511/hp-15s-blue-13.jpg",
    "description": "15.6ʺ FHD, Core i5-1235U, bàn phím số, màu xanh trẻ trung.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "Acer Swift 3 SF314-511",
    "price": 19990000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/Tin-Tuc/QuanLNH2/acer-swift-3-sf314-silver-9.jpg",
    "description": "14ʺ IPS FHD, Core i5-1135G7, khung nhôm-magie 1,19 kg.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "HP ProBook 450 G10",
    "price": 18990000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/800x0/hp_probook_450_g10_9h8v6pt_2_3c1ef7793a.jpg",
    "description": "15.6ʺ FHD Touch, Core i5-1340P, vỏ kim loại bền bỉ.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "Lenovo ThinkBook 14 G4",
    "price": 11590000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/638351690711412095_lenovo_thinkbook_14_g4_iap_i5_1235u_1_819cbac982.jpg",
    "description": "Core i5-1235U, 14ʺ FHD, trọng lượng 1,4 kg – tối ưu di động.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "ASUS ExpertBook B1 B1500",
    "price": 15490000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/0511/ASUS-ExpertBook-B1-B1500-fpt-1.jpg",
    "description": "15.6ʺ FHD, Core i5-1135G7, đạt chuẩn bền MIL-STD-810H.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "Microsoft Surface Laptop Go",
    "price": 16590000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/Tin-Tuc/QuanLNH2/Surface-Laptop-Go-1.jpg",
    "description": "12.4ʺ Touch, Core i5-1035G1, 1,1 kg – gọn cho di chuyển.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "Lenovo Yoga Slim 7 14IMH9",
    "price": 29490000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/Tin-Tuc/11/12/lenovo-yoga-sllim-7-14imh9-ultra-7-155h-1.jpg",
    "description": "OLED 14ʺ, Intel Core Ultra 7 155H, RAM 32 GB – flagship AI PC.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  },
  {
    "name": "Dell Latitude L3540",
    "price": 18590000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/800x0/Dell_Latitude_L3540_2_eb1a64e7bc.jpg",
    "description": "15.6ʺ FHD, Core i5-1235U, Wi-Fi 6E, bảo mật Dell Latitude.",
    "category": "laptop",
    "subcategory": "laptop-vanphong"
  }

,
  {
    name: "Laptop văn phòng Dell Inspiron",
    price: 14990000,
    image: "https://minhtuanmobile.com/uploads/products/dell-inspiron-15-3530-i5-1334u16gb512ssd15-6fhd120hzfpw11sl-office-home-stden-p16wd2-17-590-000-241017042034.png",
    description: "Laptop mỏng nhẹ cho công việc hàng ngày.",
    category: "laptop",
    subcategory: "laptop-vanphong"
  },
  {
    name: "MacBook Air M1",
    price: 21990000,
    image: "https://shopdunk.com/images/thumbs/0027812_macbook-air-13-inch-m1-8-core-cpu-7-core-gpu-256gb-ram-8gb-chinh-hang-cu-dep_550.png",
    description: "MacBook chip M1 mạnh mẽ, tiết kiệm pin.",
    category: "laptop",
    subcategory: "macbook"
  },{
    name: "MacBook Air 13\" M1 2020 8GB/256GB",
    price: 16990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/2020_11_12_637407970062806725_mba-2020-gold-dd.png",
    description: "MacBook Air M1 siêu cơ động, không quạt, pin 18 giờ.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Air 13\" M2 2022 8GB/256GB",
    price: 21990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/2022_6_7_637901915720184032_macbook-air-m2-2022-den-dd.jpg",
    description: "Thiết kế tai thỏ, chip M2, sạc MagSafe 3.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Air 13\" M2 2024 16GB/256GB (Midnight)",
    price: 24990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/macbook_air_13_m2_midnight_1_35053fbcf9.png",
    description: "Phiên bản 2024 RAM 16 GB, màu Midnight cá tính.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Air 13\" M3 2024 16GB/256GB",
    price: 27990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/macbook_air_13_m3_midnight_1_368063bb53.png",
    description: "Chip M3 3 nm + GPU 10 nhân, hỗ trợ AV1 decode.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Air 15\" M2 2023 8GB/256GB",
    price: 25990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/2023_6_6_638216321887898902_macbook-air-m2-2023-15-inch-bac-dd.jpg",
    description: "Màn 15.3ʺ Liquid Retina, 6 loa Spatial Audio.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Air 15\" M4 2025 16GB/256GB (Blue)",
    price: 28990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/macbook_air_15_m4_2025_xanh_1_09060cca6d.jpg",
    description: "Thế hệ M4 hỗ trợ Apple Intelligence, pin 18 giờ.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Pro 14\" M4 Pro 2024 24GB/512GB",
    price: 48990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/macbook_pro_14_m4_pro_max_space_black_1_49c97ac737.png",
    description: "Chip M4 Pro 12 CPU/16 GPU, màu Space Black mới.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Pro 14\" M4 2024 16GB/512GB",
    price: 39990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/macbook_pro_14_m4_space_black_1_8891ba3512.png",
    description: "M4 tiêu chuẩn, ProMotion 120 Hz, HDMI 2.1.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Air 13\" M2 2022 16GB/256GB (FStudio)",
    price: 23990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/2022_9_27_637998745247415575_macbook-air-m2-2022-den-dd-fstudio.jpg",
    description: "Phiên bản F-Studio, gồm đầy đủ phụ kiện chính hãng.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Air 13\" M1 2020 16GB/256GB",
    price: 19990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/2020_11_12_637407970062806725_mba-2020-gold-dd.png",
    description: "Bản RAM 16 GB cho đa nhiệm thoải mái, vẫn không quạt.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Air 13\" M3 2024 16GB/512GB",
    price: 30990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/macbook_air_13_m3_midnight_1_368063bb53.png",
    description: "SSD 512 GB, Wi-Fi 6E, webcam 1080p.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Air 13\" M4 2025 16GB/256GB (Silver)",
    price: 28990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/macbook_air_13_m2_midnight_1_35053fbcf9.png",
    description: "Thế hệ M4, tích hợp Neural Engine 20 nhân cho AI on-device.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Pro 14\" M4 2024 32GB/1TB",
    price: 55990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/macbook_pro_14_m4_space_black_1_8891ba3512.png",
    description: "Bản cấu hình cao 32 GB RAM, SSD 1 TB, 3 cổng TB4.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Air 15\" M2 2023 16GB/512GB",
    price: 30990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/2023_6_6_638216321887898902_macbook-air-m2-2023-15-inch-bac-dd.jpg",
    description: "Màn 15.3ʺ + SSD 512 GB, cân tốt chỉnh sửa ảnh 4K.",
    category: "laptop",
    subcategory: "macbook"
  },
  {
    name: "MacBook Air 15\" M4 2025 24GB/512GB (Blue)",
    price: 33990000,
    image: "https://cdn2.fptshop.com.vn/unsafe/800x0/filters:format(webp):quality(75)/macbook_air_15_m4_2025_xanh_1_09060cca6d.jpg",
    description: "RAM 24 GB, màn lớn, pin 18 giờ cho dân sáng tạo.",
    category: "laptop",
    subcategory: "macbook"
  },

  // Máy tính
  {
    name: "PC Gaming i5 RTX 4060",
    price: 20990000,
    image: "https://nguyencongpc.vn/media/product/250-27609-pc-do-hoa-i7-13700f-ram-16gb-vga-rtx-3060-12gb-12.jpg",
    description: "PC gaming LED RGB mạnh mẽ.",
    category: "pc",
    subcategory: "pc-gaming"
  },
  {
    "name": "PC Gaming E-Power G4060 (i5-12400F/RTX 4060)",
    "price": 21090000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/0511/PC-Gaming-E-Power-G3050-13.jpg",
    "description": "CPU Intel Core i5-12400F, RAM 16 GB, SSD 500 GB, RTX 4060, LED ARGB full case.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "PC E-Power Poseidon (i7-12700F/RTX 4060)",
    "price": 28640000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/0511/asus-dual-rtx-4060-1.jpg",
    "description": "Máy trắng Wi-Fi/Bluetooth, RAM 32 GB DDR5, SSD 1 TB NVMe, nguồn 750 W.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "PC GVN Corsair iCUE (i5-12400F/RTX 4060)",
    "price": 23890000,
    "image": "https://product.hstatic.net/200000722513/product/4060_ddae7a383d2c4f56b9116644fe20906f_compact.png",
    "description": "Case Corsair iCUE, tản nhiệt 4 fan RGB, B760M, RAM 16 GB, SSD 1 TB.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "PC GVN Project Zero White (i5-14400F/RTX 4060)",
    "price": 27290000,
    "image": "https://product.hstatic.net/200000722513/product/artboard_2_e6aeb76ab97048a0b9514f5e7da18853_1024x1024.png",
    "description": "MSI MAG PANO kính 270°, AIO 240 mm, RAM 16 GB DDR5 5600, SSD 1 TB.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "PC GVN Viper (i5-12600K/RTX 4060 Ti)",
    "price": 31990000,
    "image": "https://product.hstatic.net/200000722513/product/post-01_32646f45f48848faaf5f2ba69437b262_compact.jpg",
    "description": "Tản nước 360 mm, RAM 32 GB, nguồn 850 W 80 Plus Gold, ARGB sync.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "PCAP Gaming Wukong V1 (i5-13400F/RTX 4060)",
    "price": 22990000,
    "image": "https://anphat.com.vn/media/lib/03-03-2025/nbac03861.jpg",
    "description": "Main B760M, RAM 16 GB, SSD 500 GB, PSU 650 W Bronze, 5 fan RGB.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "PCAP Palworld V3 (i5-12400F/RTX 4060 Ti)",
    "price": 26490000,
    "image": "https://anphat.com.vn/media/lib/03-03-2025/msi-katana-15-b13vfk.jpg",
    "description": "Case MATX kính hông, tản khí RGB, RAM 16 GB, SSD 1 TB Gen4.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "NC Gaming 08 (i5-12400F/RTX 4060 OC)",
    "price": 20670000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/0511/PC-Gaming-E-Power-G3050-13.jpg",
    "description": "Build trắng full-ARGB, RAM 16 GB, SSD 512 GB, Wi-Fi BT 5.2.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "PC GVN IceDragon (i5-13400F/RTX 4060 Ti)",
    "price": 28990000,
    "image": "https://product.hstatic.net/200000722513/product/4060_ddae7a383d2c4f56b9116644fe20906f_compact.png",
    "description": "Case trắng PANORAMA 3 mặt kính, RAM 32 GB, SSD 1 TB, nguồn 750 W.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "Colorfire Meow (i5-12400F/RTX 4060)",
    "price": 21990000,
    "image": "https://nguyencongpc.vn/media/product/250-27609-pc-do-hoa-i7-13700f-ram-16gb-vga-rtx-3060-12gb-12.jpg",
    "description": "Case mèo độc đáo, RAM 16 GB DDR5, SSD 512 GB, độ ồn < 35 dB.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "PC Gaming Crystal White (i7-12700F/RTX 4060)",
    "price": 32090000,
    "image": "https://cdn2.fptshop.com.vn/unsafe/564x0/filters:quality(80)/Uploads/images/2015/0511/asus-dual-rtx-4060-1.jpg",
    "description": "RAM 32 GB, SSD 500 GB, 6 fan ARGB hub controller, kính cường lực.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "PC GVN VENTUS 4060 Ti (i5-14400F)",
    "price": 26990000,
    "image": "https://product.hstatic.net/200000722513/product/post-01_32646f45f48848faaf5f2ba69437b262_compact.jpg",
    "description": "MSI VENTUS 3X, RAM 16 GB, SSD 1 TB, nguồn 700 W Bronze, DLSS 3 ready.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "PCAP Titan AI (i5-14400F/RTX 5060 Ti)",
    "price": 25990000,
    "image": "https://anphat.com.vn/media/lib/03-03-2025/nbac03861.jpg",
    "description": "Main Z790, RAM 16 GB DDR5, SSD 1 TB, AIO 240 mm ARGB.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "Mini PC Gaming HHPC (i5-13400F/RTX 4060 Ti)",
    "price": 24990000,
    "image": "https://product.hstatic.net/200000722513/product/n22561-001-i5f-_univ_2e1135c9919d46ce97e95d2e19cb74f3_grande.png",
    "description": "Form-factor mATX, RAM 16 GB, SSD 512 GB, PSU 650 W Gold.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    "name": "PC Creator Pro (i7-13700F/RTX 3060)",
    "price": 24590000,
    "image": "https://nguyencongpc.vn/media/product/250-27609-pc-do-hoa-i7-13700f-ram-16gb-vga-rtx-3060-12gb-12.jpg",
    "description": "Tối ưu streaming & edit, RAM 32 GB, SSD 1 TB, 8 fan ARGB.",
    "category": "pc",
    "subcategory": "pc-gaming"
  },
  {
    name: "PC đồ họa Ryzen 7 + Quadro",
    price: 35990000,
    image: "https://mygear.io.vn/media/product/6016-avatar-case-gm-01-mesh-new.jpg",
    description: "Dành cho thiết kế, dựng phim chuyên nghiệp.",
    category: "pc",
    subcategory: "pc-dohoa"
  },
  {
    name: "PC văn phòng Intel i3",
    price: 8490000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_15__7_158_1.png",
    description: "Giá rẻ, tiết kiệm điện, phù hợp văn phòng.",
    category: "pc",
    subcategory: "pc-vanphong"
  },

  // Phụ kiện
  {
    name: "Bàn phím cơ DareU EK87",
    price: 790000,
    image: "https://owlgaming.vn/wp-content/uploads/2021/03/ban-phim-co-akko-3087-world-tour-tokyo-v2-akko-sw.jpg",
    description: "Bàn phím cơ LED RGB thiết kế gọn.",
    category: "accessories",
    subcategory: "ban-phim"
  },
  {
    name: "Chuột Logitech G102",
    price: 490000,
    image: "https://product.hstatic.net/200000722513/product/logitech-g102-lightsync-rgb-black-1_bf4f5774229c4a0f81b8e8a2feebe4d8_aeb4ae49ee844c3e9d315883d4e482d4.jpg",
    description: "Chuột chơi game nhẹ, nhạy, bền.",
    category: "accessories",
    subcategory: "chuot"
  },
  {
    name: "Tai nghe gaming Razer Kraken",
    price: 1890000,
    image: "https://product.hstatic.net/200000722513/product/ezgif-3-2a102e266ba9_15326bef447c473eb07d61b0e843d206_5771f81db9cb441cbc3698ac0e24f888_1024x1024.png",
    description: "Âm thanh sống động, mic rõ nét.",
    category: "accessories",
    subcategory: "tai-nghe"
  },

  // Linh kiện
  {
    name: "CPU Intel Core i5-12400F",
    price: 4290000,
    image: "https://hanoicomputercdn.com/media/product/62475_cpu_intel_core_i5_12400.jpg",
    description: "Bộ xử lý phổ thông, hiệu năng ổn.",
    category: "component",
    subcategory: "cpu"
  },
  {
    name: "Mainboard ASUS B660M",
    price: 2790000,
    image: "https://dlcdnwebimgs.asus.com/gain/a398f84a-48a1-4917-8bf7-8264aca0dce0/",
    description: "Bo mạch chủ cho Intel thế hệ 12.",
    category: "component",
    subcategory: "mainboard"
  },
  {
    name: "RAM DDR4 Corsair 16GB",
    price: 1290000,
    image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/329/122/products/ram-pc-corsair-vengeance-lpx-16gb-3200mhz-ddr4-2x8gb-cmk16gx4m2e3200c16-1-603a349a-dd64-4854-865c-4c3a666e114c-5dbb9786-3c71-494b-b70c-53ef4108edf2-9f3e05ae-5461-4eb0-8bf7-f330516ab239.jpg?v=1741142438443",
    description: "RAM tốc độ cao cho đa nhiệm.",
    category: "component",
    subcategory: "ram"
  },
  {
    name: "SSD Samsung 980 500GB",
    price: 1090000,
    image: "https://product.hstatic.net/200000680839/product/980-500gb-500x500-jpeg_97cd7b01ed6d491a8ee1a636352ef1a9_grande.jpg",
    description: "Ổ cứng SSD tốc độ cao PCIe.",
    category: "component",
    subcategory: "ssd-hdd"
  },
  {
    name: "VGA GIGABYTE RTX 4060Ti",
    price: 10490000,
    image: "https://hoanghapc.vn/media/product/4559_gigabyte_rtx_____4060_ti_gaming_oc_16g_ha1.jpg",
    description: "Card đồ họa chiến mượt mọi game.",
    category: "component",
    subcategory: "gpu"
  }
];

const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedAdminUser = async () => {
  const email = "baothang0932@gmail.com";
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    const admin = new User({
      name: "Admin GearClone",
      email,
      password: "123456",
// ✅ đặt mật khẩu mặc định
      isAdmin: true,
      hasPassword: false
    });
    await admin.save();
    console.log(`✅ Đã tạo user admin với mật khẩu: 123456`);
  } else if (!existingUser.isAdmin) {
    existingUser.isAdmin = true;
    await existingUser.save();
    console.log(`✅ Đã cập nhật ${email} thành admin`);
  } else {
    console.log(`ℹ️ Admin user ${email} đã tồn tại`);
  }
};


const main = async () => {
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("🌱 Seed thành công: 13 sản phẩm.");

  await seedAdminUser(); // gán quyền admin nếu user đã đăng ký

  process.exit();
};

main();


