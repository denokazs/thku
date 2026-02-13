import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
const CockpitDashboard = dynamic(() => import('@/components/CockpitDashboard'));
const FeaturedEvents = dynamic(() => import('@/components/FeaturedEvents'));
const HomeBanner = dynamic(() => import('@/components/HomeBanner'));
const NewsSlider = dynamic(() => import('@/components/NewsSlider'));
const FeaturesSection = dynamic(() => import('@/components/FeaturesSection'));
const FacultiesSection = dynamic(() => import('@/components/FacultiesSection'));
const MapTeaser = dynamic(() => import('@/components/MapTeaser'));
const CommunityPromo = dynamic(() => import('@/components/CommunityPromo'));
const HomePopup = dynamic(() => import('@/components/HomePopup'));

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <HomeBanner />
      <Hero />
      <CockpitDashboard />
      <FeaturedEvents />
      <CommunityPromo />
      <MapTeaser />
      <FacultiesSection />
      <FeaturesSection />
      <NewsSlider />
      <HomePopup />
    </main>
  );
}
