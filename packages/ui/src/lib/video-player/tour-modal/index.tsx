'use client';

import { updateQueryParamameters } from '@workspace/ui/hooks';
import { MainButton } from '@workspace/ui/lib/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import type { ComponentProps } from 'react';
import TourModal, {
  TourModalProperties,
} from '@workspace/ui/lib/video-player/tour-modal/dialog-setup';

type MainButtonProps = ComponentProps<typeof MainButton>;

type TourModalButtonProps = {
  buttonLabel: string;
  src: string;
  poster?: string;
  segments: TourModalProperties['segments'];
  transcript: string[];
  modalClassName?: string;
  buttonClassName?: string;
  buttonVariant?: MainButtonProps['variant'];
  buttonProps?: Omit<
    MainButtonProps,
    'children' | 'onClick' | 'variant' | 'className'
  >;
  dataTour?: string;
  queryParamKey?: string;
  queryParamValue?: string;
  onOpen?: () => void;
  onClose?: () => void;
};

export const TourModalButton = ({
  buttonLabel,
  src,
  poster,
  segments,
  transcript,
  modalClassName,
  buttonClassName,
  buttonVariant = 'primary',
  buttonProps,
  dataTour,
  queryParamKey = 'modal',
  queryParamValue = 'tour',
  onOpen,
  onClose,
}: TourModalButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const modalState = searchParameters.get(queryParamKey);
    setDialogOpen(modalState === queryParamValue);
  }, [queryParamKey, queryParamValue, searchParameters]);

  const syncDialogState = useCallback(
    (open: boolean) => {
      setDialogOpen(open);

      if (open) {
        onOpen?.();
      } else {
        onClose?.();
      }

      updateQueryParamameters(router, pathname, searchParameters, {
        [queryParamKey]: open ? queryParamValue : null,
      });
    },
    [
      onClose,
      onOpen,
      pathname,
      queryParamKey,
      queryParamValue,
      router,
      searchParameters,
    ]
  );

  return (
    <div data-tour={dataTour}>
      <MainButton
        {...buttonProps}
        onClick={() => syncDialogState(true)}
        className={buttonClassName}
        variant={buttonVariant}
      >
        {buttonLabel}
      </MainButton>

      <TourModal
        open={dialogOpen}
        onOpenChange={syncDialogState}
        src={src}
        poster={poster}
        segments={segments}
        transcript={transcript}
        className={modalClassName}
      />
    </div>
  );
};
