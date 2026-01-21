'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInboxStore } from '@/stores/inboxStore';
import { useEffect, useState } from 'react';

export default function InboxPage() {
  const { setConversations, selectedConversation, setSelectedConversation } = useInboxStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['conversations'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/inbox/conversations?page=${pageParam}&limit=20`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (data?.pages) {
      const allConversations = data.pages.flatMap(page => 
        page.conversations.map((item: any) => item.conversation)
      );
      setConversations(allConversations);
    }
  }, [data, setConversations]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading inbox...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Conversation List */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Inbox</h1>
          <a 
            href="/auth/facebook"
            className="mt-2 block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
          >
            Connect Facebook/Instagram
          </a>
        </div>
        
        <div>
          {data?.pages.flatMap((page) => 
            page.conversations.map((item: any) => (
              <ConversationItem
                key={item.conversation.id}
                conversation={item.conversation}
                contact={item.contact}
                channel={item.channel}
                isSelected={selectedConversation?.id === item.conversation.id}
                onSelect={() => setSelectedConversation(item.conversation)}
              />
            ))
          )}
        </div>

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="w-full p-4 text-blue-600 hover:bg-gray-50"
          >
            Load more
          </button>
        )}
      </div>

      {/* Main Content - Messages */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <MessageThread conversationId={selectedConversation.id} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to view messages
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationItem({ 
  conversation, 
  contact, 
  channel, 
  isSelected, 
  onSelect 
}: any) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
          {contact?.name?.[0] || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold truncate">{contact?.name || 'Unknown'}</h3>
            {conversation.lastMessageAt && (
              <span className="text-xs text-gray-500">
                {new Date(conversation.lastMessageAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">{channel?.platformName}</span>
            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">
              {channel?.type?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageThread({ conversationId }: { conversationId: string }) {
  const { messages: storeMessages, setMessages, addMessage } = useInboxStore();

  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `/api/inbox/messages?conversationId=${conversationId}&page=${pageParam}&limit=50`
      );
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (data?.pages) {
      const allMessages = data.pages.flatMap(page => 
        page.messages.map((item: any) => item.message)
      );
      setMessages(conversationId, allMessages);
    }
  }, [data, conversationId, setMessages]);

  const messagesList = storeMessages[conversationId] || [];

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading messages...</div>;
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesList.map((message: any) => (
          <div
            key={message.id}
            className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md px-4 py-2 rounded-lg ${
                message.direction === 'outbound'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p>{message.text}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(message.sentAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <MessageComposer conversationId={conversationId} onMessageSent={addMessage} />
    </>
  );
}

function MessageComposer({ 
  conversationId, 
  onMessageSent 
}: { 
  conversationId: string; 
  onMessageSent: (conversationId: string, message: any) => void;
}) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/inbox/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, text }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      onMessageSent(conversationId, data.message);
      setText('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !text.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
}
