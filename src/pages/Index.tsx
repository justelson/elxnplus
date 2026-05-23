import { useState, useEffect } from "react";
import { useMedia, MediaType } from "@/hooks/useMedia";
import MediaCard from "@/components/MediaCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, FolderOpen } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { DitheringShader } from "@/components/DitheringShader";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<MediaType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { media, loading, error } = useMedia(activeFilter === "all" ? undefined : activeFilter);

  const { scrollY } = useScroll();
  
  // Progressive transforms based on scroll (0 to 250px)
  const xOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const sOpacity = useTransform(scrollY, [50, 150], [0, 1]);
  const oOpacity = useTransform(scrollY, [100, 200], [0, 1]);
  const oWidth = useTransform(scrollY, [100, 200], ["0em", "0.65em"]);
  const oScale = useTransform(scrollY, [100, 200], [0.5, 1]);

  const filteredMedia = media.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  const filters: { label: string; value: MediaType | "all" }[] = [
    { label: "Everything", value: "all" },
    { label: "Audio Logs", value: "audio" },
    { label: "Video Feeds", value: "video" },
    { label: "Documents", value: "document" },
    { label: "Personal Notes", value: "note" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 md:px-6">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-20 grid min-h-[560px] w-full place-items-center overflow-hidden text-center md:min-h-[620px]"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[440px] w-[min(100%,1180px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
            <DitheringShader
              className="h-full w-full opacity-45 mix-blend-multiply dark:hidden"
              width={1180}
              height={440}
              colorBack="#fff7ed"
              colorFront="#fb923c"
              shape="swirl"
              type="8x8"
              pxSize={7}
              speed={0.25}
              style={{ width: "100%", height: "100%" }}
            />
            <DitheringShader
              className="hidden h-full w-full opacity-65 mix-blend-screen dark:block"
              width={1180}
              height={440}
              colorBack="#050000"
              colorFront="#ff6a00"
              shape="swirl"
              type="8x8"
              pxSize={7}
              speed={0.25}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background)/0.18)_40%,hsl(var(--background))_78%)]" />
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-background via-background/20 to-background" />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 z-0 h-px w-full bg-gradient-to-r from-transparent via-primary/70 to-transparent shadow-[0_0_28px_hsl(var(--primary)/0.55)]"
            initial={{ y: -190, opacity: 0 }}
            animate={{ y: [ -190, 190 ], opacity: [0, 0.9, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          />
          
          <div className="relative z-10 mx-auto w-full max-w-4xl space-y-8 px-0">
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/40 leading-[0.9]">
            The Artifacts <br /> of{" "}
            <span className="text-primary inline-flex items-baseline relative gap-[0.02em]">
              <span>E</span>
              <span>l</span>
              <span className="relative inline-flex w-[0.45em] justify-start">
                <motion.span 
                  style={{ opacity: xOpacity }} 
                  className="text-orange-600 dark:text-orange-300"
                >
                  x
                </motion.span>
                <motion.span 
                  style={{ opacity: sOpacity }} 
                  className="absolute left-0"
                >
                  s
                </motion.span>
              </span>
              <motion.span 
                style={{ width: oWidth }}
                className="inline-block overflow-hidden relative pr-[0.05em]"
              >
                <motion.span
                  style={{ opacity: oOpacity, scale: oScale }}
                  className="inline-block origin-left"
                >
                  o
                </motion.span>
              </motion.span>
              <span>n</span>
            </span>
            </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Welcome to my personal space. This is where I share my files, media, and digital experiments. 
            Everything is curated and free to explore.
          </p>
          

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search through the vault..." 
                className="pl-12 h-14 bg-secondary/30 border-border focus:border-primary/50 transition-all rounded-sm text-base shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          </div>
        </motion.div>

        {/* Filters and Section Header */}
        <div className="space-y-8 mb-12">
          <div className="flex items-center gap-4">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-display font-bold uppercase tracking-widest">Library Collections</h2>
            <div className="h-px bg-gradient-to-r from-primary/50 to-transparent flex-1" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-3"
          >
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "rounded-sm px-6 h-10 transition-all duration-300 font-medium",
                  activeFilter === filter.value 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "hover:bg-primary/5 hover:border-primary/30"
                )}
              >
                {filter.label}
              </Button>
            ))}
          </motion.div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-mono text-sm animate-pulse">Initializing vault access...</p>
          </div>
        ) : error ? (
          <div className="text-center text-muted-foreground py-20 border border-white/5 rounded-sm bg-card/30">
            <p className="font-display text-xl font-bold text-foreground">The vault did not load cleanly.</p>
            <p className="text-sm opacity-80 mt-2 max-w-md mx-auto">
              This usually means the connection was blocked or the archive is temporarily unavailable. Refresh the page and try again.
            </p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center text-muted-foreground py-32 border border-dashed border-white/5 rounded-sm bg-card/20">
            <p className="text-xl font-display font-bold text-foreground">Nothing available here yet.</p>
            <p className="text-sm opacity-80 mt-2 max-w-md mx-auto">
              There are no public files matching this view. Private files only appear after logging in through the admin area.
            </p>
            <Button variant="link" onClick={() => {setSearchQuery(""); setActiveFilter("all");}} className="mt-2 text-primary">
              Clear all filters
            </Button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <MediaCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
