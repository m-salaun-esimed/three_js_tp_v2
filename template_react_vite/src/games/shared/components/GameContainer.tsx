import { ReactNode } from 'react';

interface GameContainerProps {
  children: ReactNode;
  title: string;
  className?: string;
}

export const GameContainer = ({ children, title, className = '' }: GameContainerProps) => {
  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        <div className="flex-1 relative">
          {children}
        </div>
      </div>
    </div>
  );
};
