import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { useBlogPosts } from '../../hooks'
import { formatDate, truncate } from '../../utils'

const CARD_COLORS = ['bg-brand-navy', 'bg-brand-sky', 'bg-[#1C1C1C]']

export default function BlogPreview() {
  const { data, isLoading } = useBlogPosts({ page: 1 })

  // Handle both paginated { data: [] } and plain array responses
  const posts = Array.isArray(data)
    ? data.slice(0, 3)
    : (data as any)?.data?.slice(0, 3) ?? []

  if (isLoading || !posts.length) return null

  return (
    <section className="section-pad bg-brand-cream border-t border-black/6">
      <div className="container-main">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="label mb-3">From the Field</p>
            <h2 className="font-extrabold text-display-sm text-brand-navy">
              Logistics, unwrapped.
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A4A4A] hover:text-brand-sky transition-colors"
          >
            All posts <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post: any, i: number) => (
            <Link
              key={post._id ?? post.id ?? i}
              to={`/blog/${post.slug}`}
              className="group block rounded-3xl overflow-hidden bg-white border border-black/[0.07] transition-all duration-300 hover:-translate-y-0.5"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.05)' }}
            >
              {/* Color block */}
              <div className={`h-48 ${CARD_COLORS[i % CARD_COLORS.length]} relative overflow-hidden`}>
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-dot-dark opacity-40" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/40 text-white backdrop-blur-sm tracking-wide uppercase">
                    Guide
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-3 text-[11px] text-[#888] font-medium">
                  <span>{post.published_at ? formatDate(post.published_at) : ''}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> 4 min read</span>
                </div>
                <h3 className="font-bold text-[15px] text-brand-navy leading-snug group-hover:text-brand-sky transition-colors">
                  {truncate(post.title, 65)}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-[12px] text-[#888] leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}