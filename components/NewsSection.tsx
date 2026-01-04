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
        <section className="py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6">
            <h2 className="text-3xl font-bold mb-8 text-zinc-800 dark:text-zinc-100 flex items-center gap-3">
                <span className="text-blue-600">Latest Updates</span> from WHO
            </h2>

            {filteredNews.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredNews.map(news => (
                        <a
                            key={news.id}
                            href={news.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-zinc-100 dark:border-zinc-700 group"
                        >
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 block">{news.date}</span>
                            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2 group-hover:text-blue-600 transition-colors">
                                {news.title}
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                                {news.summary}
                            </p>
                        </a>
                    ))}
                </div>
            ) : (
                <p className="text-center text-zinc-500 py-8">No updates found matching your search.</p>
            )}
        </section>
    );
}
