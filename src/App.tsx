import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/Home";
import { WatchPage } from "./pages/Watch";
import { CategoryPage } from "./pages/Category";
import { SearchPage } from "./pages/Search";
import { UserPage } from "./pages/User";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/user/:id" element={<UserPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
