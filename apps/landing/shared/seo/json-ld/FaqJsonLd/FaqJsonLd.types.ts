type FaqJsonLdItem = {
  answer: string;
  question: string;
};

export type FaqJsonLdProps = {
  items: FaqJsonLdItem[];
};
