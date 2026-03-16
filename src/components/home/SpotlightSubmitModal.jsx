import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SpotlightSubmitModal({ onClose }) {
  const [form, setForm] = useState({ title: '', author_name: '', author_age: '', author_city: '', description: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author_name) {
      toast.error('Title and name are required.');
      return;
    }
    setUploading(true);
    let image_url = '';
    if (file) {
      const res = await base44.integrations.Core.UploadFile({ file });
      image_url = res.file_url;
    }
    await base44.entities.SpotlightItem.create({
      ...form,
      author_age: form.author_age ? parseInt(form.author_age) : undefined,
      image_url,
      status: 'pending',
      is_featured: false,
    });
    setUploading(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="font-display font-black text-xl">✏️ Submit Your Work</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="font-display font-black text-xl mb-2">Submitted! 🎉</h4>
            <p className="text-muted-foreground text-sm">
              Thank you for sharing! Our team will review your submission and feature it in the Spotlight if selected.
            </p>
            <Button onClick={onClose} className="mt-6 rounded-full font-bold">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <Label>Title of Your Work *</Label>
              <Input placeholder="e.g. My Summer Drawing" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Your Name *</Label>
                <Input placeholder="Name" value={form.author_name} onChange={e => setForm(p => ({...p, author_name: e.target.value}))} required />
              </div>
              <div className="space-y-1">
                <Label>Age</Label>
                <Input type="number" placeholder="e.g. 8" value={form.author_age} onChange={e => setForm(p => ({...p, author_age: e.target.value}))} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input placeholder="Mumbai, Delhi..." value={form.author_city} onChange={e => setForm(p => ({...p, author_city: e.target.value}))} />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea placeholder="Tell us about your work..." value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="h-20" />
            </div>
            <div className="space-y-1">
              <Label>Upload Image</Label>
              <label className="flex items-center gap-3 border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-accent/50 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-semibold">
                  {file ? file.name : 'Click to upload your artwork'}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
              </label>
            </div>
            <Button type="submit" disabled={uploading} className="w-full rounded-full font-bold bg-accent hover:bg-accent/90">
              {uploading ? 'Submitting...' : 'Submit Work 🌟'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}