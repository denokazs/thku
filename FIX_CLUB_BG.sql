-- HATA ÇÖZÜMÜ: 'logoBackground' kolonu eksikti.
-- Bu script önce kolonu ekler, sonra güncellemeyi yapar.

-- 1. Eksik kolonu ekle
ALTER TABLE clubs ADD COLUMN logoBackground VARCHAR(255) DEFAULT 'from-red-600 to-orange-600';

-- 2. Kulübün arka planını beyaz yap
UPDATE clubs 
SET logoBackground = 'from-white to-slate-200' 
WHERE id = 1770843156022;

-- 3. Sonucu kontrol et
SELECT id, name, logoBackground FROM clubs WHERE id = 1770843156022;
