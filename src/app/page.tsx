import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import MainContent from "@/components/main-content";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Header />
      <SearchBar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <MainContent />
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
