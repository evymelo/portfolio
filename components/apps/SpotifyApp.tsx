export default function SpotifyApp() {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-lg font-semibold text-os-ink">
        Ouvindo agora
      </h2>
        <iframe
          src="https://open.spotify.com/embed/playlist/2JWpCMhY4gxG1oLJORWYdf?si=240d34c776d242cb"
          width="100%"
          height="352"
          style={{ borderRadius: 16, border: "none" }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
    </div>
  );
}