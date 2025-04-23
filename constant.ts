import {
  Home,
  Flame,
  ThumbsUp,
  ListVideo,
  PlaySquare,
  HistoryIcon,
} from "lucide-react";

export const DEFAULT_LIMIT = 10;

export const MainItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Subscription",
    url: "/subscription",
    icon: PlaySquare,
    auth: true,
  },
  {
    title: "Trending",
    url: "/trending",
    icon: Flame,
  },
];

export const PersonalItems = [
  {
    title: "History",
    url: "/history",
    icon: HistoryIcon,
    auth: true,
  },
  {
    title: "Liked Videos",
    url: "/liked",
    icon: ThumbsUp,
    auth: true,
  },
  {
    title: "All Playlists",
    url: "/playlists",
    icon: ListVideo,
    auth: true,
  },
];
