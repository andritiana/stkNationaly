export interface LiveSection {
    title: string;
    type: string;
    description: string;
    themeIcon: string;
    themeColor: string;
    isDevModeOnly: boolean;
}

export interface LiveSectionPosts extends LiveSection {
    category: number;
}

export interface LiveSectionEmbeddedContent extends LiveSection {
    url: string;
}
