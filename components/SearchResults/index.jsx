import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { formatRupiah } from '@/utils/currency';

const SearchResults = ({ results }) => {
    const { theme } = useTheme();
  return (
    <div className={`absolute mt-12 w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-md z-10`}>
      {results.map((product, index) => (
        <Link href={`/products/${product.slug}`} key={index}>
          <span className={`flex items-center p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
            <div className="ml-4">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} text-sm`}>{product.name}</p>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} text-sm`}>{formatRupiah(product.price)}</p>
            </div>
          </span>
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;
