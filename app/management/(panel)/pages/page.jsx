import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PAGES = [
  {
    slug: "trang-chu",
    name: "Trang chủ",
    description: "Hero, sản phẩm hot, dịch vụ, lý do chọn, CTA",
    image: "/images/trang-chu.jpeg",
    available: true,
  },
  {
    slug: "gioi-thieu",
    name: "Giới thiệu",
    description: "Câu chuyện thương hiệu, giá trị cốt lõi, đội ngũ",
    image: "/images/gioi-thieu.jpeg",
    available: true,
  },
  {
    slug: "dich-vu",
    name: "Dịch vụ",
    description: "Danh sách dịch vụ gia công và chi tiết",
    image: "/images/dich-vu-1.jpeg",
    available: true,
  },
  {
    slug: "gia-cong",
    name: "Gia công",
    description: "Quy trình gia công và yêu cầu báo giá",
    image: "/images/dich-vu-2.jpeg",
    available: true,
  },
  {
    slug: "san-pham",
    name: "Sản phẩm",
    description: "Trang danh sách sản phẩm",
    image: "/images/dich-vu-3.jpeg",
    available: true,
  },
  {
    slug: "tin-tuc",
    name: "Tin tức",
    description: "Trang danh sách bài viết",
    image: "/images/dich-vu-4.jpeg",
    available: true,
  },
  {
    slug: "lien-he",
    name: "Liên hệ",
    description: "Thông tin liên hệ, form gửi yêu cầu",
    image: "/images/ly-do.jpeg",
    available: true,
  },
  {
    slug: "cnc-infor",
    name: "Header / Footer / Nav",
    description: "Thông tin chung: logo, menu, liên kết footer",
    image: null,
    available: true,
  },
];

export default function ManagePagesIndex() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">Chỉnh sửa UI</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Chọn trang cần chỉnh sửa nội dung
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAGES.map((page) => {
            const card = (
              <div
                className={`group bg-white rounded-md border border-gray-200 overflow-hidden transition-shadow ${
                  page.available
                    ? "hover:shadow-md cursor-pointer"
                    : "opacity-60"
                }`}
              >
                <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                  {page.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={page.image}
                      alt={page.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      (Không có ảnh)
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {page.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {page.description}
                      </p>
                    </div>
                    {page.available ? (
                      <ArrowRight
                        size={16}
                        className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5"
                      />
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full flex-shrink-0">
                        Sắp có
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-2 font-mono">
                    /{page.slug === "cnc-infor" ? "" : page.slug}
                  </div>
                </div>
              </div>
            );

            return page.available ? (
              <Link key={page.slug} href={`/management/pages/${page.slug}`}>
                {card}
              </Link>
            ) : (
              <div key={page.slug}>{card}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
