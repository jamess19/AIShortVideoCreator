import { VideoProvider } from "@/hooks/use-video-context";

export default async function EditVideoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { videoId: string };
}) {
  const { videoId } = await params;

  return (
    <VideoProvider videoId={videoId}>
      {children}
    </VideoProvider>
  );
}