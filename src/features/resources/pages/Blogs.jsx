import  { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Share2,
  Bookmark,
  Search,
} from "../../../shared/components/Icons";
import { Layout } from "../../../shared/components/Layout";
import { Button } from "../../../shared/components/Button";
import { BLOG_POSTS } from "../../../shared/data/blogData";
import { cn } from "../../../shared/utils/cn";

export const Blogs = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(BLOG_POSTS.map((post) => post.category)),
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-bold text-xs uppercase tracking-widest mb-4"
                >
                  <Newspaper size={16} />
                  Insights & Advice
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  THE MOCKMATE{" "}
                  <span className="text-primary-600 font-style-italic">
                    RESOURCES
                  </span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                  Stay ahead in your career loop with expert interview tips,
                  technical deep-dives, and behavioral blueprints.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="relative w-full md:w-96 group">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-900/20 focus:border-primary-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-all"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-6 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all",
                        selectedCategory === cat
                          ? "bg-slate-900 dark:bg-primary-600 text-white shadow-xl shadow-slate-200 dark:shadow-primary-900/20"
                          : "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600",
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-lg">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Calendar size={14} /> {post.date}
                        </span>
                        <span className="flex items-center gap-1.5 font-bold">
                          <Clock size={14} /> {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-black text-xs">
                            {post.author[0]}
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {post.author}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-600 group-hover:bg-primary-600 dark:group-hover:bg-primary-600 group-hover:text-white transition-all duration-300"
                        >
                          <ArrowRight size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-32 bg-slate-50 dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 dark:text-slate-500">
                    <Search size={40} />
                  </div>
                  <p className="text-xl font-bold text-slate-400 dark:text-slate-500">
                    No articles matched your search.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="post"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-12">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center text-slate-400 hover:text-slate-600 mb-8 transition-colors font-bold uppercase text-[10px] tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Resources
                </button>
                <span className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
                  {selectedPost.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                  {selectedPost.title}
                </h1>
                <div className="flex items-center justify-between py-8 border-y border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary-100 dark:shadow-none">
                      {selectedPost.author[0]}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">
                        {selectedPost.author}
                      </p>
                      <p className="text-sm text-slate-400 font-bold">
                        {selectedPost.date} • {selectedPost.readTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all">
                      <Bookmark size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[3rem] overflow-hidden mb-16 shadow-2xl relative">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-auto"
                />
              </div>

              <div className="prose prose-slate dark:prose-invert prose-xl max-w-none text-slate-600 dark:text-slate-300 font-medium leading-[1.8] marker:text-primary-600">
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedPost.content.replace(/\n/g, "<br/>"),
                  }}
                />
              </div>

              <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">
                    Enjoyed this article?
                  </h3>
                  <p className="text-slate-400 font-medium">
                    Get the latest interview blueprints delivered to your inbox.
                  </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white/10 border-white/10 text-white px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/30 flex-1 md:w-64 font-medium"
                  />
                  <Button className="font-bold rounded-2xl whitespace-nowrap">
                    Subscribe
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};
