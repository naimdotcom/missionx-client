// Emoji picker implementation (lazy-loaded)

import { useState } from "react";

interface EmojiPickerImplProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES = {
  Smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
  ],
  Gestures: [
    "👍",
    "👎",
    "👌",
    "✌️",
    "🤞",
    "🤝",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🙏",
    "✋",
    "🤚",
    "👋",
  ],
  Hearts: [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "💔",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
  ],
  Objects: [
    "🎉",
    "🎊",
    "🎁",
    "🎈",
    "🎂",
    "🎀",
    "🎯",
    "🎮",
    "🎪",
    "🎨",
    "🎭",
    "🎬",
    "🎤",
    "🎧",
    "🎵",
  ],
};

const EmojiPickerImpl = ({ onSelect, onClose }: EmojiPickerImplProps) => {
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof EMOJI_CATEGORIES>("Smileys");

  return (
    <div className="bg-background border rounded-lg shadow-lg w-64">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="text-sm font-semibold">Emoji</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 p-2 border-b overflow-x-auto">
        {Object.keys(EMOJI_CATEGORIES).map((category) => (
          <button
            key={category}
            onClick={() =>
              setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)
            }
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              activeCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="p-2 grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
        {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
          <button
            key={index}
            onClick={() => onSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded transition-colors text-xl"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPickerImpl;
