import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiPickerImplProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

interface EmojiMartEmoji {
  id: string;
  native: string;
  unified: string;
  shortcodes: string;
}

const EmojiPickerImpl = ({ onSelect, onClose }: EmojiPickerImplProps) => {
  return (
    <Picker
      data={data}
      onEmojiSelect={(emoji: EmojiMartEmoji) => {
        onSelect(emoji.native);
      }}
      onClickOutside={onClose}
      theme="light"
      previewPosition="none"
      skinTonePosition="search"
      set="native"
      maxFrequentRows={2}
      perLine={8}
    />
  );
};

export default EmojiPickerImpl;
