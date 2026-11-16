import type { CSSProperties, ReactNode } from "react";

interface FaceProps {
  w: number;
  h: number;
  transform: string;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

export function Face({ w, h, transform, style, className = "", children }: FaceProps) {
  return (
    <div
      className={`v-face ${className}`}
      style={{ width: w, height: h, left: -w / 2, top: -h / 2, transform, ...style }}
    >
      {children}
    </div>
  );
}

export function billboardTransform(x: number, y: number, z: number, rot: number, tilt: number) {
  return `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${-rot}deg) rotateX(${-tilt}deg)`;
}

export const INITIAL_ROT = -160;
export const INITIAL_TILT = 22;

export function Billboard({
  x = 0,
  y = 0,
  z = 0,
  children,
  className = "",
  style,
}: {
  x?: number;
  y?: number;
  z?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`v-billboard ${className}`}
      data-bx={x}
      data-by={y}
      data-bz={z}
      style={{ transform: billboardTransform(x, y, z, INITIAL_ROT, INITIAL_TILT), ...style }}
    >
      <div className="v-billboard-inner">{children}</div>
    </div>
  );
}

export function Flat({
  x,
  y,
  w,
  h,
  z = 1,
  rotate = 0,
  style,
  className = "",
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  z?: number;
  rotate?: number;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`v-face ${className}`}
      style={{
        width: w,
        height: h,
        left: -w / 2,
        top: -h / 2,
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
