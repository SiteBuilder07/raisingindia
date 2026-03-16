import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Upload } from 'lucide-react';

export default function SpotlightEditor({ item, onSave, onCancel }) {
  const isEditing = !!item;
  const [form, setForm] = useState({
    title: item?.title || '',
    author_name: item?.author_name || '',
    author_age: item?.author_age || '',
    author_city: item?.author_city || '',
    description: item?.description || '',
    image_url: item?.image_url || '',
    is_featured: item?.is_featured || false,
    status: item?.status || 'pending',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    handleChange('image_url', file_url);
    setUploadingImage(false);
    toast.success('Image uploaded!');
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.author_name.trim()) {
      toast.error('Title and author name are required');
      return;
    }
    setSaving(true);
    const data = { ...form, author_age: form.author_age ? Number(form.author_age) : undefined };
    if (isEditing) {
      await base44.entities.SpotlightItem.update(item.id, data);
      toast.success('Spotlight item updated!');
    } else {
      await base44.entities.SpotlightItem.create(data);
      toast.success('Spotlight item created!');
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="bg-white border-2 border-border rounded-2xl p-6 space-y-4">
      <h3 className="font-display text-lg font-bold">{isEditing ? 'Edit Spotlight Item' : 'New Spotlight Item'}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1 md:col-span-2">
          <Label>Title *</Label>
          <Input value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="Artwork title..." />
        </div>

        <div className="space-y-1">
          <Label>Author Name *</Label>
          <Input value={form.author_name} onChange={e => handleChange('author_name', e.target.value)} placeholder="Creator's name..." />
        </div>

        <div className="space-y-1">
          <Label>Author Age</Label>
          <Input type="number" value={form.author_age} onChange={e => handleChange('author_age', e.target.value)} placeholder="e.g. 8" />
        </div>

        <div className="space-y-1">
          <Label>City</Label>
          <Input value={form.author_city} onChange={e => handleChange('author_city', e.target.value)} placeholder="e.g. Mumbai" />
        </div>

        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={v => handleChange('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Short description..." className="h-20" />
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label>Image</Label>
          <div className="flex gap-2">
            <Input value={form.image_url} onChange={e => handleChange('image_url', e.target.value)} placeholder="Paste URL or upload..." className="flex-1" />
            <label className="cursor-pointer">
              <Button type="button" variant="outline" className="gap-2" disabled={uploadingImage} asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? 'Uploading...' : 'Upload'}
                </span>
              </Button>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          {form.image_url && (
            <img src={form.image_url} alt="preview" className="w-24 h-24 rounded-xl object-cover mt-2" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={form.is_featured} onCheckedChange={v => handleChange('is_featured', v)} />
          <Label>Featured on Homepage</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Item'}
        </Button>
      </div>
    </div>
  );
}