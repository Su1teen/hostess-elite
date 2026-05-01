import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Authed } from "@/components/layout/Authed";
import { PageShell, SectionTitle } from "@/components/layout/PageShell";
import { SocialTabs } from "@/components/social/SocialTabs";
import { StoriesBar } from "@/components/social/StoriesBar";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/social")({
  component: SocialIndex,
});

function SocialIndex() {
  const stories = useAppStore((s) => s.stories);
  const open = useAppStore((s) => s.openStoryViewer);
  const location = useLocation();

  if (location.pathname !== "/social") {
    return <Outlet />;
  }

  return (
    <Authed>
      <PageShell>
        <SectionTitle title="Социальная сеть" subtitle="Друзья, истории и общение" />
        <SocialTabs />

        <StoriesBar />

        <SectionTitle title="Все сторис" subtitle="Тапните, чтобы открыть" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stories.flatMap((ring) =>
            ring.items.map((item) => (
              <button
                key={item.id}
                onClick={() => open(ring.id)}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.06]"
              >
                <img
                  src={item.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />
                <div className="absolute top-2 left-2 right-2 flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-white/60">
                    <img src={ring.authorAvatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-white font-medium drop-shadow truncate">
                    {ring.authorName}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[12px] text-white drop-shadow line-clamp-2">{item.caption}</p>
                  {item.venueName && (
                    <p className="text-[10px] text-white/70 mt-0.5">📍 {item.venueName}</p>
                  )}
                </div>
              </button>
            )),
          )}
        </div>
      </PageShell>
    </Authed>
  );
}
