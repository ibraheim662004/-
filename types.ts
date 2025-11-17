
export enum View {
  IMAGE_GEN = 'Image Generation',
  IMAGE_EDIT = 'Image Editing',
  VIDEO_GEN = 'Video Generation',
  VIDEO_EDIT = 'Video Editing',
  HISTORY = 'History',
}

export enum Tool {
    IMAGE_GEN,
    IMAGE_EDIT,
    VIDEO_GEN,
    VIDEO_EDIT,
}

export interface Asset {
  type: 'image' | 'video';
  url: string;
  prompt: string;
}
