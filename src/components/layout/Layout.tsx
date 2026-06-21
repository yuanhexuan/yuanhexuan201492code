import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { api } from '../../utils/api';
import type { Category } from '../../types';

export function Layout() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A2E]">
      <Navbar />
      <Sidebar categories={categories} />
      <main className="pt-14 lg:pl-48">
        <Outlet context={{ categories }} />
      </main>
    </div>
  );
}
