import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#FDFCF0] pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="font-serif text-4xl md:text-5xl text-[#630D16] mb-6">
                        Our Beginnings
                    </h1>
                    <div className="w-24 h-1 bg-[#D4AF37] mx-auto opacity-50"></div>
                </div>

                <div className="space-y-12 font-sans text-lg text-[#3D2B1F] leading-relaxed opacity-90 text-center md:text-left">
                    <p>
                        At Nella Muthu Vilas, we believe that true sweetness cannot be hurried. Our journey began decades ago with a simple promise: to serve sweets that taste like home, prepared with the same patience and purity found in a traditional kitchen.
                    </p>
                    <p>
                        Every Mysore Pak, every Laddu, and every Halwa is crafted using time-honoured methods. We refuse to use shortcuts. We soak our pulses overnight, slow-cook our milk, and use only the purest ghee because we know that quality speaks louder than marketing.
                    </p>

                    <div className="bg-white p-8 md:p-12 shadow-sm border border-[#D4AF37]/20 my-12 rounded-sm">
                        <h2 className="font-serif text-3xl text-[#630D16] mb-6 text-center">Our Kitchen Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm md:text-base">
                            <div>
                                <h3 className="font-bold mb-2">Patience</h3>
                                <p>We cook slowly. Flavors need time to develop.</p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">Purity</h3>
                                <p>No artificial preservatives. Only natural ingredients.</p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">Respect</h3>
                                <p>We respect the recipes passed down through generations.</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-center font-serif text-xl italic text-[#630D16] opacity-80">
                        “Tradition served without hurry.”
                    </p>
                </div>
            </div>
        </div>
    );
}
