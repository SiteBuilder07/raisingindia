import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft, FileText, Star, Eye, Headphones, MessageSquare, Users,
  BarChart3, PenSquare, CheckCircle2, Trash2, Send, Save, Upload, Sparkles,
} from 'lucide-react';

const TABS = [
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'spotlight', label: 'Spotlight', icon: Sparkles },
  { id: 'podcasts', label: 'Podcasts', icon: Headphones },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
  { id: 'subscribers', label: 'Subscribers', icon: Users },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'authors', label: 'Authors', icon: PenSquare },
];

function Section({ id, icon: Icon, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
      </div>
      <div className="prose prose-sm max-w-none prose-headings:font-display prose-li:my-1">
        {children}
      </div>
    </section>
  );
}

function Tip({ children }) {
  return (
    <div className="flex gap-2 items-start bg-accent/5 border border-accent/20 rounded-xl p-3 my-4 not-prose">
      <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
      <p className="text-sm text-foreground m-0">{children}</p>
    </div>
  );
}

export default function AdminGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Guide</h1>
          <p className="text-muted-foreground mt-1">Everything you need to manage RaisingIndia.</p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link to="/Admin"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>
        </Button>
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2 mb-10">
        {TABS.map(({ id, label, icon: Icon }) => (
          <a key={id} href={`#${id}`}>
            <Button variant="secondary" size="sm" className="gap-2 rounded-full">
              <Icon className="w-3.5 h-3.5" /> {label}
            </Button>
          </a>
        ))}
      </div>

      {/* Access */}
      <Card className="mb-10 border-accent/20">
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-bold mb-2">Getting access</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Only accounts with the <strong>admin</strong> role see the <strong>Admin</strong> button in the top navigation.
            If you don't see it, your account isn't an admin — ask an existing admin to invite you with the admin role.
            Non-admins who try to open <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">/Admin</code> directly are sent back to the Home page.
          </p>
        </CardContent>
      </Card>

      {/* Dashboard overview */}
      <div className="mb-10">
        <h2 className="font-display text-2xl font-bold mb-3">The dashboard at a glance</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          The Admin page opens to a dashboard with four stat cards — Total Articles, Published, Total Views, and Subscribers —
          followed by seven tabs. The <strong>New Article</strong> button in the top-right is the fastest way to start writing.
        </p>
      </div>

      <div className="space-y-12">
        {/* Articles */}
        <Section id="articles" icon={FileText} title="Articles">
          <p>Your main content. Each article has a status badge (draft / published), category, and optional Featured flag.</p>
          <h3>Create a new article</h3>
          <ol>
            <li>Click <strong>New Article</strong> (top-right) or open the <strong>Articles</strong> tab.</li>
            <li>Fill in the <strong>Title</strong> — a URL slug is generated automatically from it.</li>
            <li>Add a <strong>Summary</strong>, pick a <strong>Category</strong>, and set the <strong>Author Name</strong>.</li>
            <li>Paste a <strong>Cover Image URL</strong> and set an estimated <strong>Reading Time</strong>.</li>
            <li>Add comma-separated <strong>Tags</strong> and toggle <strong>Featured</strong> or <strong>Breaking News</strong> if relevant.</li>
            <li>Write the body in the rich-text editor.</li>
            <li>Choose <strong>Save Draft</strong> (private) or <strong>Publish</strong> (live on the site).</li>
          </ol>
          <h3>Edit or remove an article</h3>
          <ul>
            <li><PenSquare className="inline w-4 h-4" /> pencil — open the article in the editor.</li>
            <li><Star className="inline w-4 h-4" /> star — toggle Featured (featuring a new article automatically un-features the previous one).</li>
            <li><Trash2 className="inline w-4 h-4" /> trash — delete permanently (you'll be asked to confirm).</li>
          </ul>
          <Tip>Drafts are invisible to readers. Only published articles appear on the homepage, category pages, and search.</Tip>
        </Section>

        {/* Spotlight */}
        <Section id="spotlight" icon={Sparkles} title="Spotlight">
          <p>Community submissions (artwork, stories, kid creations) that readers send in. Items arrive as <em>pending</em> and need your approval before they appear.</p>
          <h3>Review a submission</h3>
          <ul>
            <li><CheckCircle2 className="inline w-4 h-4 text-green-500" /> check — <strong>Approve &amp; Feature</strong> on the homepage.</li>
            <li><Trash2 className="inline w-4 h-4 text-destructive" /> cross — <strong>Reject</strong> (keeps the record, hides it).</li>
            <li><PenSquare className="inline w-4 h-4" /> pencil — edit details (title, creator, city, image, description).</li>
            <li><Trash2 className="inline w-4 h-4" /> trash — permanently delete.</li>
          </ul>
          <h3>Add one yourself</h3>
          <p>Click <strong>New Item</strong>, fill in the title and creator name (required), add an age/city, upload or paste an image, and set the status to <strong>Approved</strong> to feature it.</p>
          <Tip>The ⭐ badge marks items currently featured on the homepage Spotlight section.</Tip>
        </Section>

        {/* Podcasts */}
        <Section id="podcasts" icon={Headphones} title="Podcasts">
          <p>Manage audio/video episodes that appear on the Podcasts page.</p>
          <h3>Add an episode</h3>
          <ol>
            <li>Click <strong>New Episode</strong>.</li>
            <li>Enter the <strong>Title</strong> (required) and a <strong>Description</strong>.</li>
            <li>Set the <strong>Episode Number</strong> and <strong>Duration</strong> (e.g. <code>34:21</code>).</li>
            <li>Upload or paste a <strong>Video</strong> (MP4) and/or <strong>Audio</strong> (MP3) URL, plus a <strong>Cover Image</strong>.</li>
            <li>Toggle <strong>Mark as Latest Episode</strong> to highlight it.</li>
            <li>Click <strong>Save Episode</strong>.</li>
          </ol>
          <p>Use the pencil to edit and the trash to delete an existing episode.</p>
          <Tip>Only one episode should be marked "Latest" at a time — it gets the NEW badge and top placement.</Tip>
        </Section>

        {/* Comments */}
        <Section id="comments" icon={MessageSquare} title="Comments">
          <p>Reader comments are held for moderation — they're never published automatically. A count of pending comments appears at the top of the tab.</p>
          <h3>Moderate</h3>
          <ul>
            <li><CheckCircle2 className="inline w-4 h-4" /> <strong>Approve</strong> — makes the comment visible to all readers.</li>
            <li><Trash2 className="inline w-4 h-4 text-destructive" /> <strong>Delete</strong> — permanently removes it.</li>
          </ul>
          <p>Each comment shows the author name, status badge (Live / Pending), date, and full text. Approved comments can be deleted later if needed.</p>
          <Tip>Comments are rate-limited on the reader side (3 per 5 minutes per browser) to cut down on spam.</Tip>
        </Section>

        {/* Subscribers */}
        <Section id="subscribers" icon={Users} title="Subscribers">
          <p>A read-only list of everyone who joined your newsletter, newest first. Each row shows the email, join date, and whether the subscription is <strong>Active</strong> or <strong>Inactive</strong>.</p>
          <p>Subscribers are added automatically when someone uses the newsletter signup forms on the site. There's nothing to action here — it's for monitoring growth.</p>
        </Section>

        {/* Insights */}
        <Section id="insights" icon={BarChart3} title="Insights">
          <p>A quick analytics view of how your content is performing.</p>
          <ul>
            <li><strong>Top performing articles</strong> — your 10 most-viewed published articles, with view counts. Click any row to open the live article.</li>
            <li><strong>Views by topic</strong> — a bar chart breaking down total views by category, so you can see which topics resonate most.</li>
          </ul>
          <Tip>View counts combine stored article views with recent reader sessions, so numbers update shortly after someone reads an article.</Tip>
        </Section>

        {/* Authors */}
        <Section id="authors" icon={PenSquare} title="Authors">
          <p>Author profiles build reader trust by showing credentials and expertise. Each author gets a public profile page at <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">/author/&lt;slug&gt;</code>.</p>
          <h3>Create an author</h3>
          <ol>
            <li>Click <strong>New Author</strong>.</li>
            <li>Enter the <strong>Name</strong> and a unique <strong>Slug</strong> (URL, e.g. <code>priya-sharma</code>) — both required.</li>
            <li>Add a <strong>Credential Headline</strong> (e.g. "Child Psychologist, PhD · 12 years").</li>
            <li>Upload or paste an <strong>Avatar Photo</strong>.</li>
            <li>Write a <strong>Bio</strong>, then list <strong>Credentials</strong> and <strong>Areas of Expertise</strong> (one per line).</li>
            <li>Add optional social links (Website, Twitter/X, LinkedIn, Instagram).</li>
            <li>Toggle <strong>Featured author</strong> to highlight them, then <strong>Save Author</strong>.</li>
          </ol>
          <h3>Manage authors</h3>
          <ul>
            <li><Eye className="inline w-4 h-4" /> external link — open the live public profile.</li>
            <li><PenSquare className="inline w-4 h-4" /> pencil — edit the profile.</li>
            <li><Trash2 className="inline w-4 h-4" /> trash — delete the profile (their articles stay, just unlinked).</li>
          </ul>
          <Tip>Slugs must be unique — if a save fails, pick a different slug. To show an author's badge on an article, match the article's "Author Name" to the author's profile name.</Tip>
        </Section>
      </div>

      {/* Quick reference */}
      <Card className="mt-12 border-border">
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-bold mb-3">Quick reference: the action icons</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2"><PenSquare className="w-4 h-4 text-muted-foreground" /> Edit</div>
            <div className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-destructive" /> Delete</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-accent" /> Feature</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Approve</div>
            <div className="flex items-center gap-2"><Send className="w-4 h-4 text-accent" /> Publish</div>
            <div className="flex items-center gap-2"><Save className="w-4 h-4 text-muted-foreground" /> Save draft</div>
            <div className="flex items-center gap-2"><Upload className="w-4 h-4 text-muted-foreground" /> Upload file</div>
            <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-muted-foreground" /> View live</div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-8">
        Questions or want a flow added to this guide? Just ask.
      </p>
    </div>
  );
}