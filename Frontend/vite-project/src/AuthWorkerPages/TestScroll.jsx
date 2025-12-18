import React from 'react';

const tabs = [
  { id: 1, name: 'Home' },
  { id: 2, name: 'Analytics Dashboard' },
  { id: 3, name: 'Settings' },
  { id: 4, name: 'User Profile' },
  { id: 5, name: 'Notifications' },
  { id: 6, name: 'Help & Support' },
  { id: 7, name: 'Extra Tab' },
];

const HorizontalScrollTabs = () => {
  return (
    <div className="bg-gray-50 p-4 border-b border-gray-200">
      
      {/* The key classes for horizontal scrolling:
        - flex: display: flex;
        - flex-nowrap: flex-wrap: nowrap;
        - overflow-x-auto: overflow-x: auto; 
      */}
      <nav className="flex flex-row flex-nowrap overflow-x-auto py-2">
        {tabs.map((tab, index) => (
          <a
            key={tab.id}
            href="#"
            // The key class for tab items:
            // - flex-shrink-0: flex-shrink: 0; (prevents shrinking)
            className={`
              flex-shrink-0 
              px-4 py-2 mx-1
              text-sm font-medium
              rounded-full
              transition-colors duration-200
              ${index === 0 
                 ? 'bg-blue-600 text-white' 
                 : 'text-gray-600 hover:bg-gray-200'}
            `}
          >
            {tab.name}
          </a>
        ))}
      </nav>
      
    </div>
  );
};

export default HorizontalScrollTabs;