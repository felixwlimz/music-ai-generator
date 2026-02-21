"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { inngest } from "~/inngest/client";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export interface GenerateRequest {
  prompt?: string;
  lyrics?: string;
  fullDescribedSong?: string;
  describedLyrics?: string;
  instrumental?: boolean;
}

export async function generateSong(generateRequest: GenerateRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }
}

export async function queueSong(
  generateRequest: GenerateRequest,
  guidanceScale: number,
  userId: string,
) {
  let title = "Untitled";

  if (generateRequest.describedLyrics) {
    title = generateRequest.describedLyrics;
  }

  if (generateRequest.lyrics) {
    title = generateRequest.lyrics;
  }

  if (generateRequest.fullDescribedSong) {
    title = generateRequest.fullDescribedSong;
  }

  title = title.charAt(0).toUpperCase() + title.slice(1);

  const song = await db.song.create({
    data: {
      userId: userId,
      title: title,
      prompt : generateRequest.prompt,
      lyrics : generateRequest.lyrics,
      fullDescribedSong : generateRequest.fullDescribedSong,
      instrumental : generateRequest.instrumental,
      guidanceScale : guidanceScale
    },
  });

  await inngest.send({
    name: "generate-song-event",
    data: {
      songId: song.id,
      userId: song.userId,
    },
  });
}
