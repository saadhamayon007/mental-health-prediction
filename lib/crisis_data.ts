export interface SupportResource {
    id: string;
    name: string;
    phone: string;
    category: 'emergency' | 'helpline' | 'professional';
    countries: string[];
    description: Record<string, string>;
}

export const crisisResources: SupportResource[] = [
    {
        id: '1',
        name: 'Rescue 1122 (Pakistan)',
        phone: '1122',
        category: 'emergency',
        countries: ['Pakistan'],
        description: {
            en: 'Emergency medical and rescue service in Pakistan.',
            de: 'Notfallmedizin- und Rettungsdienst in Pakistan.',
            ur: 'پاکستان میں ہنگامی طبی اور ریسکیو سروس۔'
        }
    },
    {
        id: '2',
        name: 'Umang (Pakistan)',
        phone: '0311-7786264',
        category: 'helpline',
        countries: ['Pakistan'],
        description: {
            en: '24/7 Mental health helpline providing empathetic listening.',
            de: '24/7 Hotline für psychische Gesundheit mit empathischem Zuhören.',
            ur: '24/7 ذہنی صحت کی ہیلپ لائن جو ہمدردی کے ساتھ سننے کی سہولت فراہم کرتی ہے۔'
        }
    },
    {
        id: '3',
        name: 'TelefonSeelsorge (Germany)',
        phone: '0800 1110111',
        category: 'helpline',
        countries: ['Germany'],
        description: {
            en: 'Anonymous counseling 24/7 for anyone in a crisis.',
            de: 'Anonyme Beratung rund um die Uhr für jeden in einer Krise.',
            ur: 'بحران میں گھیرے کسی بھی شخص کے لیے 24/7 گمنام مشاورت۔'
        }
    },
    {
        id: '4',
        name: 'Samaritans (UK)',
        phone: '116 123',
        category: 'helpline',
        countries: ['United Kingdom'],
        description: {
            en: 'Free 24/7 support for anyone in distress or at risk of suicide.',
            de: 'Kostenlose 24/7-Unterstützung für alle, die in Not oder selbstmordgefährdet sind.',
            ur: 'کسی بھی پریشانی یا خودکشی کے خطرے میں مبتلا شخص کے لیے مفت 24/7 مدد۔'
        }
    },
    {
        id: '5',
        name: 'Crisis Text Line (Global)',
        phone: 'Text HOME to 741741',
        category: 'helpline',
        countries: ['United States', 'Canada', 'United Kingdom'],
        description: {
            en: 'Text-based crisis support for those who prefer not to call.',
            de: 'Textbasierte Krisenhilfe für diejenigen, die lieber nicht anrufen möchten.',
            ur: 'ٹیکسٹ پر مبنی بحرانی مدد ان لوگوں کے لیے جو کال کرنا پسند نہیں کرتے۔'
        }
    },
    {
        id: '6',
        name: '988 Suicide & Crisis Lifeline (USA)',
        phone: '988',
        category: 'emergency',
        countries: ['United States'],
        description: {
            en: 'The 988 Lifeline provides 24/7, free and confidential support for people in distress.',
            de: 'Die 988 Lifeline bietet rund um die Uhr kostenlose und vertrauliche Unterstützung für Menschen in Not.',
            ur: '988 لائف لائن پریشانی میں مبتلا لوگوں کے لیے 24/7، مفت اور خفیہ مدد فراہم کرتی ہے۔'
        }
    },
    {
        id: '7',
        name: 'NAMI HelpLine (USA)',
        phone: '1-800-950-NAMI',
        category: 'helpline',
        countries: ['United States'],
        description: {
            en: 'NAMI HelpLine is a free, nationwide peer-support service.',
            de: 'Die NAMI HelpLine ist ein kostenloser, landesweiter Peer-Support-Dienst.',
            ur: 'NAMI ہیلپ لائن ایک مفت، ملک گیر پیئر سپورٹ سروس ہے۔'
        }
    }
];
