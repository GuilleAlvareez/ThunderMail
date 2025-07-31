import { useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';

export function InputSearch() {
  const { searchQuery, updateSearchQuery } = useChatContext();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSearchQuery(localSearchQuery);
      
      const params = new URLSearchParams(window.location.search);
      if (localSearchQuery.trim()) {
        params.set("search", localSearchQuery);
      } else {
        params.delete("search");
      }
      
      const newURL = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newURL);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, updateSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  }
  
  useEffect(() => {
    // Get search parameter from URL on mount
    const params = new URLSearchParams(window.location.search);
    const searchFromUrl = params.get("search") || "";
    setLocalSearchQuery(searchFromUrl);
    updateSearchQuery(searchFromUrl);
  }, [updateSearchQuery]);

  return (
    <input 
      type="text"
      placeholder="🔍 Search..."
      value={localSearchQuery}
      onChange={handleSearchChange}
      className='h-8 w-full bg-white border border-border rounded-full p-4 mb-5 outline-none focus:border-blue-500' 
    />
  );
}
