import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { conversations, contacts, channelConnections } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // TODO: Get organizationId from authenticated user session
    // In production, implement proper authentication (e.g., NextAuth.js)
    // and extract organizationId from the session to ensure tenant isolation
    const organizationId = 'default-org-id';

    // Fetch conversations with related data
    const conversationsList = await db
      .select({
        conversation: conversations,
        contact: contacts,
        channel: channelConnections,
      })
      .from(conversations)
      .leftJoin(contacts, eq(conversations.contactId, contacts.id))
      .leftJoin(channelConnections, eq(conversations.channelConnectionId, channelConnections.id))
      .where(eq(conversations.organizationId, organizationId))
      .orderBy(desc(conversations.lastMessageAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      conversations: conversationsList,
      page,
      limit,
      hasMore: conversationsList.length === limit,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
