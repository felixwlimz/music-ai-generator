"use client";

import {
  Download,
  Loader2,
  Loader2Icon,
  MoreHorizontal,
  Music,
  Pencil,
  Play,
  RefreshCcw,
  Search,
  XCircle,
} from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { getPlayUrl } from "~/actions/generation";
import { renameSong, setPublishedStatus } from "~/actions/song";
import { RenameDialog } from "./rename-dialog";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "~/stores/use-player-store";

export interface Track {
  id: string;
  title: string | null;
  createdAt: Date;
  instrumental: boolean;
  prompt: string | null;
  lyrics: string | null;
  describedLyrics: string | null;
  fullDescribedSong: string | null;
  thumbnailUrl: string | null;
  playUrl: string | null;
  status: string | null;
  createdByUserName: string | null;
  published: boolean;
}

export function TrackList({ tracks }: { tracks: Track[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingTrackId, setLoadingTrackid] = useState<string | null>(null);
  const [trackToRename, setTrackToRename] = useState<Track | null>(null);

  const router = useRouter();
  const { setTrack } = usePlayerStore();

  const handleTrackSelect = async (track: Track) => {
    if (loadingTrackId) return;
    setLoadingTrackid(track.id);
    
    try {
      const playUrl = await getPlayUrl(track.id);
      
      setTrack({
        id: track.id,
        title: track.title,
        url: playUrl,
        artwork: track.thumbnailUrl,
        prompt: track.prompt || track.fullDescribedSong,
        createdByUsername: track.createdByUserName,
      });
    } catch (error) {
      console.error("Failed to load track:", error);
    } finally {
      setLoadingTrackid(null);
    }
  };

  const filteredTracks = tracks.filter(
    (track) =>
      track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.prompt?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-scroll">
      <div className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search.."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            onClick={handleRefresh}
          >
            {isRefreshing ? (
              <Loader2Icon className="mr-2 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2" />
            )}
            {isRefreshing ? "Refreshing" : "Refresh"}
          </Button>
        </div>

        <div className="space-y-2">
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track) => {
              switch (track.status) {
                case "failed":
                  return (
                    <div
                      key={track.id}
                      className="flex cursor-not-allowed items-center gap-4 rounded-lg p-3"
                    >
                      <div className="bg-destructive/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md">
                        <XCircle className="text-destructive h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-destructive truncate text-sm font-medium">
                          Generation failed
                        </h3>
                        <p className="text-muted-foreground truncate text-xs">
                          Please try creating the song again.
                        </p>
                      </div>
                    </div>
                  );
                case "no credits":
                  return (
                    <div
                      key={track.id}
                      className="flex cursor-not-allowed items-center gap-4 rounded-lg p-3"
                    >
                      <div className="bg-destructive/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md">
                        <XCircle className="text-destructive h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-destructive truncate text-sm font-medium">
                          Not enough credits
                        </h3>
                        <p className="text-muted-foreground truncate text-xs">
                          Please purchase more credits to generate this song.
                        </p>
                      </div>
                    </div>
                  );
                case "queued":
                case "processing":
                  return (
                    <div
                      key={track.id}
                      className="flex cursor-not-allowed items-center gap-4 rounded-lg p-3"
                    >
                      <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md">
                        <Loader2Icon className="text-muted-foreground h-6 w-6 animate-spin" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-muted-foreground truncate text-sm font-medium">
                          Processing song...
                        </h3>
                        <p className="text-muted-foreground truncate text-xs">
                          Refresh to check the status.
                        </p>
                      </div>
                    </div>
                  );
                default:
                  return (
                    <div
                      key={track.id}
                      className="hover:bg-muted/50 flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors"
                      onClick={() => handleTrackSelect(track)}
                    >
                      {/* Thumbnail */}
                      <div className="group relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                        {track.thumbnailUrl ? (
                          <img
                            className="h-full w-full object-cover"
                            src={track.thumbnailUrl}
                            alt={track.title || "Track thumbnail"}
                          />
                        ) : (
                          <div className="bg-muted flex h-full w-full items-center justify-center">
                            <Music className="text-muted-foreground h-6 w-6" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                          {loadingTrackId === track.id ? (
                            <Loader2 className="animate-spin text-white" />
                          ) : (
                            <Play className="fill-white text-white" />
                          )}
                        </div>
                      </div>

                      {/* Track info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-medium">
                            {track.title}
                          </h3>
                          {track.instrumental && (
                            <Badge variant="outline">Instrumental</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground truncate text-xs">
                          {track.prompt ||
                            track.fullDescribedSong ||
                            "No description"}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await setPublishedStatus(
                              track.id,
                              !track.published,
                            );
                          }}
                          variant="outline"
                          size="sm"
                          className={`cursor-pointer ${track.published ? "border-red-200" : ""}`}
                        >
                          {track.published ? "Unpublish" : "Publish"}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.stopPropagation();
                                const playUrl = await getPlayUrl(track.id);
                                window.open(playUrl, "_blank");
                              }}
                            >
                              <Download className="mr-2" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.stopPropagation();
                                setTrackToRename(track);
                              }}
                            >
                              <Pencil className="mr-2" /> Rename
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {trackToRename && (
                        <RenameDialog
                          track={trackToRename}
                          onClose={() => setTrackToRename(null)}
                          onRename={(trackId, newTitle) =>
                            renameSong(trackId, newTitle)
                          }
                        />
                      )}
                    </div>
                  );
              }
            })
          ) : (
            <div className="flex flex-col items-center justify-center pt-20 text-center">
              <Music className="text-muted-foreground h-10 w-10" />
              <h2 className="mt-4 text-lg font-semibold">No Music Yet</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {searchQuery
                  ? "No tracks match your search."
                  : "Create your first song to get started."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
