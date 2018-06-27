import { Images } from "./images.interface";

export interface ArticleSpi {
  id: Number;
  title: string;
  introText: string;
  fullText: string;
  images: Images;
}