import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, Upload, Video } from 'lucide-react';

export default function PodcastEditor({ podcast, onSave, onCancel }) {
  const isEditing = !!podcast;
  const [form, setForm] = useState({
    title: podcast?.title || '',
    description: podcast?.description || '',
    audio_url: podcast?.audio_url || '',
    video_url: podcast?.video_url || '',
    cover_image: podcast?.cover_image || '',
    episode_number: podcast?.episode_number || '',
    duration: podcast?.duration || '',
    is_latest: podcast?.is_latest || false,
    published_date: podcast?.published_date || new Date().toISOString(),
  });
  const [saving, setSaving] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAudio(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    handleChange('audio_url', file_url);
    setUploadingAudio(false);
    toast.success('Audio uploaded!');
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingVideo(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    handleChange('video_url', file_url);
    setUploadingVideo(false);
    toast.success('Video uploaded!');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    handleChange('cover_image', file_url);
    setUploadingImage(false);
    toast.success('Image uploaded!');
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    const data = { ...form, episode_number: form.episode_number ? Number(form.episode_number) : undefined };
    if (isEditing) {
      await base44.entities.Podcast.update(podcast.id, data);
      toast.success('Episode updated!');
    } else {
      await base44.entities.Podcast.create(data);
      toast.success('Episode created!');
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="bg-white border-2 border-border rounded-2xl p-6 space-y-4">
      <h3 className="font-display text-lg font-bold">{isEditing ? 'Edit Episode' : 'New Episode'}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1 md:col-span-2">
          <Label>Title *</Label>
          <Input value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="Episode title..." />
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Episode description..." className="h-24" />
        </div>

        <div className="space-y-1">
          <Label>Episode Number</Label>
          <Input type="number" value={form.episode_number} onChange={e => handleChange('episode_number', e.target.value)} placeholder="e.g. 12" />
        </div>

        <div className="space-y-1">
          <Label>Duration</Label>
          <Input value={form.duration} onChange={e => handleChange('duration', e.target.value)} placeholder="e.g. 34:21" />
        </div>

        {/* Video Upload */}
        <div className="space-y-1 md:col-span-2">
          <Label className="flex items-center gap-1"><Video className="w-4 h-4" /> Video File (MP4)</Label>
          <div className="flex gap-2">
            <Input value={form.video_url} onChange={e => handleChange('video_url', e.target.value)} placeholder="Paste video URL or upload..." className="flex-1" />
            <label className="cursor-pointer">
              <Button type="button" variant="outline" className="gap-2" disabled={uploadingVideo} asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  {uploadingVideo ? 'Uploading...' : 'Upload'}
                </span>
              </Button>
              <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
            </label>
          </div>
          {form.video_url && (
            <video controls src={form.video_url} className="w-full rounded-xl mt-2 max-h-48" />
          )}
        </div>

        {/* Audio Upload */}
        <div className="space-y-1 md:col-span-2">
          <Label>Audio File (MP3) — optional</Label>
          <div className="flex gap-2">
            <Input value={form.audio_url} onChange={e => handleChange('audio_url', e.target.value)} placeholder="Paste URL or upload..." className="flex-1" />
            <label className="cursor-pointer">
              <Button type="button" variant="outline" className="gap-2" disabled={uploadingAudio} asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  {uploadingAudio ? 'Uploading...' : 'Upload'}
                </span>
              </Button>
              <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
            </label>
          </div>
          {form.audio_url && (
            <audio controls src={form.audio_url} className="w-full mt-2" />
          )}
        </div>

        {/* Cover Image */}
        <div className="space-y-1 md:col-span-2">
          <Label>Cover Image</Label>
          <div className="flex gap-2">
            <Input value={form.cover_image} onChange={e => handleChange('cover_image', e.target.value)} placeholder="Paste URL or upload..." className="flex-1" />
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
          {form.cover_image && (
            <img src={form.cover_image} alt="cover" className="w-20 h-20 rounded-xl object-cover mt-2" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={form.is_latest} onCheckedChange={v => handleChange('is_latest', v)} />
          <Label>Mark as Latest Episode</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Episode'}
        </Button>
      </div>
    </div>
  );
}