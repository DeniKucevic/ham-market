"use client";

import { getDisplayName } from "@/lib/display-name";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  listing_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean | null;
  created_at: string | null;
};

type Conversation = {
  listing_id: string;
  other_user_id: string;
  other_user: {
    callsign: string;
    display_name: string | null;
  } | null;
  listing: {
    title: string;
  } | null;
  last_message: Message;
  unread_count: number;
};

interface Props {
  userId: string;
  locale: string;
  initialListingId?: string;
  initialRecipientId?: string;
}

export function MessagesClient({
  userId,
  locale,
  initialListingId,
  initialRecipientId,
}: Props) {
  const t = useTranslations("messages");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(
    initialListingId && initialRecipientId
      ? `${initialListingId}|${initialRecipientId}`
      : null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true); // Mobile view toggle

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      const supabase = createClient();

      const { data: allMessages } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:profiles!messages_sender_id_fkey(callsign, display_name),
          recipient:profiles!messages_recipient_id_fkey(callsign, display_name),
          listing:listings(title)
        `
        )
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (!allMessages) {
        setLoading(false);
        return;
      }

      const convMap = new Map<string, Conversation>();

      for (const msg of allMessages) {
        const otherUserId =
          msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
        const key = `${msg.listing_id}|${otherUserId}`;

        if (!convMap.has(key)) {
          const unreadCount = allMessages.filter(
            (m) =>
              m.listing_id === msg.listing_id &&
              m.sender_id === otherUserId &&
              m.recipient_id === userId &&
              !m.read
          ).length;

          convMap.set(key, {
            listing_id: msg.listing_id,
            other_user_id: otherUserId,
            other_user: msg.sender_id === userId ? msg.recipient : msg.sender,
            listing: msg.listing,
            last_message: msg,
            unread_count: unreadCount,
          });
        }
      }

      setConversations(Array.from(convMap.values()));
      setLoading(false);
    };

    fetchConversations();
  }, [userId]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const [listingId, otherUserId] = selectedConversation.split("|");

    const fetchMessages = async () => {
      const supabase = createClient();

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("listing_id", listingId)
        .or(
          `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`
        )
        .order("created_at", { ascending: true });

      setMessages(data || []);

      const { data: updated } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("listing_id", listingId)
        .eq("sender_id", otherUserId)
        .eq("recipient_id", userId)
        .eq("read", false)
        .select();

      if (updated && updated.length > 0) {
        window.dispatchEvent(new CustomEvent("messages-read"));
      }
    };

    fetchMessages();

    const supabase = createClient();
    const channel = supabase
      .channel(`messages-${listingId}-${otherUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `listing_id=eq.${listingId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === userId &&
              newMsg.recipient_id === otherUserId) ||
            (newMsg.sender_id === otherUserId && newMsg.recipient_id === userId)
          ) {
            setMessages((prev) => {
              if (prev.find((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });

            setConversations((prevConvs) => {
              return prevConvs
                .map((conv) => {
                  if (
                    conv.listing_id === listingId &&
                    conv.other_user_id === otherUserId
                  ) {
                    return {
                      ...conv,
                      last_message: newMsg,
                      unread_count:
                        newMsg.sender_id === otherUserId
                          ? conv.unread_count + 1
                          : conv.unread_count,
                    };
                  }
                  return conv;
                })
                .sort((a, b) => {
                  const aTime = new Date(
                    a.last_message.created_at || 0
                  ).getTime();
                  const bTime = new Date(
                    b.last_message.created_at || 0
                  ).getTime();
                  return bTime - aTime;
                });
            });

            if (newMsg.recipient_id === userId) {
              supabase
                .from("messages")
                .update({ read: true })
                .eq("id", newMsg.id);

              setConversations((prevConvs) => {
                return prevConvs.map((conv) => {
                  if (
                    conv.listing_id === listingId &&
                    conv.other_user_id === otherUserId
                  ) {
                    return { ...conv, unread_count: 0 };
                  }
                  return conv;
                });
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, userId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    const [listingId, recipientId] = selectedConversation.split("|");

    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        listing_id: listingId,
        sender_id: userId,
        recipient_id: recipientId,
        content: newMessage.trim(),
      })
      .select()
      .single();

    if (data && !error) {
      setMessages((prev) => [...prev, data as Message]);
    }

    setNewMessage("");
    setSending(false);
  };

  const handleBackToConversations = () => {
    setShowConversationList(true);
    setSelectedConversation(null);
  };

  if (loading) {
    return <div className="text-center">{t("loading")}</div>;
  }

  return (
    <div className="grid h-[calc(100vh-200px)] grid-cols-1 gap-4 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800 md:grid-cols-3">
      {/* Conversations List - Hidden on mobile when conversation selected */}
      <div
        className={`${
          showConversationList ? "block" : "hidden"
        } border-r border-gray-200 dark:border-gray-700 md:col-span-1 md:block`}
      >
        <div className="h-full overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {t("noConversations")}
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={`${conv.listing_id}-${conv.other_user_id}`}
                onClick={() => {
                  setSelectedConversation(
                    `${conv.listing_id}|${conv.other_user_id}`
                  );
                  // Hide list on mobile when selecting conversation
                  if (window.innerWidth < 768) {
                    setShowConversationList(false);
                  }
                }}
                className={`w-full border-b border-gray-200 p-4 text-left hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 ${
                  selectedConversation ===
                  `${conv.listing_id}|${conv.other_user_id}`
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getDisplayName(conv.other_user, "User")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {conv.listing?.title || "Listing"}
                    </p>
                    <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-500">
                      {conv.last_message.content}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages Thread - Show on mobile when conversation selected */}
      <div
        className={`${
          showConversationList ? "hidden" : "flex"
        } min-h-0 flex-col md:col-span-2 md:flex`}
      >
        {selectedConversation ? (
          <>
            {/* Header with back button on mobile */}
            <div className="flex items-center border-b border-gray-200 p-4 dark:border-gray-700 md:hidden">
              <button
                onClick={handleBackToConversations}
                className="mr-3 text-blue-600 dark:text-blue-400"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex-1">
                {(() => {
                  const conv = conversations.find(
                    (c) =>
                      `${c.listing_id}|${c.other_user_id}` ===
                      selectedConversation
                  );
                  return (
                    <>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getDisplayName(conv?.other_user, "User")}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {conv?.listing?.title || "Listing"}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="min-h-0 flex-1 overflow-y-auto p-4"
            >
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_id === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-2 md:max-w-xs ${
                        msg.sender_id === userId
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <p
                        className={`mt-1 text-xs ${
                          msg.sender_id === userId
                            ? "text-blue-200"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {msg.created_at &&
                          new Date(msg.created_at).toLocaleTimeString(locale, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t("typeMessage")}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {t("send")}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
            {t("selectConversation")}
          </div>
        )}
      </div>
    </div>
  );
}
