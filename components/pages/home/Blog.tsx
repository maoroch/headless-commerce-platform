import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Blog() {
    const blogPosts = [
        {
            id: 1,
            title: "Reasons to Go Organic",
            description: "Discover how organic products can improve your health and support the environment.",
            image: "/img/banner/blog/banner-blog-1.png",
            bgColor: "bg-[#FFCAB3]",
            order: "order-1",
            imageOrder: "order-2",
        },
        {
            id: 2,
            title: "Healthy Snack Ideas",
            description: "Quick and easy organic snack recipes to fuel your day and keep you energized.",
            image: "/img/banner/blog/banner-blog-2.png",
            bgColor: "bg-[#B3E5C9]",
            order: "order-2",
            imageOrder: "order-1",
        },
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">
            {/* Header */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 sm:mb-10 lg:mb-8">
                Food Blog
            </h2>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                {blogPosts.map((post) => (
                    <div key={post.id} className="flex flex-col gap-4 sm:gap-6">
                        {/* Image - Reorderable */}
                        <div className={`${post.imageOrder} h-50 sm:h-48 md:h-100 overflow-hidden rounded-lg sm:rounded-xl`}>
                            <Image
                                src={post.image}
                                width={500}
                                height={300}
                                alt={post.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Content Card */}
                        <div className={`${post.order} ${post.bgColor} h-48 sm:h-56 md:h-64 p-6 sm:p-8 rounded-lg sm:rounded-xl flex flex-col transition-all duration-300 hover:shadow-lg`}>
                            <div className="info flex-1">
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 leading-tight">
                                    {post.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
                                    {post.description}
                                </p>
                            </div>

                            {/* Button */}
                            <button className="
                group
                mt-6
                sm:mt-auto
                w-full
                sm:w-40
                h-11
                sm:h-12
                bg-black
                text-white
                text-sm
                sm:text-base
                font-semibold
                rounded-full
                hover:bg-gray-900
                hover:shadow-lg
                active:scale-95
                transition-all
                duration-300
                flex
                items-center
                justify-center
                gap-2
              ">
                                Read More
                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform duration-300"
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}