import { useState, lazy, Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Eye, BarChart3, Users, BookOpen } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
const ArticleEditor = lazy(() => import('@/components/admin/ArticleEditor'));
import AdminArticlesTab from '@/components/admin/AdminArticlesTab';
import AdminSpotlightTab from '@/components/admin/AdminSpotlightTab';
import AdminPodcastsTab from '@/components/admin/AdminPodcastsTab';
import AdminCommentsTab from '@/components/admin/AdminCommentsTab';
import AdminSubscribersTab from '@/components/admin/AdminSubscribersTab';
import AdminInsightsTab from '@/components/admin/AdminInsightsTab';
import AdminAuthorsTab from '@/components/admin/AdminAuthorsTab';

export default function Admin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingArticle, setEditingArticle] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const { data: articles = [] } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list('-created_date', 100),
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ['subscribers'],
    queryFn: () => base44.entities.NewsletterSubscriber.list('-created_date'),
  });

  // Admin gate — placed after all hooks to satisfy rules-of-hooks.
  if (user?.role !== 'admin') {
    return <Navigate to="/Home" replace />;
  }

  const totalViews = articles.reduce((sum, a) => sum + (a.views_count || 0), 0);
  const publishedCount = articles.filter(a => a.status === 'published').length;

  const handleEdit = (article) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleNew = () => {
    setEditingArticle(null);
    setShowEditor(true);
  };

  const handleSaved = () => {
    setShowEditor(false);
    setEditingArticle(null);
    queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    queryClient.invalidateQueries({ queryKey: ['articles'] });
  };

  if (showEditor) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Button variant="ghost" onClick={() => setShowEditor(false)} className="mb-4">
          ← Back to Dashboard
        </Button>
        <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Loading editor…</div>}>
          <ArticleEditor article={editingArticle} onSave={handleSaved} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your news content</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="gap-2">
            <Link to="/AdminGuide"><BookOpen className="w-4 h-4" /> Guide</Link>
          </Button>
          <Button onClick={handleNew} className="gap-2">
            <Plus className="w-4 h-4" /> New Article
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Articles', value: articles.length, icon: FileText },
          { label: 'Published', value: publishedCount, icon: Eye },
          { label: 'Total Views', value: totalViews.toLocaleString(), icon: BarChart3 },
          { label: 'Subscribers', value: subscribers.length, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="articles">
        <TabsList className="flex-wrap">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="spotlight">Spotlight</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="mt-6">
          <AdminArticlesTab onEdit={handleEdit} />
        </TabsContent>
        <TabsContent value="spotlight" className="mt-6">
          <AdminSpotlightTab />
        </TabsContent>
        <TabsContent value="podcasts" className="mt-6">
          <AdminPodcastsTab />
        </TabsContent>
        <TabsContent value="comments" className="mt-6">
          <AdminCommentsTab />
        </TabsContent>
        <TabsContent value="subscribers" className="mt-6">
          <AdminSubscribersTab />
        </TabsContent>
        <TabsContent value="insights" className="mt-6">
          <AdminInsightsTab />
        </TabsContent>
        <TabsContent value="authors" className="mt-6">
          <AdminAuthorsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}