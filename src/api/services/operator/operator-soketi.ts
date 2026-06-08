// Dedicated Soketi/Pusher connection for the operator harness.
//
// Kept fully separate from the inbox `SoketiService`: the operator uses a
// per-session channel (`private-operator.{app}.{session}`), authenticates
// against apps_service, and listens for the single `activity` event. One shared
// websocket; channels are subscribed/unsubscribed as the user switches chats.

import { API_ENDPOINTS } from "@/api";
import { env } from "@/lib/env";
import Pusher, { Channel } from "pusher-js";
import { OperatorEvent } from "./operator.type";

const ACTIVITY_EVENT = "activity";

type ActivityHandler = (event: OperatorEvent) => void;

class OperatorSoketi {
  private pusher: Pusher | null = null;
  private channels = new Map<string, Channel>();

  private ensure(): Pusher {
    if (this.pusher) return this.pusher;

    // Auth goes through the auth service (same as inbox), which now accepts
    // both private-app-* and private-operator.* channels.
    const authUrl = `${env.authUrl ?? ""}${API_ENDPOINTS.AUTH.SOKETI}`;

    this.pusher = new Pusher(env.pusherAppKey ?? "", {
      cluster: "mt1", // required by pusher-js types; ignored by Soketi
      wsHost: env.pusherHost,
      wsPath: "/soketi",
      enabledTransports: ["ws", "wss"],
      authorizer: (channel) => ({
        authorize: (socketId, callback) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", authUrl, true);
          xhr.withCredentials = true;
          xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded",
          );
          xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) return;
            if (xhr.status === 200) {
              try {
                callback(null, JSON.parse(xhr.responseText));
              } catch {
                callback(
                  new Error("[OperatorSoketi] Invalid auth response"),
                  null,
                );
              }
            } else {
              callback(
                new Error(`[OperatorSoketi] Auth failed (${xhr.status})`),
                null,
              );
            }
          };
          xhr.send(
            `socket_id=${encodeURIComponent(socketId)}&channel_name=${encodeURIComponent(channel.name)}`,
          );
        },
      }),
    });

    return this.pusher;
  }

  /** Subscribe to a session channel; returns an unsubscribe cleanup. */
  subscribe(channelName: string, onActivity: ActivityHandler): () => void {
    const pusher = this.ensure();

    let channel = this.channels.get(channelName);
    if (!channel) {
      channel = pusher.subscribe(channelName);
      this.channels.set(channelName, channel);
    }

    const handler = (data: OperatorEvent) => onActivity(data);
    channel.bind(ACTIVITY_EVENT, handler);

    return () => {
      channel?.unbind(ACTIVITY_EVENT, handler);
      // Unsubscribe the channel entirely when no handlers remain.
      pusher.unsubscribe(channelName);
      this.channels.delete(channelName);
    };
  }

  get isConnected(): boolean {
    return this.pusher?.connection.state === "connected";
  }
}

export const operatorSoketi = new OperatorSoketi();
