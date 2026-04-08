'use client';

import { ReusableDialog } from '@workspace/ui/lib/dialog/Dialog';
import { TourVideo, type TourSegment } from './TourVideo';

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
  segments: TourSegment[];
  /** Optional transcript lines displayed below the video */
  transcript?: string[];
  /** Extra class names forwarded to TourVideo */
  className?: string;
}

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
      className="min-w-0! w-[calc(100vw-1.25rem)] max-w-[calc(100vw-1.25rem)] rounded-xl p-3 sm:w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)] sm:p-4 md:p-5 lg:w-full lg:max-w-5xl! lg:p-6 max-h-[92dvh] overflow-y-auto"
      onOpenChange={onOpenChange}
    >
      <TourVideo
        logo={'/images/icon-192.png'}
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
