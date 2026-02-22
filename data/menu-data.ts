import type { MealItem, DailyMenu } from '@/types';
export type { MealItem, DailyMenu };


export const MONTHLY_MENU: Record<string, DailyMenu[]> = {
    "2026-02": [
        // Hafta 1
        {
            date: '2026-02-02', day: 'Pazartesi', isVegetarian: false,
            calorie: 631, protein: 33.8, carbs: 76.6, fat: 21.0,
            meals: [
                { name: 'Mantar Çorba', calorie: 136, protein: 5.1, carbs: 18.7, fat: 4.5 },
                { name: 'Etli Kurufasulye', calorie: 249, protein: 21.8, carbs: 15.6, fat: 11.1 },
                { name: 'Pirinç Pilavı', calorie: 186, protein: 4.7, carbs: 32.5, fat: 4.1 },
                { name: 'Karışık Turşu', calorie: 60, protein: 2.2, carbs: 9.8, fat: 1.3 },
            ],
        },
        {
            date: '2026-02-03', day: 'Salı', isVegetarian: false,
            calorie: 724, protein: 41.7, carbs: 83.7, fat: 24.6,
            meals: [
                { name: 'Tarhana Çorba', calorie: 93, protein: 3.5, carbs: 12.8, fat: 3.1 },
                { name: 'Ekşili Köfte', calorie: 372, protein: 32.5, carbs: 23.2, fat: 16.5 },
                { name: 'Salçalı Makarna', calorie: 194, protein: 4.9, carbs: 33.9, fat: 4.3 },
                { name: 'Meyve', calorie: 65, protein: 0.8, carbs: 13.8, fat: 0.7 },
            ],
        },
        {
            date: '2026-02-04', day: 'Çarşamba', isVegetarian: true,
            calorie: 1003, protein: 34.3, carbs: 161.4, fat: 24.5,
            meals: [
                { name: 'Mercimek Çorba', calorie: 76, protein: 2.9, carbs: 10.5, fat: 2.5 },
                { name: 'Peynirli Milföy Böreği', calorie: 347, protein: 17.4, carbs: 43.4, fat: 11.6 },
                { name: 'Yumurtalı Ispanak', calorie: 180, protein: 6.8, carbs: 29.2, fat: 4.0 },
                { name: 'Tatlı', calorie: 400, protein: 5.0, carbs: 85.0, fat: 4.4 },
            ],
        },
        {
            date: '2026-02-05', day: 'Perşembe', isVegetarian: false,
            calorie: 776, protein: 47.6, carbs: 81.6, fat: 28.8,
            meals: [
                { name: 'Köylüm Çorba', calorie: 138, protein: 5.2, carbs: 19.0, fat: 4.6 },
                { name: 'Izgara Tavuk But', calorie: 378, protein: 33.1, carbs: 23.6, fat: 16.8 },
                { name: 'Sebzeli Bulgur Pilavı', calorie: 186, protein: 4.7, carbs: 32.5, fat: 4.1 },
                { name: 'Ayran', calorie: 74, protein: 4.6, carbs: 6.5, fat: 3.3 },
            ],
        },
        {
            date: '2026-02-06', day: 'Cuma', isVegetarian: false,
            calorie: 775, protein: 40.4, carbs: 97.0, fat: 25.1,
            meals: [
                { name: 'Ezogelin Çorba', calorie: 128, protein: 4.8, carbs: 17.6, fat: 4.3 },
                { name: 'Fırında Kıymalı Patates', calorie: 287, protein: 25.1, carbs: 17.9, fat: 12.8 },
                { name: 'Yoğurtlu Makarna', calorie: 240, protein: 6.0, carbs: 42.0, fat: 5.3 },
                { name: 'Mısırlı Havuç Salatası', calorie: 120, protein: 4.5, carbs: 19.5, fat: 2.7 },
            ],
        },

        // Hafta 2
        {
            date: '2026-02-09', day: 'Pazartesi', isVegetarian: false,
            calorie: 911, protein: 34.4, carbs: 143.6, fat: 22.1,
            meals: [
                { name: 'Mercimek Çorba', calorie: 76, protein: 2.9, carbs: 10.5, fat: 2.5 },
                { name: 'Etli Taze Fasulye', calorie: 249, protein: 21.8, carbs: 15.6, fat: 11.1 },
                { name: 'Pirinç Pilavı', calorie: 186, protein: 4.7, carbs: 32.5, fat: 4.1 },
                { name: 'Tatlı', calorie: 400, protein: 5.0, carbs: 85.0, fat: 4.4 },
            ],
        },
        {
            date: '2026-02-10', day: 'Salı', isVegetarian: false,
            calorie: 800, protein: 47.5, carbs: 86.8, fat: 29.2,
            meals: [
                { name: 'Mengen Çorba', calorie: 140, protein: 5.2, carbs: 19.2, fat: 4.7 },
                { name: 'Beğendili Tavuk Kavurma', calorie: 369, protein: 32.3, carbs: 23.1, fat: 16.4 },
                { name: 'Arpa Şehriye Pilavı', calorie: 217, protein: 5.4, carbs: 38.0, fat: 4.8 },
                { name: 'Ayran', calorie: 74, protein: 4.6, carbs: 6.5, fat: 3.3 },
            ],
        },
        {
            date: '2026-02-11', day: 'Çarşamba', isVegetarian: false,
            calorie: 999, protein: 48.5, carbs: 131.5, fat: 31.0,
            meals: [
                { name: 'Ezogelin Çorba', calorie: 128, protein: 4.8, carbs: 17.6, fat: 4.3 },
                { name: 'Mantı / Yoğurt', calorie: 442, protein: 11.1, carbs: 77.3, fat: 9.8 },
                { name: 'Sebze Buketi', calorie: 364, protein: 31.8, carbs: 22.8, fat: 16.2 },
                { name: 'Meyve', calorie: 65, protein: 0.8, carbs: 13.8, fat: 0.7 },
            ],
        },
        {
            date: '2026-02-12', day: 'Perşembe', isVegetarian: false,
            calorie: 723, protein: 42.2, carbs: 80.1, fat: 26.0,
            meals: [
                { name: 'Tarhana Çorba', calorie: 93, protein: 3.5, carbs: 12.8, fat: 3.1 },
                { name: 'Kadınbudu Köfte / Püre', calorie: 324, protein: 28.3, carbs: 20.2, fat: 14.4 },
                { name: 'Salçalı Makarna', calorie: 232, protein: 5.8, carbs: 40.6, fat: 5.2 },
                { name: 'Ayran', calorie: 74, protein: 4.6, carbs: 6.5, fat: 3.3 },
            ],
        },
        {
            date: '2026-02-13', day: 'Cuma', isVegetarian: false,
            calorie: 591, protein: 34.0, carbs: 68.3, fat: 20.1,
            meals: [
                { name: 'Brokoli Çorba', calorie: 60, protein: 2.2, carbs: 8.2, fat: 2.0 },
                { name: 'Etli Nohut Yemeği', calorie: 285, protein: 24.9, carbs: 17.8, fat: 12.7 },
                { name: 'Pirinç Pilavı', calorie: 186, protein: 4.7, carbs: 32.5, fat: 4.1 },
                { name: 'Karışık Turşu', calorie: 60, protein: 2.2, carbs: 9.8, fat: 1.3 },
            ],
        },

        // Hafta 3
        {
            date: '2026-02-16', day: 'Pazartesi', isVegetarian: false,
            calorie: 795, protein: 61.3, carbs: 61.2, fat: 33.9,
            meals: [
                { name: 'Ezogelin Çorba', calorie: 128, protein: 4.8, carbs: 17.6, fat: 4.3 },
                { name: 'Çıtır Tavuk / Kızarmış Patates', calorie: 361, protein: 31.6, carbs: 22.6, fat: 16.0 },
                { name: 'Spagetti', calorie: 232, protein: 20.3, carbs: 14.5, fat: 10.3 },
                { name: 'Ayran', calorie: 74, protein: 4.6, carbs: 6.5, fat: 3.3 },
            ],
        },
        {
            date: '2026-02-17', day: 'Salı', isVegetarian: false,
            calorie: 826, protein: 39.7, carbs: 110.8, fat: 24.8,
            meals: [
                { name: 'Sütlü Mısır Çorba', calorie: 145, protein: 5.4, carbs: 19.9, fat: 4.8 },
                { name: 'Etli Türlü', calorie: 312, protein: 27.3, carbs: 19.5, fat: 13.9 },
                { name: 'Pirinç Pilavı', calorie: 186, protein: 4.7, carbs: 32.5, fat: 4.1 },
                { name: 'Vişne Komposto', calorie: 183, protein: 2.3, carbs: 38.9, fat: 2.0 },
            ],
        },
        {
            date: '2026-02-18', day: 'Çarşamba', isVegetarian: false,
            calorie: 786, protein: 41.8, carbs: 93.5, fat: 27.1,
            meals: [
                { name: 'Mercimek Çorba', calorie: 76, protein: 2.9, carbs: 10.5, fat: 2.5 },
                { name: 'Balık', calorie: 394, protein: 19.7, carbs: 49.2, fat: 13.1 },
                { name: 'Sebze Buketi', calorie: 90, protein: 7.9, carbs: 5.6, fat: 4.0 },
                { name: 'Tahin Helva', calorie: 226, protein: 11.3, carbs: 28.2, fat: 7.5 },
            ],
        },
        {
            date: '2026-02-19', day: 'Perşembe', isVegetarian: true,
            calorie: 941, protein: 25.2, carbs: 164.6, fat: 20.1,
            meals: [
                { name: 'Anadolu Çorba', calorie: 139, protein: 5.2, carbs: 19.1, fat: 4.6 },
                { name: 'Kabak Kalye', calorie: 198, protein: 9.9, carbs: 24.8, fat: 6.6 },
                { name: 'Domatesli Makarna', calorie: 204, protein: 5.1, carbs: 35.7, fat: 4.5 },
                { name: 'Tatlı', calorie: 400, protein: 5.0, carbs: 85.0, fat: 4.4 },
            ],
        },
        {
            date: '2026-02-20', day: 'Cuma', isVegetarian: false,
            calorie: 767, protein: 43.3, carbs: 89.6, fat: 26.0,
            meals: [
                { name: 'Mantar Çorba', calorie: 136, protein: 5.1, carbs: 18.7, fat: 4.5 },
                { name: 'Rosto Köfte / Patates Püresi', calorie: 372, protein: 32.5, carbs: 23.2, fat: 16.5 },
                { name: 'Sebzeli Bulgur Pilavı', calorie: 194, protein: 4.9, carbs: 33.9, fat: 4.3 },
                { name: 'Meyve', calorie: 65, protein: 0.8, carbs: 13.8, fat: 0.7 },
            ],
        },

        // Hafta 4
        {
            date: '2026-02-23', day: 'Pazartesi', isVegetarian: true,
            calorie: 602, protein: 25.9, carbs: 81.1, fat: 19.3,
            meals: [
                { name: 'Tarhana Çorba', calorie: 93, protein: 3.5, carbs: 12.8, fat: 3.1 },
                { name: 'Bezelye Yemeği', calorie: 201, protein: 10.1, carbs: 25.1, fat: 6.7 },
                { name: 'Şehriyeli Pirinç Pilavı', calorie: 186, protein: 4.7, carbs: 32.5, fat: 4.1 },
                { name: 'Yoğurt', calorie: 122, protein: 7.6, carbs: 10.7, fat: 5.4 },
            ],
        },
        {
            date: '2026-02-24', day: 'Salı', isVegetarian: false,
            calorie: 822, protein: 42.1, carbs: 104.0, fat: 26.3,
            meals: [
                { name: 'Mantar Çorba', calorie: 136, protein: 5.1, carbs: 18.7, fat: 4.5 },
                { name: 'Çin Usulü Tavuk', calorie: 298, protein: 26.1, carbs: 18.6, fat: 13.2 },
                { name: 'Makarna', calorie: 298, protein: 7.5, carbs: 52.1, fat: 6.6 },
                { name: 'Akdeniz Salata', calorie: 90, protein: 3.4, carbs: 14.6, fat: 2.0 },
            ],
        },
        {
            date: '2026-02-25', day: 'Çarşamba', isVegetarian: false,
            calorie: 1050, protein: 42.5, carbs: 156.9, fat: 28.1,
            meals: [
                { name: 'Ezogelin Çorba', calorie: 128, protein: 4.8, carbs: 17.6, fat: 4.3 },
                { name: 'Etli Bamya Yemeği', calorie: 175, protein: 15.3, carbs: 10.9, fat: 7.8 },
                { name: 'Peynirli Milföy Böreği', calorie: 347, protein: 17.4, carbs: 43.4, fat: 11.6 },
                { name: 'Tatlı', calorie: 400, protein: 5.0, carbs: 85.0, fat: 4.4 },
            ],
        },
        {
            date: '2026-02-26', day: 'Perşembe', isVegetarian: false,
            calorie: 611, protein: 34.0, carbs: 69.0, fat: 22.2,
            meals: [
                { name: 'Mercimek Çorba', calorie: 76, protein: 2.9, carbs: 10.5, fat: 2.5 },
                { name: 'Ankara Tava', calorie: 371, protein: 18.6, carbs: 46.4, fat: 12.4 },
                { name: 'Sebze Buketi', calorie: 90, protein: 7.9, carbs: 5.6, fat: 4.0 },
                { name: 'Ayran', calorie: 74, protein: 4.6, carbs: 6.5, fat: 3.3 },
            ],
        },
        {
            date: '2026-02-27', day: 'Cuma', isVegetarian: false,
            calorie: 802, protein: 43.9, carbs: 96.1, fat: 26.8,
            meals: [
                { name: 'Yayla Çorba', calorie: 140, protein: 5.2, carbs: 19.2, fat: 4.7 },
                { name: 'Çiftlik Köfte', calorie: 367, protein: 32.1, carbs: 22.9, fat: 16.3 },
                { name: 'Mercimekli Bulgur Pilavı', calorie: 230, protein: 5.8, carbs: 40.2, fat: 5.1 },
                { name: 'Meyve', calorie: 65, protein: 0.8, carbs: 13.8, fat: 0.7 },
            ],
        },
    ]
};
