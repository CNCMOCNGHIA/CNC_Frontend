// Parse một URL YouTube bất kỳ (watch, youtu.be, shorts, embed, live) → videoId.
// Trả null nếu URL không phải YouTube hoặc không lấy được id.
export function parseYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return id || null;
    }
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = u.pathname.match(/^\/(embed|shorts|v|live)\/([^/?]+)/);
      if (m) return m[2];
    }
  } catch {
    return null;
  }
  return null;
}

export function toYouTubeEmbedUrl(url) {
  const id = parseYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

// BE thường strip <iframe> khi lưu HTML (HtmlSanitizer). Hàm này tìm các thẻ <a>
// trỏ tới YouTube còn sót và replace bằng <iframe> để hiển thị thành player.
export function embedYouTubeLinks(html) {
  if (!html || typeof html !== "string") return html ?? "";
  return html.replace(
    /<a\b[^>]*\bhref=(["'])([^"']+)\1[^>]*>[\s\S]*?<\/a>/gi,
    (match, _quote, href) => {
      const embed = toYouTubeEmbedUrl(href);
      if (!embed) return match;
      return `<iframe class="ql-video" src="${embed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
  );
}
