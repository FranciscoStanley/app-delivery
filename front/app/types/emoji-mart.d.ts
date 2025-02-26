declare module "emoji-mart" {
  import * as React from "react";

  export interface EmojiData {
    id: string;
    name: string;
    native: string;
    // adicione outras propriedades conforme necessário
  }

  export interface PickerProps {
    onSelect: (emoji: EmojiData) => void;
    style?: React.CSSProperties;
    // inclua outras props que você utilizar
  }

  const Picker: React.FC<PickerProps>;

  export { Picker };
}
