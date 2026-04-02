'use client';

import { ReusableDialog } from '@workspace/ui/lib/dialog/Dialog';
import { TourVideo } from './TourVideo';
// import type { TourSegment } from '@/lib';

// export type { TourSegment };

export interface TourModalProperties {
  /** Controlled open state */
  open: boolean;
  /** Called when the dialog requests an open-state change */
  onOpenChange: (open: boolean) => void;
  /** URL of the video to play */
  src: string;
  /** Optional poster image shown before the video plays */
  poster?: string;
  /** Ordered list of named segments with timestamps */
  segments: any[];
  // segments: TourSegment[];
  /** Optional transcript lines displayed below the video */
  transcript?: string[];
  /** Extra class names forwarded to TourVideo */
  className?: string;
}

/**
 * TourModal
 *
 * A self-contained, shareable dialog that wraps TourVideo.
 * Drop it into any app — supply your own open/onOpenChange state,
 * video src, segments, and optional transcript.
 *
 * @example
 * <TourModal
 *   open={dialogOpen}
 *   onOpenChange={setDialogOpen}
 *   src="/video/product-tour.mp4"
 *   poster="/images/poster.png"
 *   segments={segments}
 *   transcript={lines}
 * />
 */
export const TourModal = ({
  open,
  onOpenChange,
  src,
  poster,
  segments,
  transcript,
  className,
}: TourModalProperties) => {
  return (
    <ReusableDialog
      trigger={null}
      open={open}
      className="max-w-5xl!"
      onOpenChange={onOpenChange}
    >
      <TourVideo
        src={src}
        poster={poster}
        segments={segments}
        transcript={transcript}
        className={className}
      />
    </ReusableDialog>
  );
};

export default TourModal;
