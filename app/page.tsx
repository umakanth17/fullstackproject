import Link from 'next/link';
import Navbar from '@/components/Navbar';
import VideoBackground from '@/components/VideoBackground';
import { ArrowRight, Leaf, Heart, Recycle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <VideoBackground />

        <div className="container mx-auto px-6 relative z-20 pt-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                Reduce Waste. <br />
                <span className="text-green-400">Feed Communities.</span>
              </h1>
              <p className="text-xl text-gray-100 max-w-lg drop-shadow-md font-medium">
                Join our mission to bridge the gap between food surplus and food insecurity.
                Track wastage, donate surplus, and make a real impact.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="px-8 py-4 bg-green-600/90 backdrop-blur-sm text-white rounded-xl hover:bg-green-600 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-green-500/30 hover:-translate-y-1"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
                <Link
                  href="#how-it-works"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 text-white">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-green-500/20 rounded-lg text-green-300">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Fresh Produce recovered</h3>
                    <p className="text-gray-300">2.5 tons saved this week</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-blue-500/20 rounded-lg text-blue-300">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Meals Distributed</h3>
                    <p className="text-gray-300">1,200+ families served</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg text-orange-300">
                    <Recycle size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">CO2 Emissions Prevented</h3>
                    <p className="text-gray-300">500kg estimated reduction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 bg-white" id="how-it-works">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How You Can Help</h2>
            <p className="text-gray-600 text-lg">Whether you have food to give or help to offer, there is a role for you in our ecosystem.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                role: "Food Donor",
                desc: "Restaurants, stores, and individuals can list surplus food instantly.",
                color: "bg-orange-50 text-orange-700"
              },
              {
                role: "Recipient Org",
                desc: "NGOs and shelters can browse available food and request donations.",
                color: "bg-blue-50 text-blue-700"
              },
              {
                role: "Data Analyst",
                desc: "Track trends and optimize the distribution network for efficiency.",
                color: "bg-purple-50 text-purple-700"
              }
            ].map((card, i) => (
              <div key={i} className="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-6 font-bold text-xl`}>
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{card.role}</h3>
                <p className="text-gray-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
