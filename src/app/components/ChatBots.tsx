'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { initChatbotsFromBackendAsync, selectChatbot, selectChatbots } from '@/features/slices/chatbotSlice';
import { AppDispatch } from '@/store';
import { format } from 'date-fns';
import { MoreVerticalIcon, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid4v } from 'uuid';
import PageLoader from './PageLoader';

export default function ChatBots() {
  const dispatch = useDispatch<AppDispatch>();

  const chatbots = useSelector(selectChatbots);
  const chatbot = useSelector(selectChatbot);
  
  useEffect(() => {
    dispatch(initChatbotsFromBackendAsync());
  }, []);
  return (
    <div className="h-full overflow-y-auto px-[50px] py-12">
      <div className="mb-2 flex items-center justify-between gap-1.5">
        <h2 className="font-bricolage text-2xl font-semibold text-foreground">Chatbots</h2>

        <Button asChild size="small" variant="primary">
          <a className="flex items-center" href={`/create-chatbot/${uuid4v()}`}>
            <Plus />
            Create
          </a>
        </Button>
      </div>

      {chatbot.loading ? (
        <PageLoader />
      ) : chatbots.length > 0 ? (
        <table className="w-full table-auto border-collapse text-left">
          <thead>
            <tr className="font-bricolage text-[13px] font-medium text-foreground">
              <th className="w-1/4 border p-3">Title</th>
              <th className="w-1/4 border p-3">Pathway</th>
              <th className="border p-3">Chats</th>
              <th className="border p-3">Messages</th>
              <th className="w-1/4 border p-3">Last Modified </th>
            </tr>
          </thead>

          <tbody>
            {chatbots.map((item, index) => (
              <tr key={index} className="border border-t-0 border-border font-inter text-[13px] font-medium text-foreground/65">
                <td className="p-3 text-secondary hover:underline">
                  <Link href={`/create-chatbot/${item.id}`}>{item.title}</Link>
                </td>
                <td className="p-3">{item.pathways}</td>
                <td className="p-3">{item.title}</td>
                <td className="p-3">messages</td>
                <td className="flex items-center justify-between p-3">
                  {item.updatedAt ? format(item.updatedAt, 'PP') : '-'}
                  <a href={`/create-chatbot/${item.id}`} className="cursor-pointer rounded-full p-1 py-2.5 hover:bg-secondary/10">
                    <MoreVerticalIcon />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex h-full justify-center p-10 font-bricolage text-base font-medium text-foreground">No Chatbots Available</div>
      )}
    </div>
  );
}
