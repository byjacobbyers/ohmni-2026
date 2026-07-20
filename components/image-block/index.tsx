import ImageBlockInner from '@/components/image-block/image-inner'
import VideoBlock from '@/components/video-block'
import type { ImageBlockProps } from '@/types/components/image-block-type'
import type { VideoBlockProps } from '@/types/components/video-block-type'

type MediaBlockProps = ImageBlockProps &
  Partial<VideoBlockProps> & {
    mediaType?: 'image' | 'video' | string
  }

/** Media — image (default) or video via mediaType. */
export default function ImageBlock(props: MediaBlockProps) {
  if (props.mediaType === 'video') {
    return <VideoBlock {...(props as VideoBlockProps)} />
  }
  return <ImageBlockInner {...props} />
}
