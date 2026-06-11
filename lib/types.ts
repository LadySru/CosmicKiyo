export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export interface AnimeEntry {
  mal_id: number;
  title: string;
  image_url: string;
  episodes: number | null;
  watched_episodes: number;
  score: number | null;
  genres: string[];
  status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
}

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

export interface DraamaShow {
  id: number | string;
  title: string;
  image_url?: string;
  episodes: number | null;
  watched_episodes: number;
  score: number | null;
  status: 'watching' | 'completed' | 'plan_to_watch' | 'on_hold' | 'dropped';
  country?: string;
  year?: number;
}

export interface MALResponse {
  watching: AnimeEntry[];
  favorites: AnimeEntry[];
}

export interface SteamResponse {
  recentGames: SteamGame[];
  screenshots: SteamScreenshot[];
}

export interface DramaResponse {
  watching: DraamaShow[];
  completed: DraamaShow[];
  error?: string;
}
