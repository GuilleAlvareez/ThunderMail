type LoginButtonProps = {
  loginFunction: () => void;
};

export function LoginButton({ loginFunction }: LoginButtonProps) {
  return (
    <button 
      className="border border-darkBorder rounded-full px-5 py-2 cursor-pointer transition-all duration-200 ease-in-out hover:bg-hoverChatButton hover:shadow"
      onClick={loginFunction}
    >
      Login
    </button>
  );
}
