"""
LingoKa Hiligaynon Language Module

Hiligaynon (also called Ilonggo) is an Austronesian language spoken primarily
in the Western Visayas region of the Philippines, particularly in Iloilo,
Negros Occidental, Guimaras, and parts of Capiz.

Approximately 9-10 million speakers.
"""
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
from enum import Enum


class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    ELEMENTARY = "elementary"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class Phrase(BaseModel):
    """A phrase with translation and pronunciation"""
    hiligaynon: str
    english: str
    pronunciation: str
    literal: Optional[str] = None
    context: Optional[str] = None
    audio_id: Optional[str] = None


class VocabularyWord(BaseModel):
    """A vocabulary word with details"""
    word: str
    english: str
    pronunciation: str
    part_of_speech: str
    example_sentence: Optional[str] = None
    example_translation: Optional[str] = None


class CulturalNote(BaseModel):
    """Cultural context information"""
    title: str
    content: str
    related_phrases: List[str] = []


class Exercise(BaseModel):
    """Practice exercise"""
    exercise_type: str  # multiple_choice, fill_blank, translate, matching, speaking
    question: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: str
    difficulty: DifficultyLevel = DifficultyLevel.BEGINNER


class HiligaynonModule:
    """
    Comprehensive Hiligaynon language learning module.

    Hiligaynon is known for its melodic, gentle sound and is often
    considered one of the most romantic-sounding Philippine languages.
    """

    LANGUAGE_INFO = {
        "name": "Hiligaynon",
        "alternate_names": ["Ilonggo", "Hiligaynon Visayan"],
        "native_name": "Hiligaynon",
        "speakers": "9-10 million",
        "region": "Western Visayas, Philippines",
        "provinces": ["Iloilo", "Negros Occidental", "Guimaras", "Capiz", "Antique"],
        "language_family": "Austronesian > Malayo-Polynesian > Philippine > Visayan",
        "writing_system": "Latin alphabet (Abakada)",
        "fun_fact": "Known as one of the sweetest and most melodic Philippine languages"
    }

    # ===================
    # PRONUNCIATION GUIDE
    # ===================

    PRONUNCIATION_GUIDE = {
        "vowels": {
            "a": {"sound": "ah", "example": "like 'a' in 'father'", "hiligaynon_example": "aga (morning)"},
            "e": {"sound": "eh", "example": "like 'e' in 'bed'", "hiligaynon_example": "edad (age)"},
            "i": {"sound": "ee", "example": "like 'ee' in 'see'", "hiligaynon_example": "init (hot)"},
            "o": {"sound": "oh", "example": "like 'o' in 'go'", "hiligaynon_example": "oras (hour)"},
            "u": {"sound": "oo", "example": "like 'oo' in 'food'", "hiligaynon_example": "ulan (rain)"}
        },
        "consonants": {
            "ng": {"sound": "ng", "example": "like 'ng' in 'sing', can appear at start of words", "hiligaynon_example": "ngalan (name)"},
            "r": {"sound": "r", "example": "slightly rolled, softer than Spanish 'r'", "hiligaynon_example": "relo (watch)"},
            "y": {"sound": "y", "example": "like 'y' in 'yes'", "hiligaynon_example": "yawa (devil - mild expletive)"},
            "w": {"sound": "w", "example": "like 'w' in 'water'", "hiligaynon_example": "wala (none)"}
        },
        "stress_rules": [
            "Stress is typically on the second-to-last syllable",
            "Accent marks (´) indicate stress on a different syllable",
            "Glottal stops are common but usually unmarked in writing",
            "The language has a gentle, flowing rhythm"
        ],
        "tips": [
            "Hiligaynon sounds softer and more melodic than Tagalog",
            "Words are generally pronounced as spelled",
            "Practice the 'ng' sound at the beginning of words - it's common!",
            "Listen for the musical intonation patterns"
        ]
    }

    # ==================
    # GREETINGS & BASICS
    # ==================

    GREETINGS = [
        Phrase(
            hiligaynon="Maayong aga",
            english="Good morning",
            pronunciation="mah-AH-yong AH-gah",
            context="Used until about 11 AM"
        ),
        Phrase(
            hiligaynon="Maayong udto",
            english="Good noon",
            pronunciation="mah-AH-yong OOD-toh",
            context="Used around noon (11 AM - 1 PM)"
        ),
        Phrase(
            hiligaynon="Maayong hapon",
            english="Good afternoon",
            pronunciation="mah-AH-yong HAH-pon",
            context="Used from about 1 PM until sunset"
        ),
        Phrase(
            hiligaynon="Maayong gab-i",
            english="Good evening",
            pronunciation="mah-AH-yong gahb-EE",
            context="Used after sunset"
        ),
        Phrase(
            hiligaynon="Kumusta ka?",
            english="How are you?",
            pronunciation="koo-MOOS-tah kah",
            literal="How you?",
            context="Informal, for friends and peers"
        ),
        Phrase(
            hiligaynon="Kumusta kamo?",
            english="How are you? (plural/formal)",
            pronunciation="koo-MOOS-tah KAH-moh",
            context="Used for multiple people or to show respect"
        ),
        Phrase(
            hiligaynon="Maayo man",
            english="I'm fine / I'm good",
            pronunciation="mah-AH-yoh mahn",
            literal="Good indeed"
        ),
        Phrase(
            hiligaynon="Maayo man, salamat",
            english="I'm fine, thank you",
            pronunciation="mah-AH-yoh mahn, sah-LAH-maht"
        ),
        Phrase(
            hiligaynon="Salamat",
            english="Thank you",
            pronunciation="sah-LAH-maht"
        ),
        Phrase(
            hiligaynon="Salamat gid",
            english="Thank you very much",
            pronunciation="sah-LAH-maht jid",
            literal="Thank you indeed",
            context="'Gid' adds emphasis, like 'very much'"
        ),
        Phrase(
            hiligaynon="Wala sapayan",
            english="You're welcome / It's nothing",
            pronunciation="wah-LAH sah-PAH-yahn",
            literal="No problem"
        ),
        Phrase(
            hiligaynon="Oo",
            english="Yes",
            pronunciation="oh-OH"
        ),
        Phrase(
            hiligaynon="Indi / Wala",
            english="No / None",
            pronunciation="in-DEE / wah-LAH",
            context="'Indi' is 'no', 'Wala' is 'none/nothing'"
        ),
        Phrase(
            hiligaynon="Palihog",
            english="Please",
            pronunciation="pah-lee-HOG"
        ),
        Phrase(
            hiligaynon="Pasensya na",
            english="I'm sorry / Excuse me",
            pronunciation="pah-SEN-syah nah",
            context="Used for apologies and getting attention"
        ),
        Phrase(
            hiligaynon="Paalam na",
            english="Goodbye",
            pronunciation="pah-AH-lahm nah",
            literal="Permission to leave"
        ),
        Phrase(
            hiligaynon="Hasta la byernes",
            english="See you on Friday",
            pronunciation="HAHS-tah lah BYER-nes",
            context="Spanish influence - days of week use Spanish"
        )
    ]

    # ===============
    # COMMON PHRASES
    # ===============

    COMMON_PHRASES = [
        # Introductions
        Phrase(
            hiligaynon="Ano ang ngalan mo?",
            english="What is your name?",
            pronunciation="AH-noh ahng NGAH-lahn moh"
        ),
        Phrase(
            hiligaynon="Ang ngalan ko si...",
            english="My name is...",
            pronunciation="ahng NGAH-lahn koh see...",
            literal="The name my is..."
        ),
        Phrase(
            hiligaynon="Taga-diin ka?",
            english="Where are you from?",
            pronunciation="tah-gah-dee-IN kah"
        ),
        Phrase(
            hiligaynon="Taga-Iloilo ako",
            english="I'm from Iloilo",
            pronunciation="tah-gah-ee-loh-EE-loh AH-koh"
        ),

        # Basic Questions
        Phrase(
            hiligaynon="Ano ini?",
            english="What is this?",
            pronunciation="AH-noh ee-NEE"
        ),
        Phrase(
            hiligaynon="Diin ang...?",
            english="Where is...?",
            pronunciation="dee-IN ahng"
        ),
        Phrase(
            hiligaynon="Pila ini?",
            english="How much is this?",
            pronunciation="PEE-lah ee-NEE",
            context="Essential for shopping and markets"
        ),
        Phrase(
            hiligaynon="Ano oras na?",
            english="What time is it?",
            pronunciation="AH-noh OH-rahs nah"
        ),

        # Polite Expressions
        Phrase(
            hiligaynon="Pwede bala...?",
            english="May I...? / Can I...?",
            pronunciation="PWEH-deh BAH-lah",
            context="Polite way to ask permission"
        ),
        Phrase(
            hiligaynon="Dali lang",
            english="Just a moment",
            pronunciation="dah-LEE lahng"
        ),
        Phrase(
            hiligaynon="Sige",
            english="Okay / Go ahead",
            pronunciation="SEE-geh",
            context="Very common affirmation"
        ),
        Phrase(
            hiligaynon="Ambot",
            english="I don't know",
            pronunciation="ahm-BOT"
        ),

        # Feelings & States
        Phrase(
            hiligaynon="Gutom na ako",
            english="I'm hungry",
            pronunciation="GOO-tohm nah AH-koh"
        ),
        Phrase(
            hiligaynon="Uhaw na ako",
            english="I'm thirsty",
            pronunciation="OO-haw nah AH-koh"
        ),
        Phrase(
            hiligaynon="Kapoy na ako",
            english="I'm tired",
            pronunciation="kah-POY nah AH-koh"
        ),
        Phrase(
            hiligaynon="Nalipay ako",
            english="I'm happy",
            pronunciation="nah-lee-PIE AH-koh"
        ),
        Phrase(
            hiligaynon="Masakit ang...",
            english="My ... hurts",
            pronunciation="mah-sah-KIT ahng"
        ),

        # Social Phrases
        Phrase(
            hiligaynon="Kaon na ta!",
            english="Let's eat!",
            pronunciation="kah-ON nah tah",
            context="Filipinos often invite others to eat - very common phrase"
        ),
        Phrase(
            hiligaynon="Malipayon nga adlaw!",
            english="Happy birthday!",
            pronunciation="mah-lee-PAH-yon ngah AHD-law",
            literal="Happy (that) day"
        ),
        Phrase(
            hiligaynon="Palangga ta ka",
            english="I love you",
            pronunciation="pah-LAHNG-gah tah kah",
            context="Romantic expression"
        ),
        Phrase(
            hiligaynon="Namiss ta ka",
            english="I miss you",
            pronunciation="nah-MISS tah kah"
        )
    ]

    # ===============
    # VOCABULARY
    # ===============

    VOCABULARY = {
        "numbers": [
            VocabularyWord(word="isa", english="one", pronunciation="ee-SAH", part_of_speech="number"),
            VocabularyWord(word="duha", english="two", pronunciation="doo-HAH", part_of_speech="number"),
            VocabularyWord(word="tatlo", english="three", pronunciation="taht-LOH", part_of_speech="number"),
            VocabularyWord(word="apat", english="four", pronunciation="AH-paht", part_of_speech="number"),
            VocabularyWord(word="lima", english="five", pronunciation="lee-MAH", part_of_speech="number"),
            VocabularyWord(word="anom", english="six", pronunciation="AH-nohm", part_of_speech="number"),
            VocabularyWord(word="pito", english="seven", pronunciation="pee-TOH", part_of_speech="number"),
            VocabularyWord(word="walo", english="eight", pronunciation="wah-LOH", part_of_speech="number"),
            VocabularyWord(word="siyam", english="nine", pronunciation="see-YAHM", part_of_speech="number"),
            VocabularyWord(word="pulo", english="ten", pronunciation="poo-LOH", part_of_speech="number"),
        ],
        "pronouns": [
            VocabularyWord(word="ako", english="I/me", pronunciation="AH-koh", part_of_speech="pronoun"),
            VocabularyWord(word="ikaw/ka", english="you (singular)", pronunciation="ee-KAW/kah", part_of_speech="pronoun"),
            VocabularyWord(word="siya", english="he/she", pronunciation="see-YAH", part_of_speech="pronoun"),
            VocabularyWord(word="kita", english="we (inclusive)", pronunciation="kee-TAH", part_of_speech="pronoun"),
            VocabularyWord(word="kami", english="we (exclusive)", pronunciation="kah-MEE", part_of_speech="pronoun"),
            VocabularyWord(word="kamo", english="you (plural)", pronunciation="kah-MOH", part_of_speech="pronoun"),
            VocabularyWord(word="sila", english="they", pronunciation="see-LAH", part_of_speech="pronoun"),
        ],
        "common_words": [
            VocabularyWord(word="balay", english="house", pronunciation="bah-LIE", part_of_speech="noun"),
            VocabularyWord(word="pagkaon", english="food", pronunciation="pahg-kah-ON", part_of_speech="noun"),
            VocabularyWord(word="tubig", english="water", pronunciation="TOO-big", part_of_speech="noun"),
            VocabularyWord(word="adlaw", english="day/sun", pronunciation="AHD-law", part_of_speech="noun"),
            VocabularyWord(word="gab-i", english="night", pronunciation="gahb-EE", part_of_speech="noun"),
            VocabularyWord(word="tawo", english="person", pronunciation="TAH-woh", part_of_speech="noun"),
            VocabularyWord(word="bata", english="child", pronunciation="bah-TAH", part_of_speech="noun"),
            VocabularyWord(word="nanay", english="mother", pronunciation="NAH-nie", part_of_speech="noun"),
            VocabularyWord(word="tatay", english="father", pronunciation="TAH-tie", part_of_speech="noun"),
            VocabularyWord(word="utod", english="sibling", pronunciation="OO-tohd", part_of_speech="noun"),
        ],
        "verbs": [
            VocabularyWord(word="kaon", english="eat", pronunciation="kah-ON", part_of_speech="verb",
                          example_sentence="Magkaon na kita", example_translation="Let's eat"),
            VocabularyWord(word="inom", english="drink", pronunciation="ee-NOHM", part_of_speech="verb"),
            VocabularyWord(word="tulog", english="sleep", pronunciation="TOO-log", part_of_speech="verb"),
            VocabularyWord(word="lakat", english="walk/go", pronunciation="lah-KAHT", part_of_speech="verb"),
            VocabularyWord(word="hambal", english="speak/say", pronunciation="hahm-BAHL", part_of_speech="verb"),
            VocabularyWord(word="sulat", english="write", pronunciation="SOO-laht", part_of_speech="verb"),
            VocabularyWord(word="basa", english="read", pronunciation="bah-SAH", part_of_speech="verb"),
            VocabularyWord(word="obra", english="work", pronunciation="OHB-rah", part_of_speech="verb"),
            VocabularyWord(word="bakal", english="buy", pronunciation="bah-KAHL", part_of_speech="verb"),
            VocabularyWord(word="balik", english="return/go back", pronunciation="bah-LEEK", part_of_speech="verb"),
        ],
        "adjectives": [
            VocabularyWord(word="maayo", english="good", pronunciation="mah-AH-yoh", part_of_speech="adjective"),
            VocabularyWord(word="malain", english="bad", pronunciation="mah-lah-IN", part_of_speech="adjective"),
            VocabularyWord(word="dako", english="big", pronunciation="dah-KOH", part_of_speech="adjective"),
            VocabularyWord(word="gamay", english="small", pronunciation="gah-MIE", part_of_speech="adjective"),
            VocabularyWord(word="matahum", english="beautiful", pronunciation="mah-tah-HOOM", part_of_speech="adjective"),
            VocabularyWord(word="init", english="hot", pronunciation="ee-NIT", part_of_speech="adjective"),
            VocabularyWord(word="bugnaw", english="cold", pronunciation="boog-NAW", part_of_speech="adjective"),
            VocabularyWord(word="bag-o", english="new", pronunciation="bahg-OH", part_of_speech="adjective"),
            VocabularyWord(word="daan", english="old", pronunciation="dah-AHN", part_of_speech="adjective"),
            VocabularyWord(word="mabilis", english="fast", pronunciation="mah-BEE-lis", part_of_speech="adjective"),
        ],
        "food": [
            VocabularyWord(word="kan-on", english="rice (cooked)", pronunciation="kahn-ON", part_of_speech="noun"),
            VocabularyWord(word="isda", english="fish", pronunciation="ees-DAH", part_of_speech="noun"),
            VocabularyWord(word="karne", english="meat", pronunciation="KAHR-neh", part_of_speech="noun"),
            VocabularyWord(word="utan", english="vegetable", pronunciation="oo-TAHN", part_of_speech="noun"),
            VocabularyWord(word="prutas", english="fruit", pronunciation="PROO-tahs", part_of_speech="noun"),
            VocabularyWord(word="tinapay", english="bread", pronunciation="tee-nah-PIE", part_of_speech="noun"),
            VocabularyWord(word="kape", english="coffee", pronunciation="kah-PEH", part_of_speech="noun"),
            VocabularyWord(word="gatas", english="milk", pronunciation="gah-TAHS", part_of_speech="noun"),
        ]
    }

    # ================
    # CULTURAL NOTES
    # ================

    CULTURAL_NOTES = [
        CulturalNote(
            title="The 'Gid' Emphasis",
            content="Hiligaynon speakers frequently use 'gid' (pronounced 'jid') to add emphasis, "
                    "similar to 'very' or 'really' in English. It makes the language sound warm and sincere. "
                    "For example: 'Salamat gid' (Thank you very much), 'Maayo gid' (Very good).",
            related_phrases=["Salamat gid", "Maayo gid", "Matahum gid"]
        ),
        CulturalNote(
            title="Po and Ho - Respectful Particles",
            content="While less common than in Tagalog, Hiligaynon speakers may use 'po' or 'ho' "
                    "when speaking to elders or those in authority. However, using 'kamo' (plural you) "
                    "instead of 'ka' (singular you) is the more traditional Hiligaynon way to show respect.",
            related_phrases=["Kumusta kamo?", "Salamat po"]
        ),
        CulturalNote(
            title="Mano Po - Blessing Gesture",
            content="The 'mano' is a traditional gesture of respect where younger people take the hand "
                    "of an elder and press it to their forehead while saying 'Mano po'. This is practiced "
                    "throughout the Philippines and is very much alive in Hiligaynon culture.",
            related_phrases=["Mano po"]
        ),
        CulturalNote(
            title="Ilonggo Hospitality",
            content="Ilonggos (Hiligaynon speakers) are known for their warmth and hospitality. "
                    "The phrase 'Kaon na ta!' (Let's eat!) is constantly heard, as offering food is "
                    "a fundamental expression of welcome. It's polite to accept, even just a little.",
            related_phrases=["Kaon na ta!", "Sulod anay", "Pungko anay"]
        ),
        CulturalNote(
            title="The Sweet Language",
            content="Hiligaynon is often called the 'language of love' or the 'sweetest language' "
                    "in the Philippines due to its melodic, gentle sound. Words tend to flow smoothly, "
                    "and the intonation is less sharp than other Philippine languages.",
            related_phrases=["Palangga ta ka", "Namiss ta ka"]
        ),
        CulturalNote(
            title="Spanish Influence",
            content="Like other Philippine languages, Hiligaynon has many Spanish loanwords, "
                    "especially for numbers above ten, days of the week, and religious terms. "
                    "Days: Lunes, Martes, Miyerkules, Huwebes, Byernes, Sabado, Domingo.",
            related_phrases=["Hasta la byernes", "Buenos dias (occasionally used)"]
        ),
        CulturalNote(
            title="Dinagyang & MassKara Festivals",
            content="Iloilo's Dinagyang Festival (January) and Bacolod's MassKara Festival (October) "
                    "are major cultural celebrations in Hiligaynon-speaking regions. Learning festival "
                    "greetings and expressions can be very meaningful to locals.",
            related_phrases=["Viva Pit Senyor!", "Malipayon nga Dinagyang!"]
        ),
        CulturalNote(
            title="Indirect Communication",
            content="Like many Filipino cultures, Hiligaynon speakers often communicate indirectly "
                    "to avoid confrontation or embarrassment. 'Basi' (maybe), 'Siguro' (perhaps), and "
                    "'Ambot' (I don't know) might be used even when the speaker has a definite opinion.",
            related_phrases=["Basi", "Siguro", "Ambot lang"]
        )
    ]

    # ================
    # EXERCISES
    # ================

    EXERCISES = [
        # Greetings
        Exercise(
            exercise_type="multiple_choice",
            question="How do you say 'Good morning' in Hiligaynon?",
            options=["Maayong gab-i", "Maayong aga", "Maayong hapon", "Maayong udto"],
            correct_answer="Maayong aga",
            explanation="'Maayong aga' means 'Good morning'. 'Maayo' means good, 'aga' means morning.",
            difficulty=DifficultyLevel.BEGINNER
        ),
        Exercise(
            exercise_type="multiple_choice",
            question="What is the correct response to 'Kumusta ka?'",
            options=["Salamat", "Maayo man", "Palihog", "Paalam na"],
            correct_answer="Maayo man",
            explanation="'Maayo man' means 'I'm fine/good'. It's the standard response to 'How are you?'",
            difficulty=DifficultyLevel.BEGINNER
        ),
        Exercise(
            exercise_type="translate",
            question="Translate to Hiligaynon: 'Thank you very much'",
            correct_answer="Salamat gid",
            explanation="'Salamat' means thank you, and 'gid' adds emphasis like 'very much'.",
            difficulty=DifficultyLevel.BEGINNER
        ),
        Exercise(
            exercise_type="fill_blank",
            question="Complete: 'Ano ang _____ mo?' (What is your name?)",
            correct_answer="ngalan",
            explanation="'Ngalan' means 'name'. The full phrase is 'Ano ang ngalan mo?' (What is your name?)",
            difficulty=DifficultyLevel.BEGINNER
        ),

        # Numbers
        Exercise(
            exercise_type="multiple_choice",
            question="What is 'five' in Hiligaynon?",
            options=["tatlo", "apat", "lima", "anom"],
            correct_answer="lima",
            explanation="'Lima' means five. The numbers 1-5 are: isa, duha, tatlo, apat, lima.",
            difficulty=DifficultyLevel.BEGINNER
        ),
        Exercise(
            exercise_type="matching",
            question="Match: 'duha' means...",
            options=["one", "two", "three", "four"],
            correct_answer="two",
            explanation="'Duha' means two in Hiligaynon.",
            difficulty=DifficultyLevel.BEGINNER
        ),

        # Common Phrases
        Exercise(
            exercise_type="translate",
            question="Translate to English: 'Pila ini?'",
            correct_answer="How much is this?",
            explanation="'Pila' means 'how much/many' and 'ini' means 'this'. Essential for shopping!",
            difficulty=DifficultyLevel.BEGINNER
        ),
        Exercise(
            exercise_type="multiple_choice",
            question="How do you say 'I'm hungry' in Hiligaynon?",
            options=["Uhaw na ako", "Gutom na ako", "Kapoy na ako", "Nalipay ako"],
            correct_answer="Gutom na ako",
            explanation="'Gutom' means hungry, 'na' indicates current state, 'ako' means I/me.",
            difficulty=DifficultyLevel.ELEMENTARY
        ),
        Exercise(
            exercise_type="fill_blank",
            question="Complete: 'Kaon na _____!' (Let's eat!)",
            correct_answer="ta",
            explanation="'Ta' is an inclusive 'we' marker. 'Kaon na ta!' is an invitation to eat together.",
            difficulty=DifficultyLevel.ELEMENTARY
        ),

        # Cultural
        Exercise(
            exercise_type="multiple_choice",
            question="What does adding 'gid' to a phrase do?",
            options=["Makes it a question", "Adds emphasis (like 'very')", "Makes it negative", "Makes it past tense"],
            correct_answer="Adds emphasis (like 'very')",
            explanation="'Gid' adds emphasis in Hiligaynon. 'Salamat gid' = Thank you very much.",
            difficulty=DifficultyLevel.BEGINNER
        ),
        Exercise(
            exercise_type="multiple_choice",
            question="Which is the polite/formal 'you' in Hiligaynon?",
            options=["ka", "ako", "kamo", "siya"],
            correct_answer="kamo",
            explanation="'Kamo' is the plural/formal 'you', showing respect. 'Ka' is informal singular.",
            difficulty=DifficultyLevel.ELEMENTARY
        ),

        # Intermediate
        Exercise(
            exercise_type="translate",
            question="Translate to Hiligaynon: 'Where are you from?'",
            correct_answer="Taga-diin ka?",
            explanation="'Taga-' is a prefix meaning 'from', 'diin' means 'where', 'ka' means 'you'.",
            difficulty=DifficultyLevel.INTERMEDIATE
        ),
        Exercise(
            exercise_type="fill_blank",
            question="'_____ ta ka' means 'I love you'",
            correct_answer="Palangga",
            explanation="'Palangga' means love/beloved. 'Palangga ta ka' is 'I love you' in Hiligaynon.",
            difficulty=DifficultyLevel.INTERMEDIATE
        ),
        Exercise(
            exercise_type="speaking",
            question="Practice saying: 'Maayong aga! Kumusta ka?'",
            correct_answer="mah-AH-yong AH-gah! koo-MOOS-tah kah?",
            explanation="This means 'Good morning! How are you?' Remember to stress the capitalized syllables.",
            difficulty=DifficultyLevel.BEGINNER
        )
    ]

    # ================
    # LESSON STRUCTURE
    # ================

    LESSONS = {
        "lesson_1": {
            "title": "Greetings & Introductions",
            "description": "Learn to greet people and introduce yourself in Hiligaynon",
            "objectives": [
                "Say good morning, afternoon, and evening",
                "Ask and answer 'How are you?'",
                "Introduce yourself",
                "Say thank you and goodbye"
            ],
            "vocabulary": ["Maayong aga", "Kumusta ka?", "Maayo man", "Salamat", "Paalam na"],
            "cultural_note": "The 'Gid' Emphasis",
            "exercises": [0, 1, 2]  # indices into EXERCISES list
        },
        "lesson_2": {
            "title": "Numbers & Counting",
            "description": "Learn to count from 1-10 in Hiligaynon",
            "objectives": [
                "Count from one to ten",
                "Ask 'How much?'",
                "Understand basic number usage"
            ],
            "vocabulary": ["isa", "duha", "tatlo", "apat", "lima", "anom", "pito", "walo", "siyam", "pulo"],
            "cultural_note": "Spanish Influence",
            "exercises": [4, 5, 6]
        },
        "lesson_3": {
            "title": "Daily Essentials",
            "description": "Essential phrases for everyday situations",
            "objectives": [
                "Express basic needs (hungry, thirsty, tired)",
                "Ask simple questions",
                "Navigate basic social situations"
            ],
            "vocabulary": ["Gutom na ako", "Uhaw na ako", "Kapoy na ako", "Diin ang...?", "Pila ini?"],
            "cultural_note": "Ilonggo Hospitality",
            "exercises": [7, 8]
        },
        "lesson_4": {
            "title": "Polite Expressions",
            "description": "Learn respectful and polite expressions",
            "objectives": [
                "Use formal vs. informal 'you'",
                "Make polite requests",
                "Show respect to elders"
            ],
            "vocabulary": ["ka vs. kamo", "Palihog", "Pwede bala...?", "Pasensya na"],
            "cultural_note": "Po and Ho - Respectful Particles",
            "exercises": [9, 10]
        }
    }

    def __init__(self):
        """Initialize the Hiligaynon module"""
        pass

    def get_greeting(self, time_of_day: str = "morning") -> Phrase:
        """Get appropriate greeting for time of day"""
        greetings_map = {
            "morning": "Maayong aga",
            "noon": "Maayong udto",
            "afternoon": "Maayong hapon",
            "evening": "Maayong gab-i",
            "night": "Maayong gab-i"
        }
        target = greetings_map.get(time_of_day, "Maayong aga")
        for g in self.GREETINGS:
            if g.hiligaynon == target:
                return g
        return self.GREETINGS[0]

    def get_phrases_by_category(self, category: str = "greetings") -> List[Phrase]:
        """Get phrases by category"""
        if category == "greetings":
            return self.GREETINGS
        elif category == "common":
            return self.COMMON_PHRASES
        else:
            return self.GREETINGS + self.COMMON_PHRASES

    def get_vocabulary(self, category: str = None) -> Dict[str, List[VocabularyWord]]:
        """Get vocabulary, optionally filtered by category"""
        if category and category in self.VOCABULARY:
            return {category: self.VOCABULARY[category]}
        return self.VOCABULARY

    def get_cultural_notes(self) -> List[CulturalNote]:
        """Get all cultural notes"""
        return self.CULTURAL_NOTES

    def get_exercises(self, difficulty: DifficultyLevel = None) -> List[Exercise]:
        """Get exercises, optionally filtered by difficulty"""
        if difficulty:
            return [e for e in self.EXERCISES if e.difficulty == difficulty]
        return self.EXERCISES

    def get_pronunciation_guide(self) -> Dict[str, Any]:
        """Get the full pronunciation guide"""
        return self.PRONUNCIATION_GUIDE

    def get_lesson(self, lesson_id: str) -> Dict[str, Any]:
        """Get a specific lesson"""
        return self.LESSONS.get(lesson_id, self.LESSONS["lesson_1"])

    def search_phrase(self, query: str) -> List[Phrase]:
        """Search for phrases containing the query"""
        query_lower = query.lower()
        results = []
        for phrase in self.GREETINGS + self.COMMON_PHRASES:
            if (query_lower in phrase.hiligaynon.lower() or
                query_lower in phrase.english.lower()):
                results.append(phrase)
        return results

    def get_random_exercise(self, difficulty: DifficultyLevel = DifficultyLevel.BEGINNER) -> Exercise:
        """Get a random exercise at the specified difficulty"""
        import random
        exercises = self.get_exercises(difficulty)
        return random.choice(exercises) if exercises else self.EXERCISES[0]

    def format_phrase_for_display(self, phrase: Phrase) -> str:
        """Format a phrase for display to the user"""
        result = f"**{phrase.hiligaynon}**\n"
        result += f"*{phrase.pronunciation}*\n"
        result += f"English: {phrase.english}\n"
        if phrase.literal:
            result += f"Literal: {phrase.literal}\n"
        if phrase.context:
            result += f"Context: {phrase.context}"
        return result


def get_hiligaynon_module() -> HiligaynonModule:
    """Get the Hiligaynon module instance"""
    return HiligaynonModule()
