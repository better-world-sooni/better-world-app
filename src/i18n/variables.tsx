import {s_common} from './text/s_common';
import {s_tutors} from './web/portal/s_tutors';
import {s_lesson_style} from './web/portal/s_lesson_style';
import {s_upcoming_lessons} from './web/portal/s_upcoming_lessons';
import {s_stats} from './text/s_stats';
import {s_edit_profile} from './web/mypage/s_edit_profile';

export const getVars = t => {
  return {
    matchingOptions: [
      {
        type: 1,
        title: t(s_upcoming_lessons.after_tutor_cancel.automatic_match_me),
      },
      {
        type: 2,
        title: t(
          s_upcoming_lessons.after_tutor_cancel.plz_let_me_know_available_times,
        ),
      },
      {
        type: 3,
        title: t(
          s_upcoming_lessons.after_tutor_cancel.cancel_and_restore_credit,
        ),
      },
    ],
    mp3Options: [
      {label: t(s_lesson_style.record.yes)},
      {label: t(s_lesson_style.record.no)},
    ],
    introOptions: [
      {label: t(s_lesson_style.intro.skip)},
      {label: t(s_lesson_style.intro.do)},
    ],
    lessonModeArr: [
      {label: t(s_lesson_style.lesson_mode.correction)},
      {label: t(s_lesson_style.lesson_mode.discussion)},
    ],
    correctionMode: [
      {
        label: t(s_lesson_style.mode_detail.correction.instant_short),
        sublabel: t(s_lesson_style.mode_detail.correction.instant_desc),
      },
      {
        label: t(s_lesson_style.mode_detail.correction.intermittent_short),
        sublabel: t(s_lesson_style.mode_detail.correction.intermittent_desc),
      },
    ],
    discussionMode: [
      {
        label: t(s_lesson_style.mode_detail.discussion.mode55_short),
        sublabel: t(s_lesson_style.mode_detail.discussion.mode55_desc),
      },
      {
        label: t(s_lesson_style.mode_detail.discussion.mode82_short),
        sublabel: t(s_lesson_style.mode_detail.discussion.mode82_desc),
      },
    ],
    feedbackDescriptions: [
      [
        {
          score: 10,
          desc: 'Answers are well paced, coherent and well developed, using a range of structural tools and connectives. Only minor and infrequent repetitions and self-corrections, typical of a native speaker.',
        },
        {
          score: 8,
          desc: 'Answers are mostly coherent, with some lack of development. A limited set of complex structural tools are used, but perhaps overused. Some noticeable repetition, hesitation and self-correction, which may  impact flow and require listener effort but don’t impact overall clarity. ',
        },
        {
          score: 6,
          desc: 'Answers are usually fluid, however this may be achieved through frequent repetition, slow speech, reliance on basic structures or the repetition of basic connectives. More complex structures frequently cause fluency problems and can impede clarity.',
        },
        {
          score: 4,
          desc: 'Fluency is frequently interrupted by long pauses and very frequent repetition and self-correction. Sentence structures are rarely connected or developed. Content is often irrelevant or lacking substance. The listener may need to provide repeated prompts for further information.',
        },
        {
          score: 2,
          desc: 'English is unintelligible or entirely irrelevant outside of pre-prepared content.',
        },
        {
          score: 0,
          desc: 'No communication achieved.',
        },
      ],
      [
        {
          score: 10,
          desc: 'A full range of both simple and complex grammatical structures are adopted naturally and appropriately. Only minor and infrequent grammatical errors, typical of a native speaker.',
        },
        {
          score: 8,
          desc: 'A moderate range of grammatical structures are used, with some flexibility. Some errors are observed, especially within complex grammatical structures, which may impact flow and require listener effort but don’t impact overall clarity.',
        },
        {
          score: 6,
          desc: 'Basic grammatical structures are more predominant, and used with reasonable accuracy. More complex grammatical structures may be attempted, but with mixed success. Grammatical mistakes may require listener clarification or interpretation.',
        },
        {
          score: 4,
          desc: 'Basic grammatical structures are employed with limited success. More complex structures are not attempted or unintelligible. Errors are numerous outside of memorised or pre-prepared phrases. ',
        },
        {
          score: 2,
          desc: 'English is unintelligible or entirely irrelevant outside of pre-prepared content. ',
        },
        {
          score: 0,
          desc: 'No communication achieved.',
        },
      ],
      [
        {
          score: 10,
          desc: 'Pronunciation, intonation and stress is effortless, sustained, precise and subtle. An international (or L1) accent may be present but does not impede clarity or accuracy.',
        },
        {
          score: 8,
          desc: 'Pronunciation, intonation and stress is sustained. Some elements of mis-pronunciation are observed, including occasional lapses in intonation and stress and errors resulting from a strong L1 accent, but these do not impact overall clarity.',
        },
        {
          score: 6,
          desc: 'The clarity of pronunciation, intonation and stress frequently suffers due to lapses in control. English may sound awkward and choppy, due to rhythms being interrupted by a strong L1 accent. Moderate listener effort is required, but comprehension is largely achieved.',
        },
        {
          score: 4,
          desc: 'Pronunciation is sometimes unintelligible due to consistent difficulties with intonation, stress, pronunciation and rhythm. Extreme listener effort is required to interpret pronunciation or prompt clarification.',
        },
        {
          score: 2,
          desc: 'English is unintelligible or entirely irrelevant outside of pre-prepared content.',
        },
        {
          score: 0,
          desc: 'No communication achieved.',
        },
      ],
      [
        {
          score: 10,
          desc: 'Vocabulary is fully flexible, precise and complex. Appropriate Idiomatic language is adopted accurately and naturally. Very occasional minor errors don’t obscure meaning.',
        },
        {
          score: 8,
          desc: 'Vocabulary is moderately flexible, although occasionally lacks precision or variety. Idioms are used largely well but occasionally tonally or contextually inappropriate. Mistakes observed impact flow and require listener effort but don’t impact overall clarity. ',
        },
        {
          score: 6,
          desc: 'Vocabulary is adequate to achieve the core purpose of communication, however more complex ideas might be unclear. Flexibility is limited; idioms are largely absent. Paraphrasing is attempted with mixed success. Moderate listener effort is often required.',
        },
        {
          score: 4,
          desc: 'Simple topics are articulated with moderate clarity through simple vocabulary. Discussions on more unfamiliar topics are often unintelligible due to a lack of vocabulary. Extreme listener effort is required to interpret content. ',
        },
        {
          score: 2,
          desc: 'English is unintelligible or entirely irrelevant outside of pre-prepared content.',
        },
        {
          score: 0,
          desc: 'No communication achieved.',
        },
      ],
    ],
    days: [
      t(s_common.sun),
      t(s_common.mon),
      t(s_common.tue),
      t(s_common.wed),
      t(s_common.thu),
      t(s_common.fri),
      t(s_common.sat),
    ],
    genderArr: [
      {
        label: t(s_tutors.any),
        value: 2,
        id: 0,
        type_id: 0,
      },
      {
        label: t(s_tutors.gender.female),
        value: 0,
        id: 1,
        type_id: 0,
      },
      {
        label: t(s_tutors.gender.male),
        value: 1,
        id: 2,
        type_id: 0,
      },
    ],
    accentArr: [
      {
        label: t(s_tutors.any),
        value: 5,
        id: 3,
        type_id: 1,
      },
      {
        label: t(s_tutors.accent.accent_american),
        value: 0,
        id: 4,
        type_id: 1,
      },
      {
        label: t(s_tutors.accent.accent_british),
        value: 2,
        id: 5,
        type_id: 1,
      },
    ],
    majorArr: [
      {
        label: t(s_tutors.any),
        value: 5,
        id: 6,
        type_id: 2,
      },
      {
        label: t(s_tutors.major.social_sciences),
        value: 0,
        id: 7,
        type_id: 2,
      },
      {
        label: t(s_tutors.major.liberal_arts),
        value: 1,
        id: 8,
        type_id: 2,
      },
      {
        label: t(s_tutors.major.engineering),
        value: 2,
        id: 9,
        type_id: 2,
      },
      {
        label: t(s_tutors.major.natural_science),
        value: 3,
        id: 10,
        type_id: 2,
      },
      {
        label: t(s_tutors.major.fine_arts_and_athletics),
        value: 4,
        id: 11,
        type_id: 2,
      },
    ],
    webinarCategories: [
      {id: 1, title: 'Grammar in Use'},
      {id: 2, title: 'Ringle Class'},
      {id: 3, title: 'Trend/Life/Culture'},
      {id: 4, title: 'Ringle Radio'},
      {id: 5, title: 'Business/Career'},
    ],
    jobOption: [
      {value: 1, title: t(s_edit_profile.job1)},
      {value: 2, title: t(s_edit_profile.job2)},
      {value: 3, title: t(s_edit_profile.job3)},
      {value: 4, title: t(s_edit_profile.job4)},
      {value: 5, title: t(s_edit_profile.student1)},
      {value: 6, title: t(s_edit_profile.student2)},
      {value: 7, title: t(s_edit_profile.student3)},
      {value: 8, title: t(s_edit_profile.etc)},
    ],
    purposeOption: [
      {value: 1, label: t(s_edit_profile.purpose_1), checked: false},
      {value: 2, label: t(s_edit_profile.purpose_2), checked: false},
      {value: 3, label: t(s_edit_profile.purpose_5), checked: false},
      {value: 4, label: t(s_edit_profile.purpose_6), checked: false},
      {value: 5, label: t(s_edit_profile.purpose_7), checked: false},
      {value: 6, label: t(s_edit_profile.purpose_8), checked: false},
      {value: 7, label: t(s_edit_profile.etc), checked: false},
    ],
    introduceOption: [
      {id: 9, title: t(s_edit_profile.intro_1), required: true, content: ''},
      {id: 10, title: t(s_edit_profile.intro_2), required: false, content: ''},
      {id: 11, title: t(s_edit_profile.intro_3), required: false, content: ''},
    ],
    statsFilterPeriod: [
      {title: t(s_stats.filter_3mn), value: 3},
      {title: t(s_stats.filter_6mn), value: 6},
      {title: t(s_stats.filter_year), value: 12},
    ],
    statsFilterCn: [
      {title: t(s_stats.filter_10), value: 10},
      {title: t(s_stats.filter_30), value: 30},
      {title: t(s_stats.filter_50), value: 50},
      {title: t(s_stats.filter_100), value: 100},
    ],
    statsFilterScore: [
      {title: t(s_stats.feedback_average), value: t(s_stats.feedback_average)},
      {title: 'Fluency', value: 'Fluency'},
      {title: 'Vocabulary', value: 'Vocabulary'},
      {title: 'Accuracy', value: 'Accuracy'},
      {title: 'Pronunciation', value: 'Pronunciation'},
    ],
  };
};
