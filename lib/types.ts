export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export interface InstagramResponse {
  posts?: InstagramPost[];
  error?: string;
  message?: string;
}

export interface AnimeEntry {
  mal_id: number;
  title: string;
  image_url: string;
  episodes: number | null;
  watched_episodes: number;
  score: number | null;
  genres?: string[];
  status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
}

export interface MalResponse {
  watching: AnimeEntry[];
  favorites: AnimeEntry[];
  error?: string;
  message?: string;
}

/** @deprecated use MalResponse */
export type MALResponse = MalResponse;

export interface SteamGame {
  appid: number;
  name: string;
  playtime_2weeks?: number;
  playtime_forever: number;
  img_icon_url?: string;
  img_logo_url?: string;
}

export interface SteamScreenshot {
  publishedfileid: string;
  preview_url: string;
  url?: string;
  title?: string;
}

export interface SteamResponse {
  recentGames: SteamGame[];
  screenshots: SteamScreenshot[];
  error?: string;
  mock?: boolean;
}

export interface DramaEntry {
  id: number;
  title: string;
  image_url: string;
  episodes: number | null;
  watched_episodes: number;
  score: number | null;
  status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
  country?: string;
}

/** @deprecated use DramaEntry */
export type DraamaShow = DramaEntry;

export interface DramaResponse {
  watching: DramaEntry[];
  completed?: DramaEntry[];
  favorites?: DramaEntry[];
  error?: string;
  message?: string;
}

export type TabId = 'cosplays' | 'anime' | 'games' | 'shows';
