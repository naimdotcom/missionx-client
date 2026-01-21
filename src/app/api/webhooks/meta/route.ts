import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { db } from '@/db';
import { webhookEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  // Facebook webhook verification
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || 'missionx_verify_token';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    // Verify signature
    const signature = request.headers.get('x-hub-signature-256');
    if (!signature) {
      console.error('No signature provided');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const rawBody = await request.text();
    
    if (!verifySignature(rawBody, signature)) {
      console.error('Invalid signature');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Parse webhook payload
    const payload = JSON.parse(rawBody);

    // Immediately return 200 to Meta (must respond within 20s SLA)
    // Process the webhook asynchronously
    processWebhookAsync(payload).catch(error => {
      console.error('Async webhook processing error:', error);
    });

    return new NextResponse('EVENT_RECEIVED', { status: 200 });
  } catch (error) {
    console.error('Webhook handler error:', error);
    // Still return 200 to avoid Meta retrying
    return new NextResponse('ERROR', { status: 200 });
  }
}

function verifySignature(payload: string, signature: string): boolean {
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!appSecret) {
    console.error('FACEBOOK_APP_SECRET not configured');
    return false;
  }

  const expectedSignature = 'sha256=' + createHmac('sha256', appSecret)
    .update(payload)
    .digest('hex');

  return signature === expectedSignature;
}

async function processWebhookAsync(payload: any) {
  try {
    // Store raw event for idempotency and replay
    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        const eventId = `${entry.id}_${change.value?.message_id || change.value?.item || crypto.randomUUID()}`;
        
        // Check if event already processed (idempotency)
        const existing = await db.query.webhookEvents.findFirst({
          where: eq(webhookEvents.eventId, eventId),
        });

        if (existing) {
          console.log(`Event ${eventId} already processed, skipping`);
          continue;
        }

        // Store raw event
        await db.insert(webhookEvents).values({
          eventId,
          source: change.field === 'instagram' ? 'instagram' : 'facebook',
          eventType: change.field === 'messages' ? 'message.received' : change.field,
          payload: change.value,
          status: 'pending',
        });

        console.log(`Stored webhook event ${eventId} for processing`);

        // In production, you would enqueue this to a job queue (Inngest/BullMQ)
        // For now, we'll process immediately in a non-blocking manner
        processMessageEvent(eventId, change.value).catch(error => {
          console.error(`Error processing event ${eventId}:`, error);
        });
      }

      // Handle messaging events
      for (const messaging of entry.messaging || []) {
        const eventId = `${entry.id}_${messaging.message?.mid || crypto.randomUUID()}`;
        
        const existing = await db.query.webhookEvents.findFirst({
          where: eq(webhookEvents.eventId, eventId),
        });

        if (existing) {
          console.log(`Event ${eventId} already processed, skipping`);
          continue;
        }

        await db.insert(webhookEvents).values({
          eventId,
          source: 'facebook',
          eventType: messaging.message ? 'message.received' : 'messaging.other',
          payload: messaging,
          status: 'pending',
        });

        console.log(`Stored webhook event ${eventId} for processing`);

        processMessagingEvent(eventId, messaging).catch(error => {
          console.error(`Error processing event ${eventId}:`, error);
        });
      }
    }
  } catch (error) {
    console.error('processWebhookAsync error:', error);
  }
}

async function processMessageEvent(eventId: string, value: any) {
  // This would be handled by a job queue worker in production
  // Normalize webhook data to messages table
  // Implementation would include:
  // 1. Extract message details
  // 2. Find or create contact
  // 3. Find or create conversation
  // 4. Insert message with platform_message_id for idempotency
  // 5. Update webhook_events status to 'processed'
  
  console.log(`Processing message event ${eventId}`, value);
  
  // TODO: Implement full message normalization logic
  // For now, just mark as processed
  await db.update(webhookEvents)
    .set({ status: 'processed', processedAt: new Date() })
    .where(eq(webhookEvents.eventId, eventId));
}

async function processMessagingEvent(eventId: string, messaging: any) {
  // Similar to processMessageEvent but for Facebook Messenger
  console.log(`Processing messaging event ${eventId}`, messaging);
  
  // TODO: Implement full message normalization logic
  await db.update(webhookEvents)
    .set({ status: 'processed', processedAt: new Date() })
    .where(eq(webhookEvents.eventId, eventId));
}
