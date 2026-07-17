// TODO: Build out Newsletter Signup component for Saltwater Sprouts
// Stub replacing the Thomas Marine version

type Props = {
  eyebrow?: string
  title?: string
  subtitle?: string
  source?: string
}

export default function NewsletterSignup({
  eyebrow = 'Saltwater Sprouts',
  title = 'Stay Connected',
  subtitle = 'Get early learning tips, center updates, and parenting resources delivered to your inbox.',
}: Props) {
  return (
    <section className="py-16 px-5 md:px-8 bg-[#f0f7f4]">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#2c6b4a]">{eyebrow}</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">{title}</h2>
        <p className="text-gray-500 text-sm md:text-base mb-6 leading-relaxed">{subtitle}</p>
        <form className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c6b4a]/30"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-[#2c6b4a] hover:bg-[#1e4e35] transition-colors"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
