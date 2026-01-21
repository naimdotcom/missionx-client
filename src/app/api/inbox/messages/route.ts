import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages, contacts, conversations } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      );
    }

    // Fetch messages with sender information
    const messagesList = await db
      .select({
        message: messages,
        contact: contacts,
      })
      .from(messages)
      .leftJoin(contacts, eq(messages.sentByContactId, contacts.id))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.sentAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      messages: messagesList,
      page,
      limit,
      hasMore: messagesList.length === limit,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, text, contentType = 'text' } = body;

    if (!conversationId || !text) {
      return NextResponse.json(
        { error: 'conversationId and text are required' },
        { status: 400 }
      );
    }

    // TODO: Get userId from authenticated session
    // In production, implement proper authentication (e.g., NextAuth.js)
    // and extract userId and organizationId from the session
    const userId = 'default-user-id';
    const organizationId = 'default-org-id';

    // Get conversation details to find the channel
    const conversation = await db.query.conversations.findFirst({
      where: (conversations, { eq }) => eq(conversations.id, conversationId),
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Get channel connection
    const channel = await db.query.channelConnections.findFirst({
      where: (channelConnections, { eq }) => eq(channelConnections.id, conversation.channelConnectionId),
    });

    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    // Send message via platform API
    const platformMessageId = await sendMessageToPlatform(
      channel,
      conversation.platformThreadId,
      text
    );

    // Store message in database
    const [newMessage] = await db.insert(messages).values({
      organizationId,
      conversationId,
      platformMessageId,
      direction: 'outbound',
      contentType,
      text,
      sentByUserId: userId,
      sentAt: new Date(),
    }).returning();

    // Update conversation's last message timestamp
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

async function sendMessageToPlatform(channel: any, platformThreadId: string, text: string): Promise<string> {
  // Send message via Facebook/Instagram API
  const accessToken = channel.accessToken;
  const channelType = channel.type;

  let url: string;
  let body: any;

  if (channelType === 'facebook_page') {
    // Facebook Messenger API
    url = `https://graph.facebook.com/v18.0/${platformThreadId}/messages`;
    body = {
      message: { text },
      access_token: accessToken,
    };
  } else {
    // Instagram Messaging API
    url = `https://graph.facebook.com/v18.0/${platformThreadId}/messages`;
    body = {
      message: { text },
      access_token: accessToken,
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  const data = await response.json();
  return data.message_id || `local_${Date.now()}`;
}
