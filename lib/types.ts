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

export interface SteamGame {
  appid: number;
  name: string;
  playtime_2weeks?: number;
  playtime_forever: number;
  img_icon_url: string;
  img_logo_url?: string;
}

export interface SteamResponse {
  recentGames: SteamGame[];
  screenshots: string[];
  error?: string;
}

export interface AnimeEntry {
  mal_id: number;
  title: string;
  image_url: string;
  episodes: number | null;
  watched_episodes: number;
  score: number | null;
  status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
}

export interface MalResponse {
  watching: AnimeEntry[];
  favorites: AnimeEntry[];
  error?: string;
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

export interface DramaResponse {
  watching: DramaEntry[];
  favorites: DramaEntry[];
  error?: string;
  message?: string;
}

export type TabId = 'cosplays' | 'anime' | 'games' | 'shows';
