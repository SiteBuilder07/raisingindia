import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, Upload } from 'lucide-react';

export default function AuthorEditor({ author, onSave, onCancel }) {
  const isEditing = !!author;
  const [form, setForm] = useState({
    name: author?.name || '',
    slug: author?.slug || '',
    avatar: author?.avatar || '',
    title: author?.title || '',
    bio: author?.bio || '',
    credentials: (author?.credentials || []).join('\n'),
    expertise: (author?.expertise || []).join('\n'),
    website_url: author?.website_url || '',
    twitter_url: author?.twitter_url || '',
    linkedin_url: author?.linkedin_url || '',
    instagram_url: author?.instagram_url || '',
    is_featured: author?.is_featured || false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    handleChange('avatar', file_url);
    setUploading(false);
    toast.success('Avatar uploaded!');
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (!form.slug.trim()) { toast.error('Slug is required'); return; }
    setSaving(true);
    const data = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      avatar: form.avatar,
      title: form.title.trim(),
      bio: form.bio.trim(),
      credentials: form.credentials.split('\n').map(s => s.trim()).filter(Boolean),
      expertise: form.expertise.split('\n').map(s => s.trim()).filter(Boolean),
      website_url: form.website_url.trim(),
      twitter_url: form.twitter_url.trim(),
      linkedin_url: form.linkedin_url.trim(),
      instagram_url: form.instagram_url.trim(),
      is_featured: form.is_featured,
    };
    try {
      if (isEditing) {
        await base44.entities.Author.update(author.id, data);
        toast.success('Author updated!');
      } else {
        await base44.entities.Author.create(data);
        toast.success('Author created!');
      }
      onSave();
    } catch {
      toast.error('Could not save author. Check the slug is unique.');
    }
    setSaving(false);
  };

  return (
    <div className="bg-white border-2 border-border rounded-2xl p-6 space-y-4">
      <h3 className="font-display text-lg font-bold">{isEditing ? 'Edit Author' : 'New Author'}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Name *</Label>
          <Input value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Dr. Priya Sharma" />
        </div>
        <div className="space-y-1">
          <Label>Slug * (URL)</Label>
          <Input value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="priya-sharma" />
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label>Credential Headline</Label>
          <Input value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="Child Psychologist, PhD · 12 years experience" />
        </div>

        {/* Avatar */}
        <div className="space-y-1 md:col-span-2">
          <Label>Avatar Photo</Label>
          <div className="flex gap-2 items-center">
            {form.avatar && <img src={form.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />}
            <Input value={form.avatar} onChange={e => handleChange('avatar', e.target.value)} placeholder="Paste URL or upload..." className="flex-1" />
            <label className="cursor-pointer">
              <Button type="button" variant="outline" className="gap-2" disabled={uploading} asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </span>
              </Button>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label>Bio</Label>
          <Textarea value={form.bio} onChange={e => handleChange('bio', e.target.value)} placeholder="Share the author's background, approach and what drives them..." className="h-28" />
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label>Credentials & Qualifications (one per line)</Label>
          <Textarea value={form.credentials} onChange={e => handleChange('credentials', e.target.value)} placeholder={'PhD in Child Psychology, AIIMS\nCertified Pediatric Counselor\n12+ years working with families'} className="h-28" />
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label>Areas of Expertise (one per line)</Label>
          <Textarea value={form.expertise} onChange={e => handleChange('expertise', e.target.value)} placeholder={'Newborn sleep\nToddler behaviour\nScreen time'} className="h-24" />
        </div>

        <div className="space-y-1">
          <Label>Website URL</Label>
          <Input value={form.website_url} onChange={e => handleChange('website_url', e.target.value)} placeholder="https://..." />
        </div>
        <div className="space-y-1">
          <Label>Twitter / X URL</Label>
          <Input value={form.twitter_url} onChange={e => handleChange('twitter_url', e.target.value)} placeholder="https://twitter.com/..." />
        </div>
        <div className="space-y-1">
          <Label>LinkedIn URL</Label>
          <Input value={form.linkedin_url} onChange={e => handleChange('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." />
        </div>
        <div className="space-y-1">
          <Label>Instagram URL</Label>
          <Input value={form.instagram_url} onChange={e => handleChange('instagram_url', e.target.value)} placeholder="https://instagram.com/..." />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <Switch checked={form.is_featured} onCheckedChange={v => handleChange('is_featured', v)} />
          <Label>Featured author</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Author'}
        </Button>
      </div>
    </div>
  );
}