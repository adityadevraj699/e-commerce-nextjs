import {
  getFeaturedProducts,
  getProducts,
} from "@/lib/firestore/products/read_server";
import Header from "./components/Header";
import FeaturedProductSlider from "./components/Sliders";
import Collections from "./components/Collections";
import { getCollections } from "@/lib/firestore/collections/read_server";
import Categories from "./components/Categories";
import { getCategories } from "@/lib/firestore/categories/read_server";
import ProductsGridView from "./components/Products";
import CustomerReviews from "./components/CustomerReviews";
import Brands from "./components/Brands";
import { getBrands } from "@/lib/firestore/brands/read_server";
import Footer from "./components/Footer";

export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    console.log("Fetching data...");

    // Fetching data one by one with individual logs
    console.log("Fetching featured products...");
    const featuredProducts = await getFeaturedProducts();
    console.log("Featured products fetched:", featuredProducts);

    console.log("Fetching collections...");
    const collections = await getCollections();
    console.log("Collections fetched:", collections);

    console.log("Fetching categories...");
    const categories = await getCategories();
    console.log("Categories fetched:", categories);

    console.log("Fetching products...");
    const products = await getProducts();
    console.log("Products fetched:", products);

    console.log("Fetching brands...");
    const brands = await getBrands();
    console.log("Brands fetched:", brands);

    return (
      <main className="w-screen h-screen overflow-x-hidden overflow-y-auto">
        <Header />
        <FeaturedProductSlider featuredProducts={featuredProducts} />
        <Collections collections={collections} />
        <Categories categories={categories} />
        <ProductsGridView products={products} />
        <CustomerReviews />
        <Brands brands={brands} />
        <Footer />
      </main>
    );
  } catch (error) {
    console.error("Error fetching data:", error);

    // More detailed error logging to identify which data fetching step failed
    if (error.message.includes("featuredProducts")) {
      console.error("Error in getFeaturedProducts");
    }
    if (error.message.includes("collections")) {
      console.error("Error in getCollections");
    }
    if (error.message.includes("categories")) {
      console.error("Error in getCategories");
    }
    if (error.message.includes("products")) {
      console.error("Error in getProducts");
    }
    if (error.message.includes("brands")) {
      console.error("Error in getBrands");
    }

    return <div>Error loading data</div>;
  }
}
