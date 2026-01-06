import React from 'react';

const newsItems = [
    {
        id: 1,
        date: '16 December 2025',
        title: 'World leaders adopt a historic global declaration on noncommunicable diseases and mental health',
        summary: 'A landmark agreement to prioritize mental health alongside other noncommunicable diseases globally.',
        link: 'https://www.who.int/news/item/16-12-2025-world-leaders-adopt-a-historic-global-declaration-on-noncommunicable-diseases-and-mental-health'
    },
    {
        id: 2,
        date: '11 December 2025',
        title: 'New resource on setting up a suicide bereavement support group',
        summary: 'Guidance providing practical steps for creating support networks for those affected by suicide loss.',
        link: 'https://www.who.int/news/item/11-12-2025-new-resource-on-setting-up-a-suicide-bereavement-support-group'
    },
    {
        id: 3,
        date: '10 December 2025',
        title: 'Community mental health services transform patients’ access to care in Barbados',
        summary: 'Feature story on how local community services are revolutionizing mental health access.',
        link: 'https://www.who.int/news-room/feature-stories/detail/community-mental-health-services-transform-patients--access-to-care-in-barbados'
    }
];

interface NewsSectionProps {
    searchQuery: string;
}

export default function NewsSection({ searchQuery }: NewsSectionProps) {
    const filteredNews = newsItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="py-12">
            <h2 className="text-3xl md:text-5xl font-black mb-12 text-white flex items-center gap-4 tracking-tighter uppercase">
                <span className="text-blue-500">World</span> Landscapes
            </h2>

            {filteredNews.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredNews.map(news => (
                        <a
                            key={news.id}
                            href={news.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-card p-10 hover:border-blue-500/30 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-blue-500/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-black text-blue-400 mb-6 block uppercase tracking-[0.2em]">{news.date}</span>
                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                                {news.title}
                            </h3>
                            <p className="text-sm text-white/40 font-bold uppercase tracking-widest line-clamp-3 leading-relaxed">
                                {news.summary}
                            </p>
                        </a>
                    ))}
                </div>
            ) : (
                <p className="text-center text-white/20 text-[10px] font-black uppercase tracking-[0.3em] py-16">No information matching extraction criteria</p>
            )}
        </section>
    );
}
