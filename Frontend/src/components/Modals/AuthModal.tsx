import { X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { handleLogin } = useAuth();

  if (!isOpen) return null;

  const handleRegister = () => {
    handleLogin();
    onClose();
  };

  const handleLoginClick = () => {
    handleLogin();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            To continue, please create an account.
          </h2>
          
          <p className="text-gray-600 mb-8">
            Save your chats and access all features by registering. It's free!
          </p>

          <div className="space-y-3">
            <button
              onClick={handleLoginClick}
              className="w-full bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

