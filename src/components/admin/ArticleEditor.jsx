import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, Send } from 'lucide-react';
import ReactQuill from 'react-quill';

const CATEGORIES = ['world', 'technology', 'business', 'sports', 'health', 'science', 'entertainment', 'politics'];

export default function ArticleEditor({ article, onSave }) {
  const { user } = useAuth();
  const isEditing = !!article;

  const [form, setForm] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    summary: article?.summary || '',
    content: article?.content || '',
    category: article?.category || 'world',
    cover_image: article?.cover_image || '',
    author_name: article?.author_name || user?.full_name || '',
    author_avatar: article?.author_avatar || '',
    status: article?.status || 'draft',
    is_featured: article?.is_featured || false,
    is_breaking: article?.is_breaking || false,
    tags: article?.tags || [],
    reading_time_minutes: article?.reading_time_minutes || 5,
    published_date: article?.published_date || new Date().toISOString(),
  });
  const [tagsInput, setTagsInput] = useState((article?.tags || []).join(', '));
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'title' && !isEditing) {
      setForm(prev => ({
        ...prev,
        [field]: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  };

  const handleSave = async (status) => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setSaving(true);
    const data = {
      ...form,
      status,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      published_date: status === 'published' ? new Date().toISOString() : form.published_date,
      views_count: article?.views_count || 0,
    };

    if (isEditing) {
      await base44.entities.Article.update(article.id, data);
      toast.success('Article updated');
    } else {
      await base44.entities.Article.create(data);
      toast.success('Article created');
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">
        {isEditing ? 'Edit Article' : 'New Article'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Title</Label>
          <Input
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Article headline..."
            className="text-lg font-display"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Summary</Label>
          <Textarea
            value={form.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Brief summary..."
            className="h-20"
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => handleChange('category', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Author Name</Label>
          <Input
            value={form.author_name}
            onChange={(e) => handleChange('author_name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Cover Image URL</Label>
          <Input
            value={form.cover_image}
            onChange={(e) => handleChange('cover_image', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label>Reading Time (minutes)</Label>
          <Input
            type="number"
            value={form.reading_time_minutes}
            onChange={(e) => handleChange('reading_time_minutes', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Tags (comma separated)</Label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="tech, AI, startup"
          />
        </div>

        <div className="flex items-center gap-6 md:col-span-2">
          <div className="flex items-center gap-2">
            <Switch checked={form.is_featured} onCheckedChange={(v) => handleChange('is_featured', v)} />
            <Label>Featured</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.is_breaking} onCheckedChange={(v) => handleChange('is_breaking', v)} />
            <Label>Breaking News</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <ReactQuill
          value={form.content}
          onChange={(v) => handleChange('content', v)}
          className="bg-background rounded-lg"
          theme="snow"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" /> Save Draft
        </Button>
        <Button onClick={() => handleSave('published')} disabled={saving} className="gap-2">
          <Send className="w-4 h-4" /> Publish
        </Button>
      </div>
    </div>
  );
}