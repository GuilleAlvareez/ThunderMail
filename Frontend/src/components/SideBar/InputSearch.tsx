import { useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { updateUrlParam, getUrlParam } from '../../utils/urlParams';

export function InputSearch() {
  const { searchQuery, updateSearchQuery } = useChatContext();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSearchQuery(localSearchQuery);
      updateUrlParam("search", localSearchQuery.trim() || null);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, updateSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  }
  
  useEffect(() => {
    // Get search parameter from URL on mount
    const searchFromUrl = getUrlParam("search") || "";
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
