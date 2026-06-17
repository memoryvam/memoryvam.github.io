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

const videos = Array.from(document.querySelectorAll("video"));
const visibleVideos = new Map();
const MAX_ACTIVE_VIDEOS = 5;

const prepareVideo = (video) => {
  video.muted = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.removeAttribute("loop");
  video.removeAttribute("autoplay");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
};

const syncVideoPlayback = () => {
  const activeVideos = Array.from(visibleVideos.entries())
    .filter(([, ratio]) => ratio >= 0.3)
    .sort(([firstVideo, firstRatio], [secondVideo, secondRatio]) => {
      if (secondRatio !== firstRatio) return secondRatio - firstRatio;
      return firstVideo.getBoundingClientRect().top - secondVideo.getBoundingClientRect().top;
    })
    .slice(0, MAX_ACTIVE_VIDEOS)
    .map(([video]) => video);

  videos.forEach((video) => {
    if (activeVideos.includes(video)) {
      if (!video.ended && video.paused) {
        video.play().catch(() => {});
      }
      return;
    }

    if (!video.paused) {
      video.pause();
    }
  });
};

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleVideos.set(entry.target, entry.intersectionRatio);
      } else {
        visibleVideos.delete(entry.target);
      }
    });

    syncVideoPlayback();
  },
  {
    threshold: [0, 0.3, 0.6, 0.9],
  }
);

videos.forEach((video) => {
  prepareVideo(video);
  videoObserver.observe(video);
});
