document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      const originalText = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1200);
    } catch {
      button.textContent = "Copy failed";
    }
  });
});

const prepareVideo = (video) => {
  video.muted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");
  video.setAttribute("playsinline", "");
  video.play().catch(() => {});
};

document.querySelectorAll("video").forEach(prepareVideo);
