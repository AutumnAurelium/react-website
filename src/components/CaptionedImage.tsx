import Image, { StaticImageData } from 'next/image';
import { ReactNode } from 'react';

export default function CaptionedImage({
  src,
  alt,
  children,
  width,
  height,
  className = ""
}: {
  src: StaticImageData,
  alt: string,
  children?: ReactNode,
  width?: number | string | undefined,
  height?: number | string | undefined,
  className?: string
}) {
  return (
    <figure className={`flex flex-col items-center ${className}`}>
      <div className="flex flex-col items-center" style={{ maxWidth: width ?? '20em' }}>
        <div className="captioned-image-container" style={{ width, height }}>
          <Image
            src={src}
            alt={alt}
            width={typeof width === 'number' ? width : undefined}
            height={typeof height === 'number' ? height : undefined}
          />
        </div>
        <figcaption className="text-sm text-muted-foreground mt-0">{children}</figcaption>
      </div>
    </figure>
  )
}