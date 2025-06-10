
export interface Scene{
    scene_id: number
    start_time: number
    end_time: number
    text: string
    background_image: string
    background_music: string
}
export interface VideoMetadata {
    scenes: Scene[];
}
export interface VideoMetadataJson {
  script: string;
  title: string;
  userId: string;
  videoMetadata: VideoMetadata;
}