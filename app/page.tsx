import Categories from "./components/Categories";
import Footer from "./components/footer/footer";
import PropertyList from "./components/properties/PropertyList";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Categories />
      
      <div className="mt-4 my-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-grow pl-6 pr-6">
        <PropertyList />
      </div>

      <Footer />
    </main>
  );
}
