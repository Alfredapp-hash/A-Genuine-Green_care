import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 80 }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Saltwater Sprouts Early Learning Center"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
