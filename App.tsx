
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { Article, AutomationTask } from './types';
import { getArticles, saveArticle, getArticleBySlug, injectAffiliateLinks, injectAds } from './services/contentService';
import { fetchTrendingKeywords, generateHowToArticle } from './services/gemini';
import { AFFILIATE_LINKS, MOCK_KEYWORDS } from './constants';
import Layout from './components/Layout';
import ArticleCard from './components/ArticleCard';
import { Sparkles, Loader2, AlertCircle, Play, CheckCircle2, ListRestart } from 'lucide-react';

// --- Page Components ---

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setArticles(getArticles());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Latest How-To Guides</h1>
        <p className="text-lg text-gray-600">Step-by-step instructions for life, tech, and everything in between in the Philippines.</p>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="text-gray-400 mb-4 flex justify-center"><ListRestart size={48} /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Articles Yet</h2>
          <p className="text-gray-600 mb-6">Head over to the Automation dashboard to generate some content.</p>
          <Link to="/automation" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">Go to Dashboard</Link>
        </div>
      )}
    </div>
  );
};

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (slug) {
      const found = getArticleBySlug(slug);
      if (found) {
        // Apply monetization
        const monetizedContent = injectAds(injectAffiliateLinks(found.content, AFFILIATE_LINKS));
        setArticle({ ...found, content: monetizedContent });
      }
    }
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-xl font-semibold text-gray-900">Article not found</h2>
          <Link to="/" className="mt-4 text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  // JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-10 text-center">
          <div className="mb-4 inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
            {article.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {article.h1}
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-500 text-sm font-medium">
            <span>By {article.author}</span>
            <span>•</span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </header>

        <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-xl">
          <img src={article.featuredImage} alt={article.h1} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: article.content }} />

        <section className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <span className="bg-blue-600 w-2 h-8 rounded-full"></span> Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {article.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {article.internalLinks.length > 0 && (
          <div className="mt-12 p-6 bg-blue-50 rounded-xl">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Related Topics</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {article.internalLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-blue-700 hover:underline flex items-center gap-2">
                    <CheckCircle2 size={16} /> {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const AutomationDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');

  const runAutomation = async () => {
    setIsProcessing(true);
    setCurrentStep('Fetching trending keywords...');
    
    try {
      const keywords = await fetchTrendingKeywords();
      
      for (const keyword of keywords) {
        const taskId = Math.random().toString(36).substr(2, 9);
        const newTask: AutomationTask = {
          id: taskId,
          status: 'running',
          keyword,
          logs: ['Task started...'],
          timestamp: new Date().toISOString()
        };
        
        setTasks(prev => [newTask, ...prev]);
        setCurrentStep(`Generating article for: ${keyword}`);

        try {
          const article = await generateHowToArticle(keyword);
          saveArticle(article);
          
          setTasks(prev => prev.map(t => 
            t.id === taskId 
              ? { ...t, status: 'completed' as const, logs: [...t.logs, 'Article generated and saved successfully.'] } 
              : t
          ));
        } catch (error) {
          setTasks(prev => prev.map(t => 
            t.id === taskId 
              ? { ...t, status: 'failed' as const, logs: [...t.logs, 'Error: ' + (error as Error).message] } 
              : t
          ));
        }
      }
      
      setCurrentStep('All tasks complete!');
    } catch (error) {
      setCurrentStep('Failed to fetch keywords');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Automation Center</h1>
          <p className="text-gray-600">Monitor and trigger AI content generation.</p>
        </div>
        <button 
          onClick={runAutomation}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
            isProcessing ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
          {isProcessing ? 'Processing...' : 'Run Automation Pipeline'}
        </button>
      </div>

      {isProcessing && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4 text-blue-700 animate-pulse">
          <Sparkles className="text-blue-500" />
          <span className="font-semibold">{currentStep}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Target Keyword</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.length > 0 ? tasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">{task.keyword}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    task.status === 'failed' ? 'bg-red-100 text-red-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {task.status === 'completed' && <CheckCircle2 size={12} />}
                    {task.status === 'running' && <Loader2 size={12} className="animate-spin" />}
                    {task.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(task.timestamp).toLocaleString()}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                  No automation history found. Start a pipeline above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guide/:slug" element={<ArticlePage />} />
          <Route path="/automation" element={<AutomationDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
