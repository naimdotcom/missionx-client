/**
 * Replier Configuration
 * Defines all UI state and message settings for the SimplifiedReplier component
 */

export interface ReplierConfig {
  /** Warning message to display to the user */
  warningMessage?: string;
  /** Disable text input field */
  disableInput: boolean;
  /** Disable attachment uploads */
  disableAttachments: boolean;
  /** Disable emoji picker */
  disableEmoji: boolean;
  /** Disable send button */
  disableSend: boolean;
}

/**
 * Default replier config (fully enabled)
 */
export const DEFAULT_REPLIER_CONFIG: ReplierConfig = {
  warningMessage: undefined,
  disableInput: false,
  disableAttachments: false,
  disableEmoji: false,
  disableSend: false,
};

/**
 * Disabled replier config (all features disabled)
 * Used when conversation is outside Meta's 24-hour reply window
 */
export const DISABLED_REPLIER_CONFIG: ReplierConfig = {
  warningMessage:
    "According to Meta's policies, you can no longer reply to this conversation because more than 24 hours have passed since the customer's last message.",
  disableInput: true,
  disableAttachments: true,
  disableEmoji: true,
  disableSend: false,
};
