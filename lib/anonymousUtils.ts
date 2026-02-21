export const ANONYMOUS_ADJECTIVES = [
    "Gizemli", "Uykusuz", "Hızlı", "Yalnız", "Cesur", "Çılgın", "Unutkan",
    "Sessiz", "Neşeli", "Düşünceli", "Aşık", "Heyecanlı", "Komik", "Efsane",
    "Akıllı", "Yorgun", "Zeki", "Kahraman", "Gececi", "Şanslı"
];

export const ANONYMOUS_NOUNS = [
    "Pilot", "Kedi", "Mühendis", "Uzaylı", "Kuş", "Gezgin", "Öğrenci",
    "Ninja", "Şövalye", "Kaptanı", "Roket", "Kartal", "Panda", "Hayalet",
    "Büyücü", "Astronot", "Tavşan", "Aslan", "Yolcu", "Dahisi"
];

export const ANONYMOUS_AVATARS = [
    "👽", "👻", "✈️", "🚀", "🐱", "🐶", "🐼", "🦊", "🦁", "🐢",
    "🦉", "🤖", "🤠", "😎", "🤓", "🦸‍♂️", "🦹‍♀️", "🧛‍♂️", "🧙‍♀️", "🕵️"
];

export const CONFESSION_TAGS = [
    "Kampüs", "Dersler", "Sınavlar", "AşkMeşk", "İtiraf",
    "Tavsiye", "Yemekhane", "Etkinlik", "Şikayet", "Dedikodu"
];

export function generateAnonymousIdentity() {
    const adj = ANONYMOUS_ADJECTIVES[Math.floor(Math.random() * ANONYMOUS_ADJECTIVES.length)];
    const noun = ANONYMOUS_NOUNS[Math.floor(Math.random() * ANONYMOUS_NOUNS.length)];
    const avatar = ANONYMOUS_AVATARS[Math.floor(Math.random() * ANONYMOUS_AVATARS.length)];

    return {
        codeName: `${adj} ${noun}`,
        avatar: avatar
    };
}
