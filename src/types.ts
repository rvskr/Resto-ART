export interface Case {
  after_image: string | undefined;
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  process: string[];
  duration: string;
  category: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}