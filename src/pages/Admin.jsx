import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Eye, FileText, Users, BarChart3, Star, CheckCircle2, XCircle, Headphones } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default function Admin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingArticle, setEditingArticle] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  if (user?.role !== 'admin') {
    return <Navigate to="/Home" replace />;
  }

  const { data: articles = [] } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list('-created_date', 100),
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ['subscribers'],
    queryFn: () => base44.entities.NewsletterSubscriber.list('-created_date'),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['all-comments'],
    queryFn: () => base44.entities.Comment.list('-created_date', 50),
  });

  const { data: spotlightItems = [] } = useQuery({
    queryKey: ['admin-spotlight'],
    queryFn: () => base44.entities.SpotlightItem.list('-created_date', 50),
  });

  const { data: podcasts = [] } = useQuery({
    queryKey: ['admin-podcasts'],
    queryFn: () => base44.entities.Podcast.list('-published_date', 50),
  });

  const deleteArticle = useMutation({
    mutationFn: (id) => base44.entities.Article.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Article deleted');
    },
  });

  const setFeaturedArticle = async (article) => {
    // Unfeature all, then feature selected
    const currently = articles.filter(a => a.is_featured && a.id !== article.id);
    await Promise.all(currently.map(a => base44.entities.Article.update(a.id, { is_featured: false })));
    await base44.entities.Article.update(article.id, { is_featured: !article.is_featured });
    queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    toast.success(article.is_featured ? 'Removed from featured' : 'Set as featured article');
  };

  const approveSpotlight = async (item) => {
    await base44.entities.SpotlightItem.update(item.id, { status: 'approved', is_featured: true });
    queryClient.invalidateQueries({ queryKey: ['admin-spotlight'] });
    toast.success('Spotlight item approved & featured!');
  };

  const rejectSpotlight = async (item) => {
    await base44.entities.SpotlightItem.update(item.id, { status: 'rejected', is_featured: false });
    queryClient.invalidateQueries({ queryKey: ['admin-spotlight'] });
    toast.success('Spotlight item rejected');
  };

  const deleteSpotlight = async (id) => {
    await base44.entities.SpotlightItem.delete(id);
    queryClient.invalidateQueries({ queryKey: ['admin-spotlight'] });
    toast.success('Deleted');
  };

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
  };

  if (showEditor) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Button variant="ghost" onClick={() => setShowEditor(false)} className="mb-4">
          ← Back to Dashboard
        </Button>
        <ArticleEditor article={editingArticle} onSave={handleSaved} />
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
        <Button onClick={handleNew} className="gap-2">
          <Plus className="w-4 h-4" /> New Article
        </Button>
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
        </TabsList>

        <TabsContent value="articles" className="mt-6">
          <div className="space-y-3">
            {articles.map(article => (
              <div key={article.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                      {article.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{article.category}</Badge>
                    {article.is_featured && <Badge className="bg-accent text-accent-foreground text-xs border-0">Featured</Badge>}
                  </div>
                  <h3 className="font-semibold truncate">{article.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {article.views_count || 0} views · {article.created_date && format(new Date(article.created_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFeaturedArticle(article)}
                    title="Set as featured"
                  >
                    <Star className={`w-4 h-4 ${article.is_featured ? 'fill-accent text-accent' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(article)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteArticle.mutate(article.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {articles.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No articles yet. Create your first one!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="comments" className="mt-6">
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{comment.author_name || 'Anonymous'}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.created_date), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No comments yet.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="subscribers" className="mt-6">
          <div className="space-y-2">
            {subscribers.map(sub => (
              <div key={sub.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
                <div>
                  <p className="font-medium text-sm">{sub.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {format(new Date(sub.created_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <Badge variant={sub.is_active ? 'default' : 'secondary'} className="text-xs">
                  {sub.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
            {subscribers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No subscribers yet.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}