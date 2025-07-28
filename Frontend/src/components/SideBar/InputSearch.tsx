import { useChatContext } from '../../context/ChatContext';

export function InputSearch() {
  const { searchQuery, updateSearchQuery } = useChatContext();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchQuery(e.target.value);
  };

  return (
    <input 
      type="text"
      placeholder="🔍 Search..."
      value={searchQuery}
      onChange={handleSearchChange}
      className='h-8 w-full bg-white border border-border rounded-full p-4 mb-5 outline-none focus:border-blue-500' 
    />
  );
}
