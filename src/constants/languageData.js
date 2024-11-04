// src/constants/languageData.js

export const LANGUAGE_DATA = {
    english: {
      name: 'English',
      script: 'Latin',
      writingDirection: 'left-to-right',
      levels: {
        beginner: {
          name: 'Basic Letters',
          characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
          description: 'Learn to write capital letters of the English alphabet'
        },
        intermediate: {
          name: 'Lowercase Letters',
          characters: 'abcdefghijklmnopqrstuvwxyz'.split(''),
          description: 'Practice writing lowercase letters'
        },
        advanced: {
          name: 'Common Combinations',
          characters: ['th', 'ch', 'sh', 'ph', 'wh', 'qu', 'ck', 'ng'],
          description: 'Master common letter combinations'
        }
      }
    },
    telugu: {
      name: 'తెలుగు',
      script: 'Telugu',
      writingDirection: 'left-to-right',
      levels: {
        beginner: {
          name: 'Basic Vowels (అచ్చులు)',
          characters: 'అ આ ఇ ఈ ఉ ఊ ఋ ఎ ఏ ఐ ఒ ఓ ఔ'.split(' '),
          description: 'Learn Telugu vowels and their formations'
        },
        intermediate: {
          name: 'Basic Consonants (హల్లులు)',
          characters: 'క ఖ గ ఘ ఙ చ ఛ జ ఝ ఞ ట ఠ డ ఢ ణ త థ ద ధ న ప ఫ బ భ మ య ర ల వ శ ష స హ ళ క్ష జ్ఞ'.split(' '),
          description: 'Practice Telugu consonants'
        },
        advanced: {
          name: 'Consonant Combinations (గుణింతాలు)',
          characters: ['క్కా', 'త్తా', 'ప్పా', 'చ్చా', 'ట్టా'],
          description: 'Master complex consonant combinations'
        }
      }
    },
    hindi: {
      name: 'हिंदी',
      script: 'Devanagari',
      writingDirection: 'left-to-right',
      levels: {
        beginner: {
          name: 'Vowels (स्वर)',
          characters: 'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ'.split(' '),
          description: 'Learn Hindi vowels and their variations'
        },
        intermediate: {
          name: 'Consonants (व्यंजन)',
          characters: 'क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह'.split(' '),
          description: 'Practice Hindi consonants'
        },
        advanced: {
          name: 'Matras (मात्राएँ)',
          characters: ['का', 'कि', 'की', 'कु', 'कू', 'के', 'कै', 'को', 'कौ'],
          description: 'Master vowel markers (matras)'
        }
      }
    },
    japanese: {
      name: '日本語',
      script: 'Japanese',
      writingDirection: 'left-to-right',
      levels: {
        beginner: {
          name: 'Hiragana',
          characters: 'あ い う え お か き く け こ さ し す せ そ た ち つ て と な に ぬ ね の は ひ ふ へ ほ ま み む め も や ゆ よ ら り る れ ろ わ を ん'.split(' '),
          description: 'Learn basic Hiragana characters'
        },
        intermediate: {
          name: 'Katakana',
          characters: 'ア イ ウ エ オ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ト ナ ニ ヌ ネ ノ ハ ヒ フ ヘ ホ マ ミ ム メ モ ヤ ユ ヨ ラ リ ル レ ロ ワ ヲ ン'.split(' '),
          description: 'Practice Katakana characters'
        },
        advanced: {
          name: 'Basic Kanji',
          characters: ['日', '本', '人', '大', '小', '山', '川', '木', '火', '水'],
          description: 'Master basic Kanji characters'
        }
      }
    }
  };
  
  export const WRITING_GUIDANCE = {
    english: {
      general: [
        'Write on the baseline',
        'Maintain consistent letter size',
        'Keep spacing between letters even'
      ],
      uppercase: [
        'Start capital letters at the top',
        'Make letters touch the top and bottom lines',
        'Keep vertical lines straight'
      ],
      lowercase: [
        'Pay attention to ascenders and descenders',
        'Maintain consistent x-height',
        'Round letters should have similar shapes'
      ]
    },
    telugu: {
      general: [
        'Write characters within imaginary boxes',
        'Pay attention to curves and loops',
        'Connect components properly'
      ],
      vowels: [
        'Start from the top',
        'Make curves flowing and continuous',
        'Keep proportions balanced'
      ],
      consonants: [
        'Observe the base character shape',
        'Add vowel marks correctly',
        'Maintain proper spacing between components'
      ]
    },
    hindi: {
      general: [
        'Follow the headline (शिरोरेखा)',
        'Connect characters properly',
        'Maintain consistent character size'
      ],
      vowels: [
        'Write clear distinctions between similar vowels',
        'Pay attention to initial, medial, and final forms',
        'Keep matras properly aligned'
      ],
      consonants: [
        'Start from the headline',
        'Make proper joints between characters',
        'Keep proper spacing between words'
      ]
    },
    japanese: {
      general: [
        'Follow proper stroke order',
        'Maintain character balance',
        'Keep consistent character size'
      ],
      hiragana: [
        'Write with flowing strokes',
        'Pay attention to stroke endings',
        'Keep proper proportions'
      ],
      katakana: [
        'Make sharp, angular strokes',
        'Keep consistent line thickness',
        'Maintain proper spacing'
      ],
      kanji: [
        'Follow correct stroke order',
        'Balance component sizes',
        'Pay attention to radical placement'
      ]
    }
  };