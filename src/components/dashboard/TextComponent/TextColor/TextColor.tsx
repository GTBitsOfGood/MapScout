import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textColor: {
      setColor: (color: string) => ReturnType;
      unsetColor: () => ReturnType;
    };
  }
}

export const TextColor = Mark.create({
  name: "textColor",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => element.style.color,
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {};
          }
          return {
            style: `color: ${attributes.color}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (element) => (element as HTMLElement).style.color && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setColor:
        (color: string) =>
        ({ chain }) => {
          return chain().setMark(this.name, { color }).run();
        },
      unsetColor:
        () =>
        ({ chain }) => {
          return chain().unsetMark(this.name).run();
        },
    };
  },
});
