-- ==============================================================================
-- Supabase Schema, RLS & Storage Setup for E-Cell JNCT PU
-- Project: https://supabase.com/dashboard/project/epknnmvmoaamcpswbdpq/sql
-- ==============================================================================

-- ─── 1. TABLES DEFINITIONS ───────────────────────────────────────────────────

-- 1.1 Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  summary TEXT,
  date TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  banner_url TEXT,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Event Custom Fields Table
CREATE TABLE IF NOT EXISTS event_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text',
  options JSONB DEFAULT '[]'::jsonb,
  required BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 Event Registrations Table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  submitted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 Members (Team) Table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  domain TEXT NOT NULL,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.5 Join Requests Table
CREATE TABLE IF NOT EXISTS members_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  year TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.6 Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_email TEXT,
  content TEXT NOT NULL,
  summary TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'Entrepreneurship',
  read_time TEXT DEFAULT '3 min read',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. ENABLE ROW LEVEL SECURITY ─────────────────────────────────────────────

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE members_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- ─── 3. ROW LEVEL SECURITY POLICIES ───────────────────────────────────────────

-- Drop existing policies if re-running to avoid conflicts
DO $$
BEGIN
  -- Events
  DROP POLICY IF EXISTS "Public read published events" ON events;
  -- Event Fields
  DROP POLICY IF EXISTS "Public read fields for published events" ON event_fields;
  -- Event Registrations
  DROP POLICY IF EXISTS "Public can register for events" ON event_registrations;
  -- Members
  DROP POLICY IF EXISTS "Public read members" ON members;
  -- Join Requests
  DROP POLICY IF EXISTS "Public can submit join requests" ON members_join_requests;
  -- Blogs
  DROP POLICY IF EXISTS "Public read published blogs" ON blogs;
  DROP POLICY IF EXISTS "Public can submit pending blogs" ON blogs;
END $$;

-- 3.1 Events: Public can only read published events
CREATE POLICY "Public read published events"
  ON events FOR SELECT
  USING (status = 'published');

-- 3.2 Event Fields: Public can read fields for published events only
CREATE POLICY "Public read fields for published events"
  ON event_fields FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_fields.event_id AND e.status = 'published'
    )
  );

-- 3.3 Event Registrations: Public can only insert, never read (protects PII)
CREATE POLICY "Public can register for events"
  ON event_registrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_registrations.event_id AND e.status = 'published'
    )
  );

-- 3.4 Members: Public can view active team members
CREATE POLICY "Public read members"
  ON members FOR SELECT
  USING (true);

-- 3.5 Join Requests: Public can submit requests
CREATE POLICY "Public can submit join requests"
  ON members_join_requests FOR INSERT
  WITH CHECK (true);

-- 3.6 Blogs: Public read published articles
CREATE POLICY "Public read published blogs"
  ON blogs FOR SELECT
  USING (status = 'published');

-- 3.7 Blogs: Public can submit community drafts
CREATE POLICY "Public can submit pending blogs"
  ON blogs FOR INSERT
  WITH CHECK (status = 'pending');

-- ─── 4. STORAGE POLICIES (ecell-assets) ────────────────────────────────────────

DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read ecell-assets" ON storage.objects;
  DROP POLICY IF EXISTS "Anon upload to registrations folder" ON storage.objects;
END $$;

CREATE POLICY "Public read ecell-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ecell-assets');

CREATE POLICY "Anon upload to registrations folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ecell-assets'
    AND (storage.foldername(name))[1] = 'registrations'
  );

-- ─── 5. INITIAL SEED DATA ─────────────────────────────────────────────────────

-- Seed Default Members
INSERT INTO members (name, role, domain, display_order)
VALUES
  ('Lakshyadeep', 'PRESIDENT', 'core', 10),
  ('Yashaswi', 'VICE PRESIDENT', 'core', 20),
  ('Avdesh', 'CO-ORDINATOR HEAD', 'core', 30),
  ('Animesh', 'OPERATIONAL HEAD', 'core', 40),
  ('Ritika', 'RESEARCH & INNOVATION HEAD', 'core', 50),
  ('Rajneesh', 'TECHNICAL HEAD', 'core', 60),
  ('Geetansh', 'CORPORATE RELATIONS HEAD', 'core', 70),
  ('Bishal', 'SOCIAL MEDIA & DESIGN HEAD', 'core', 80),
  ('Rohit', 'RESEARCH & INNOVATION', 'technical', 90),
  ('Amit', 'TECHNICAL', 'technical', 100),
  ('Shantanu', 'TECHNICAL', 'technical', 110),
  ('Lokesh', 'S M & D', 'creatives', 120),
  ('Hariom', 'S M & D', 'creatives', 130),
  ('Anit', 'S M & D', 'creatives', 140),
  ('Bhupendra Patwari', 'CORPORATE RELATIONS', 'marketing', 150),
  ('Sidhi', 'MANAGEMENT', 'operations', 160),
  ('Pavni', 'MANAGEMENT', 'operations', 170),
  ('Kartavya', 'MANAGEMENT', 'operations', 180),
  ('Lipika', 'MANAGEMENT', 'operations', 190),
  ('Raghav Soni', 'MANAGEMENT', 'operations', 200),
  ('Shrishti', 'MANAGEMENT', 'operations', 210)
ON CONFLICT DO NOTHING;

-- Seed Initial Blogs
INSERT INTO blogs (title, slug, author_name, author_role, summary, content, cover_image, category, read_time, status, created_at)
VALUES 
(
  'Entrepreneurship: One Idea Can Change Everything',
  'entrepreneurship-one-idea-can-change-everything',
  'Raghav',
  'E-Cell Member & Management Team',
  'Entrepreneurship is all about starting something new with an idea and turning it into reality. It is not just about earning money, but solving problems and helping people.',
  'Entrepreneurship is all about starting something new with an idea and turning it into reality. I think entrepreneurship is not just about earning money, but also about solving problems and helping people. An entrepreneur is someone who takes risks, works hard, and tries to make their ideas successful. In today''s world, many young people are starting their own businesses and creating new opportunities. Students can also become entrepreneurs by identifying problems around them and finding simple solutions. For example, a student can develop an app to make college event registrations easier or start a small business with a unique idea. However, starting a business is not always easy because there can be financial problems, competition, and failures. But I believe that failure is a part of learning, and we should never give up because of it. With hard work, patience, confidence, and proper planning, anyone can take the first step towards success. In my opinion, a big business always starts with a small idea, and the most important thing is to believe in yourself and have the courage to start.',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  'Entrepreneurship',
  '2 min read',
  'published',
  '2026-10-09T10:00:00.000Z'
),
(
  'Yearning: The Driving Force Behind Entrepreneurship',
  'yearning-the-driving-force-behind-entrepreneurship',
  'Saumya Chaurasiya',
  'CS (AI) Student & E-Cell R&D Member',
  'We often talk about ideas, innovation, and hard work when discussing entrepreneurship, but one thing that deserves equal attention is yearning—the desire to explore, create, and become something more than what we are today.',
  'We often talk about ideas, innovation, and hard work when discussing entrepreneurship, but one thing that deserves equal attention is yearning—the desire to explore, create, and become something more than what we are today.

I believe every entrepreneurial journey begins with a desire to change something, solve a problem, or turn an idea into reality. Knowledge provides direction, but yearning gives us the motivation to take the first step.

As a Computer Science student specializing in Artificial Intelligence and a member of my college''s E-Cell Research and Development team, I have come to understand that entrepreneurship is not limited to starting a business. It is about curiosity, research, taking initiative, and exploring opportunities beyond our comfort zones.

For me, yearning is about discovering my own potential. It is the feeling that there is always something more to learn, experience, and achieve. It encourages me to look beyond classrooms, explore new perspectives, and understand how ideas can create real-world impact.

However, desire alone cannot build anything meaningful. It must be supported by discipline, patience, and consistent action. An idea may inspire us, but the willingness to work on it, learn from failures, and keep improving is what gives it a chance to succeed.

I believe entrepreneurship begins when we stop seeing our ambitions as distant dreams and start treating them as possibilities worth pursuing.

Every great venture begins with an idea, but the courage to pursue it often begins with a yearning for something more.',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  'Mindset & Innovation',
  '3 min read',
  'published',
  '2026-10-12T10:00:00.000Z'
),
(
  'BEYOND THE CLASSROOM - The Untold Journey of a Student Entrepreneur',
  'beyond-the-classroom-the-untold-journey-of-student-entrepreneur',
  'Pavni',
  'E-Cell Member & Management Team',
  'Entrepreneurship is often presented as filled with freedom, wisdom, and success, but student entrepreneurs balance exams, assignments, tight budgets, and uncertainty. Discover how campus ideas turn into sustainable innovations.',
  'Entrepreneurship is often presented as a journey which is filled with freedom, wisdom, ideas, knowledge, courage, and success.

Usually, people barely discuss the failures and sacrifices they face. Student entrepreneurs have to balance examinations, assignments, a limited budget, and constant uncertainty about whether their idea will succeed.

Students could explore businesses that collect reusable college material, create exchange networks for old books, or transform discarded materials into something useful. The challenge is to build a model that is genuinely useful, safe, affordable, and financially sustainable—not simply to label a product as eco-friendly.

Students can also use digital tools to test a concept more quickly than might have been possible in the past. This can help entrepreneurs research the market, generate ideas, create engaging content, develop prototypes, and automate repetitive tasks.

CONCLUSION: Entrepreneurship is not just about building a business; it is about turning ideas into reality! With creativity, courage, and the right use of technology, students can transform a small idea into meaningful innovation.

Remember, you don''t have to wait until graduation to become an entrepreneur—your journey begins today!',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  'Student Entrepreneurship',
  '2 min read',
  'published',
  '2026-10-05T10:00:00.000Z'
),
(
  'Entrepreneurship: How to Turn Your Idea into a Successful Business',
  'entrepreneurship-how-to-turn-your-idea-into-a-successful-business',
  'Siddhi',
  'E-Cell Member & Management Team',
  'Have you ever thought about starting your own business? Learn what entrepreneurship is, key qualities needed to succeed, actionable steps from idea to funding, and lessons from Zerodha.',
  'Have you ever thought about starting your own business? If you want to become your own boss but don''t know where to start, this blog is for you. Here, you will learn what entrepreneurship is, the qualities needed to succeed, and the steps to start a business. You will also learn how to turn your ideas into a successful business.

What is Entrepreneurship?
Entrepreneurship means starting your own new business by turning a unique idea into reality. It is not just about running a shop, but finding a fresh solution to a problem and taking risks to build it. Simply put, being your own boss and working hard to bring your vision to life is entrepreneurship.

Qualities of an Entrepreneur
• Risk-taking Ability: An entrepreneur is not afraid of failure and is always ready to take big risks to make their business successful.
• Problem Solving: They look at real-world problems that people face every day and create a smart solution for them.
• Example: Vijay Shekhar Sharma (Founder of Paytm), who saw how difficult it was for regular people to make quick payments in India and solved it by introducing easy mobile banking and QR codes.

Benefits of Entrepreneurship
• Freedom and Control: You make all the decisions yourself and choose when and how you want to work.
• Job Creation: Starting a business creates new employment opportunities for other people.
• Economic Impact: Official data from the Indian government shows that recognized startups under the Startup India program have created over 13 to 14 lakh (1.3 to 1.4 million) direct jobs in India.

Steps to Start a Business

1. Find a Good Idea
• Spot a problem: Look for things that make people''s daily lives annoying, expensive, slow, or difficult.
• Fix it practically: Think of a simple, useful product or service that solves that exact problem.
• Test it first: Ask real people if they actually have this problem and if they would pay money to fix it.

2. Make a Business Plan
• How it works: Write down step-by-step how your product or service will be made and delivered to customers.
• Who buys it: Identify your target customers (the exact type of people who need what you are selling).
• How you make money: Explain your pricing and how cash flows into your business.

3. Arrange the Money (Funding)
• Calculate costs: Figure out how much total money you need to buy supplies, run operations, and live on before you turn a profit.

Challenges and Solutions
• Challenge 1: No Money
Solution: Do not look for big investors at the start. Use your own savings to begin small. You can also borrow small amounts of money from family, friends, or online fundraising websites.
• Challenge 2: Fear of Failing
Solution: Do not think of failure as the end. View it as a lesson to learn from. Always build a simple, cheap model of your idea to test it first before spending all your time and money.

Real Example: Zerodha
• Founders: Nithin Kamath and Nikhil Kamath
• What they built: They started Zerodha, one of India''s biggest stockbroking platforms. They made stock market investing easier and cheaper for common people.
• Key Lesson: You don''t need a lot of money or outside investors to build a successful business. If your product is good and saves people money, happy customers can help your business grow by telling others about it. You can compete with big companies without spending much money on ads.

Conclusion
Entrepreneurship is about turning a good idea into a business that solves problems and creates opportunities. To succeed, we need new ideas, proper planning, and hard work. If we believe in our ideas and work towards them, we can build a successful business.

Do you have a business idea? Share it in the comments and take your first step today!',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'Startup Guide',
  '4 min read',
  'published',
  '2026-10-07T10:00:00.000Z'
)
ON CONFLICT (slug) DO NOTHING;
