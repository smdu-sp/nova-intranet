"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CMSPage } from "@prisma/client";
import { MenuItem } from "@prisma/client";

// Tipo personalizado para incluir relacionamentos aninhados
type MenuItemWithChildren = MenuItem & {
  children?: MenuItemWithChildren[];
};

export default function Navigation() {
  const [cmsPages, setCmsPages] = useState<CMSPage[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemWithChildren[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pagesRes, menuRes] = await Promise.all([
        fetch("/api/cms/pages/public"),
        fetch("/api/admin/menus/1/items/hierarchical"),
      ]);

      const pagesResult = await pagesRes.json();
      const menuResult = await menuRes.json();

      if (pagesResult.success) {
        setCmsPages(pagesResult.data);
      }

      if (menuResult.success && menuResult.data) {
        setMenuItems(menuResult.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para determinar se o link deve abrir no main content
  const getMenuLink = (item: MenuItemWithChildren) => {
    // Se for uma página CMS (começa com /pagina/), converte para abrir no main content
    if (item.url.startsWith("/pagina/")) {
      const slug = item.url.replace("/pagina/", "");
      return `/?page=${slug}`;
    }
    // Para outros links (externos, sistemas), mantém o comportamento normal
    return item.url;
  };

  const renderMenuItem = (item: MenuItemWithChildren) => (
    <div key={item.id} className="relative group min-w-[120px] text-center">
      <Link
        href={getMenuLink(item)}
        className="py-4 px-2 text-[#333333] font-semibold hover:text-[#0a3299] hover:bg-gray-200 transition-colors block"
      >
        {item.title}
      </Link>

      {/* Submenu dropdown */}
      {item.has_children && item.children && item.children.length > 0 && (
        <div className="uppercase font-bold absolute top-full left-0 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 rounded-md py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-left">
          {item.children?.map((child: MenuItemWithChildren) => (
            <div key={child.id} className="relative group/child">
              <Link
                href={getMenuLink(child)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0a3299]"
              >
                {child.title}
              </Link>

              {/* Sub-submenu */}
              {child.has_children &&
                child.children &&
                child.children.length > 0 && (
                  <div className="uppercase font-bold absolute left-full top-0 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 rounded-md py-2 min-w-48 opacity-0 invisible group-hover/child:opacity-100 group-hover/child:visible transition-all duration-200">
                    {child.children.map((grandChild: MenuItemWithChildren) => (
                      <div
                        key={grandChild.id}
                        className="relative group/grandchild"
                      >
                        <Link
                          href={getMenuLink(grandChild)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0a3299]"
                        >
                          {grandChild.title}
                        </Link>

                        {/* Sub-sub-submenu */}
                        {grandChild.has_children &&
                          grandChild.children &&
                          grandChild.children.length > 0 && (
                            <div className="uppercase font-bold absolute left-full top-0 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 rounded-md py-2 min-w-48 opacity-0 invisible group-hover/grandchild:opacity-100 group-hover/grandchild:visible transition-all duration-200">
                              {grandChild.children.map(
                                (greatGrandChild: MenuItemWithChildren) => (
                                  <Link
                                    key={greatGrandChild.id}
                                    href={getMenuLink(greatGrandChild)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0a3299]"
                                  >
                                    {greatGrandChild.title}
                                  </Link>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-[1491px] bg-[#e5e5e5]">
      <div className="flex justify-around">
        {/* Menu principal do banco de dados */}
        {!loading && menuItems.map(renderMenuItem)}

        {/* Item fixo de Galerias */}
        {!loading && (
          <div className="relative group min-w-[120px] text-center">
            <Link href="/galerias" className="block">
              <div className="px-4 py-3 text-gray-700 hover:text-[#0a3299] hover:bg-gray-100 transition-colors duration-200 rounded-md">
                <span className="font-medium">Galerias</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
