interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white" | "dark";
}

export function BrandLogo({ size = "md", variant = "default" }: BrandLogoProps) {

  // Render the light logo in light mode, and the white logo in dark mode
  return (
    <>
      <img
        src="/logo.png"
        alt="Masteringbackend logo"
        width={'200px'}
        className="object-contain rounded-full block dark:hidden"
      />
      <img
        src="/logo_white.png"
        alt="Masteringbackend logo (white)"
        width={'200px'}
        className="object-contain rounded-full hidden dark:block"
      />
    </>
  );
}
