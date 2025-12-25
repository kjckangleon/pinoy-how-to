
import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { Calendar, User, ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
      <Link to={`/guide/${article.slug}`} className="relative h-48 overflow-hidden group">
        <img 
          src={article.featuredImage} 
          alt={article.h1} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            {article.category}
          </span>
        </div>
      </Link>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          <Link to={`/guide/${article.slug}`}>{article.h1}</Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {article.metaDescription}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-gray-400 text-xs font-medium">
          <div className="flex items-center gap-3">
             <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
          <Link to={`/guide/${article.slug}`} className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
            Read Guide <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
