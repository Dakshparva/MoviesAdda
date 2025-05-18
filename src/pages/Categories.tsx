import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Film, Brain } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  linkTo: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  description, 
  icon, 
  gradient, 
  linkTo 
}) => {
  return (
    <Link 
      to={linkTo}
      className="block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className={`h-full ${gradient} p-6 md:p-8`}>
        <div className="flex flex-col h-full">
          <div className="mb-4 p-3 bg-white/20 rounded-full w-fit">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white/80 mb-6">{description}</p>
          <div className="mt-auto">
            <span className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
              Explore
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Categories: React.FC = () => {
  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Categories</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Find the perfect movie for your mood from our curated collections
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard 
            title="Feel Good" 
            description="Uplifting comedies and heartwarming stories that'll boost your mood and leave you smiling."
            icon={<Heart className="w-6 h-6 text-white" />}
            gradient="bg-gradient-to-br from-green-500 to-teal-500"
            linkTo="/category/feel-good"
          />
          
          <CategoryCard 
            title="Action Fix" 
            description="Adrenaline-pumping action and thrilling adventures when you need excitement in your life."
            icon={<Film className="w-6 h-6 text-white" />}
            gradient="bg-gradient-to-br from-red-600 to-orange-500"
            linkTo="/category/action-fix"
          />
          
          <CategoryCard 
            title="Mind Benders" 
            description="Thought-provoking thrillers and mind-bending sci-fi that will keep you guessing until the end."
            icon={<Brain className="w-6 h-6 text-white" />}
            gradient="bg-gradient-to-br from-purple-600 to-indigo-500"
            linkTo="/category/mind-benders"
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;