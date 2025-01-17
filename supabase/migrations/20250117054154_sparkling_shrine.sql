/*
  # Initial schema setup for content management

  1. New Tables
    - `cases` - Portfolio cases
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `before_image` (text)
      - `after_image` (text)
      - `process` (text[])
      - `duration` (text)
      - `category` (text)
      - `created_at` (timestamptz)
      
    - `content_blocks` - Editable website sections
      - `id` (uuid, primary key)
      - `name` (text) - Identifier for the block
      - `title` (text)
      - `description` (text)
      - `updated_at` (timestamptz)
      
    - `contact_info` - Contact information
      - `id` (uuid, primary key)
      - `phone` (text)
      - `email` (text)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users
*/

-- Cases table
CREATE TABLE cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  before_image text NOT NULL, -- Ссылка на изображение до реставрации
  after_image text NOT NULL,  -- Ссылка на изображение после реставрации
  process text[] NOT NULL,
  duration text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Политика для чтения данных всеми пользователями
CREATE POLICY "Allow public read access" ON cases
  FOR SELECT TO public USING (true);

-- Политика для полного доступа только для админов
CREATE POLICY "Allow admin full access" ON cases
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@example.com');

-- Content blocks table
CREATE TABLE content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,  -- Уникальное имя блока контента
  title text NOT NULL,
  description text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Политика для чтения блоков контента всеми пользователями
CREATE POLICY "Allow public read access" ON content_blocks
  FOR SELECT TO public USING (true);

-- Политика для полного доступа только для админов
CREATE POLICY "Allow admin full access" ON content_blocks
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@example.com');

-- Contact info table
CREATE TABLE contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  email text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Политика для чтения контактной информации всеми пользователями
CREATE POLICY "Allow public read access" ON contact_info
  FOR SELECT TO public USING (true);

-- Политика для полного доступа только для админов
CREATE POLICY "Allow admin full access" ON contact_info
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@example.com');

-- Insert initial content blocks
-- Вставляем начальные блоки контента
INSERT INTO content_blocks (name, title, description) VALUES
  ('hero', 'Художественная реставрация мебели', 'Сочетаем традиционное мастерство с художественным видением, создавая уникальные произведения искусства из вашей мебели'),
  ('services', 'Наши услуги', 'Каждый предмет мебели – это холст для нашего творчества, где традиционные техники реставрации сочетаются с художественным мастерством'),
  ('process', 'Наш подход', 'Каждый проект – это уникальное путешествие от идеи до воплощения, где мы сочетаем ремесленное мастерство с художественным видением'),
  ('portfolio', 'Наши работы', 'Каждый проект – это история преображения, где старинная мебель обретает новую жизнь благодаря нашему мастерству'),
  ('contact', 'Контактная информация', 'Свяжитесь с нами для получения консультаций и обсуждения проектов');

-- Вставляем начальную контактную информацию
INSERT INTO contact_info (phone, email) VALUES
  ('+7 (999) 123-45-67', 'info@restoration.ru');

-- Вставляем примеры кейсов для портфолио
INSERT INTO cases (title, description, before_image, after_image, process, duration, category) VALUES
  ('Реставрация кресла 19 века', 'Реставрация антикварного кресла с улучшением состояния ткани и каркаса.', 'https://example.com/before1.jpg', 'https://example.com/after1.jpg', ARRAY['Удаление старой ткани', 'Очистка и восстановление дерева', 'Ремонт ткани'], '3 недели', 'Мебель'),
  ('Восстановление стола с мозаикой', 'Восстановление стола с уникальной мозаичной отделкой.', 'https://example.com/before2.jpg', 'https://example.com/after2.jpg', ARRAY['Чистка мозаики', 'Восстановление деревянной основы', 'Перекраска поверхности'], '2 недели', 'Мебель'),
  ('Реставрация шкафчика с резьбой', 'Реставрация шкафчика с сложной резьбой на фасаде.', 'https://example.com/before3.jpg', 'https://example.com/after3.jpg', ARRAY['Удаление старых слоев лака', 'Ремонт деревянных элементов', 'Восстановление резьбы'], '4 недели', 'Мебель');


-- Политики для загрузки изображений в Storage
CREATE POLICY "Allow admin upload images" ON storage.objects
  FOR INSERT
  USING (auth.role() = 'admin');

-- Политики для публичного чтения изображений
CREATE POLICY "Allow public read access to images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images' AND public);

