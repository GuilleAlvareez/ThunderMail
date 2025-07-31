import { useEffect, useState } from 'react';
import { separateDraftInfo } from '../../utils/methods';

interface AssistantMessageProps {
  message: string;
  onSendEmail?: (draftContent: string) => void;
  sendingEmail?: boolean;
}

export function AssistantMessage({ message, onSendEmail, sendingEmail = false }: AssistantMessageProps) {
  const isDraft = message.includes('To:') && message.includes('Subject:') && message.includes('Content:');
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableContent, setEditableContent] = useState<string>('');

  // Logica para separar informacion del correo
  useEffect(() => {
    if (isDraft) {
      const { to, subject, content } = separateDraftInfo(message);
      setTo(to);
      setSubject(subject);
      setContent(content);
    }
  }, [message, isDraft]);
  
  return (
    <div className="flex items-start gap-3">
      <img
        src="/destello.png"
        alt="Assistant Logo"
        className="w-8 h-8 rounded-full mt-1"
      />
      <div className="flex-1">
        {isDraft && onSendEmail ? (
          <div className="bg-[#FBFBFB] rounded-xl max-w-xl px-4 py-3 border border-border shadow-md">
             <p className="text-sm text-gray-600">
              <span className="font-semibold">To:</span> {to}
            </p>
            <h2 className="text-lg font-bold text-gray-800 mt-1 mb-1">
              {subject}
            </h2>
            {isEditing ? (
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-thunder-purple focus:border-transparent text-[#2D3748] leading-relaxed whitespace-pre-line bg-white mb-3 resize-none"
                rows={Math.max(3, editableContent.split('\n').length)}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            ) : (
              <p className="text-[#2D3748] mb-3 leading-relaxed whitespace-pre-line">
                {content}
              </p>
            )}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => {
                      setContent(editableContent);
                      setIsEditing(false);
                    }}
                    className="group relative inline-flex items-center gap-2 px-4 py-2 bg-thunder-purple text-white font-medium text-sm rounded-xl shadow-md hover:bg-thunder-purple-dark hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 ease-out overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />

                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>

                      <span className="relative z-10">Aceptar Cambios</span>
                    </button>
                  <button 
                    onClick={() => onSendEmail(message)}
                    disabled
                    className="group relative inline-flex items-center gap-2 px-4 py-2 bg-thunder-purple text-white font-medium text-sm rounded-xl shadow-md hover:bg-thunder-purple-dark hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 ease-out overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />

                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>

                      <span className="relative z-10">Enviar Correo</span>
                    </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setEditableContent(content);
                      setIsEditing(true);
                    }}
                    className="group relative inline-flex items-center gap-2 px-4 py-2 bg-white text-thunder-purple font-medium text-sm rounded-xl border border-thunder-border shadow-sm hover:bg-purple-50 hover:border-purple-200 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-out overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"/>

                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>

                      <span className="relative z-10">Editar Borrador</span>
                    </button>
                  <button 
                    onClick={() => {
                      const updatedMessage = `To: ${to}\nSubject: ${subject}\nContent:\n${content}`;
                      onSendEmail(updatedMessage);
                    }}
                    disabled={sendingEmail}
                    className="group relative inline-flex items-center gap-2 px-4 py-2 bg-thunder-purple text-white font-medium text-sm rounded-xl shadow-md hover:bg-thunder-purple-dark hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 ease-out overflow-hidden disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />

                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>

                    <span className="relative z-10">
                      {sendingEmail ? 'Enviando...' : 'Enviar Correo'}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl max-w-xl border border-border">
            <p className="text-black leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
