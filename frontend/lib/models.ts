
export interface Scene{
    scene_id: number
    start_time: number
    end_time: number
    text: string
    bg_image_public_id: string
    bg_music_public_id: string
    bg_image_file_index: number
    bg_music_file_index: number
}
export interface VideoMetadata {
    scenes: Scene[];
}
export interface VideoMetadataJson {
  script: string;
  title: string;
  userId: string;
  voiceId: string;
  videoMetadata: VideoMetadata;
}
export interface Voice{
  gender: string;
  sampleVoiceUrl: string;
  voiceId: string;
  publicId: string;
}
export interface MusicTrack{
  name: string;
  artist: string;
  musicUrl: string;
  publicId : string;
  duration: string;
}
export interface Image{
  image_url: string;
  public_id: string;
}
export interface Video{
  _id: string;
  public_id: string;
  title: string;
  status: string;
  video_url: string;
  userId: string;
  duration: number;
  can_edit: boolean;
}