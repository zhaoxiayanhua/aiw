import { ResumeData } from '@/app/[locale]/(default)/resume-generator/components/ResumeContext';

function normalizeRelevantCoursework(value: string): string {
  if (!value || value.trim().length === 0) {
    return '';
  }

  const normalized = value
    .replace(/^relevant\s+coursework\s*:?\s*/i, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[;\uFF1B]/g, '\n');

  const courseNames = normalized
    .split(/\n+/)
    .flatMap((line) => line.split(','))
    .map((part) => part.replace(/^[-\u2022\u25CF\s]+/, '').trim())
    .map((part) => part.split(/\s(?:-|\u2013|\u2014)\s|:\s*/)[0]?.trim() ?? '')
    .map((part) => part.replace(/[.\u3002;\uFF1B]+$/, '').trim())
    .filter(Boolean)
    .filter((part) => !/^(and|or|with|including|covered|focus|focused|such as)\b/i.test(part));

  return Array.from(new Set(courseNames)).join(', ');
}

function safeText(value: unknown): string {
  if (value == null) return '';
  const normalized = String(value).trim();
  return normalized === 'undefined' || normalized === 'null' ? '' : normalized;
}

function joinParts(parts: unknown[], separator: string): string {
  return parts
    .map((part) => safeText(part))
    .filter(Boolean)
    .join(separator);
}

function buildLocation(...parts: unknown[]): string {
  return joinParts(parts, ', ');
}

function buildDateRange(start: unknown, end: unknown): string {
  return joinParts(
    [formatDateToMMYYYY(safeText(start)), formatDateToMMYYYY(safeText(end))],
    ' - '
  );
}

// Helper function to format date to MM/YYYY format
function formatDateToMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  
  // Handle "Present" or "鐜板湪" case
  if (dateStr.toLowerCase() === 'present' || dateStr === '鐜板湪' || dateStr.toLowerCase() === 'current') {
    return 'Present';
  }
  
  // Try to parse the date string
  const date = new Date(dateStr);
  
  // Check if the date is valid
  if (!isNaN(date.getTime())) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
  
  // Handle formats like "September 2023"
  const monthNameMatch = dateStr.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
  if (monthNameMatch) {
    const monthName = monthNameMatch[1].toLowerCase();
    const monthIndex = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ].indexOf(monthName);
    const year = monthNameMatch[2];
    if (monthIndex >= 0) {
      const month = (monthIndex + 1).toString().padStart(2, '0');
      return `${month}/${year}`;
    }
  }
  
  // If parsing fails, try to extract month and year from the string
  // Handle formats like "2023-07", "07/2023", "July 2023", etc.
  const monthYearMatch = dateStr.match(/(\d{1,2})[-/](\d{4})|(\d{4})[-/](\d{1,2})/);
  if (monthYearMatch) {
    const month = monthYearMatch[1] || monthYearMatch[4];
    const year = monthYearMatch[2] || monthYearMatch[3];
    return `${month.padStart(2, '0')}/${year}`;
  }
  
  // Return original string if unable to parse
  return dateStr;
}

// Define the standardized resume structure for templates
export interface StandardResumeData {
  basics: {
    name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    url: { href: string; label: string };
    customFields: Array<{
      id: string;
      name: string;
      value: string;
      icon: string;
    }>;
    picture: {
      url: string;
      size: number;
      aspectRatio: number;
      borderRadius: number;
      effects: {
        hidden: boolean;
        border: boolean;
        grayscale: boolean;
      };
    };
  };
  sections: {
    summary: {
      id: string;
      name: string;
      content: string;
      visible: boolean;
      columns: number;
    };
    experience: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        company: string;
        position: string;
        location: string;
        date: string;
        summary: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    education: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        institution: string;
        area: string;
        studyType: string;
        score: string;
        date: string;
        summary: string;
        location: string;
        courses: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    skills: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        description: string;
        level: number;
        keywords: string[];
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
    };
    projects: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        description: string;
        location: string;
        date: string;
        summary: string;
        keywords: string[];
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    awards: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        title: string;
        awarder: string;
        date: string;
        summary: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    activities: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        role: string;
        location: string;
        date: string;
        summary: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    languages: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        description: string;
        level: number;
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
    };
    certifications: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        issuer: string;
        date: string;
        summary: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
    references: {
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        description: string;
        url: { href: string; label: string };
        visible: boolean;
      }>;
      visible: boolean;
      columns: number;
      separateLinks: boolean;
    };
  };
  metadata: {
    template: string;
    layout: string[][][];
    theme: {
      background: string;
      text: string;
      primary: string;
    };
    typography: {
      font: {
        family: string;
        size: number;
      };
      lineHeight: number;
      hideIcons: boolean;
      underlineLinks: boolean;
    };
  };
}

// Field mapping function - converts your data to standardized format
export function mapToStandardFormat(data: ResumeData, selectedTemplate: string = 'kakuna'): StandardResumeData {
  const parseLanguageEntry = (entry: string) => {
    if (!entry) return null;
    const trimmed = entry.trim();
    if (!trimmed) return null;

    const dashParts = trimmed.split(/\s(?:-|\u2013|\u2014)\s/);
    if (dashParts.length > 1) {
      return {
        name: dashParts[0].trim(),
        level: dashParts.slice(1).join(' - ').trim(),
      };
    }

    const parenMatch = trimmed.match(/^(.+?)\s*\((.+)\)$/);
    if (parenMatch) {
      return {
        name: parenMatch[1].trim(),
        level: parenMatch[2].trim(),
      };
    }

    return {
      name: trimmed,
      level: '',
    };
  };

  const buildLanguageItems = () => {
    type AggregatedLanguage = {
      name: string;
      descriptions: string[];
      level: number;
      order: number;
    };

    const aggregated = new Map<string, AggregatedLanguage>();
    let orderCounter = 0;

    const addLanguage = (name: string, description: string, level: number) => {
      if (!name) return;
      const key = name.toLowerCase();
      if (!aggregated.has(key)) {
        aggregated.set(key, {
          name,
          descriptions: [],
          level,
          order: orderCounter++,
        });
      }
      const entry = aggregated.get(key)!;
      if (description) {
        if (!entry.descriptions.includes(description)) {
          entry.descriptions.push(description);
        }
      }
      entry.level = Math.max(entry.level, level);
    };

    if (data.skillsLanguage.english_level) {
      addLanguage('English', data.skillsLanguage.english_level.trim(), 0);
    }

    if (data.skillsLanguage.native_language) {
      data.skillsLanguage.native_language
        .split(/[,;\n]+/)
        .map(parseLanguageEntry)
        .filter((entry): entry is { name: string; level: string } => !!entry)
        .forEach((entry) => {
          addLanguage(entry.name, entry.level || 'Native Speaker', 5);
        });
    }

    if (data.skillsLanguage.other_languages) {
      data.skillsLanguage.other_languages
        .split(/[,;\n]+/)
        .map(parseLanguageEntry)
        .filter((entry): entry is { name: string; level: string } => !!entry)
        .forEach((entry) => {
          addLanguage(entry.name, entry.level, 0);
        });
    }

    return Array.from(aggregated.values())
      .sort((a, b) => a.order - b.order)
      .map((entry, index) => ({
        id: `lang-${index}`,
        name: entry.name,
        description: entry.descriptions.join(', '),
        level: entry.level,
        visible: true,
      }));
  };

  const languageItems = buildLanguageItems();

  return {
    basics: {
      name: data.header.full_name || '',
      headline: '', // You don't have this field, so empty
      email: data.header.email || '',
      phone: data.header.phone || '',
      location: buildLocation(data.header.city, data.header.country),
      url: { href: '', label: '' }, // No website field in your form
      customFields: [
        ...(data.header.linkedin ? [{
          id: 'linkedin',
          name: 'LinkedIn',
          value: data.header.linkedin,
          icon: 'linkedin-logo'
        }] : []),
        ...(data.header.github ? [{
          id: 'github',
          name: 'GitHub',
          value: data.header.github,
          icon: 'github-logo'
        }] : [])
      ],
      picture: {
        url: data.header.profilePicture?.url || '',
        size: 64,
        aspectRatio: 1,
        borderRadius: 0,
        effects: { hidden: !data.header.profilePicture, border: false, grayscale: false }
      }
    },
    sections: {
      summary: {
        id: 'summary',
        name: 'Summary',
        content: '', // You don't have a summary section
        visible: false,
        columns: 1
      },
      experience: {
        id: 'experience',
        name: 'Work Experience',
        items: data.workExperience.map((exp, index) => ({
          id: `exp-${index}`,
          company: safeText(exp.company),
          position: safeText(exp.job_title),
          location: buildLocation(exp.work_city, exp.work_country),
          date: buildDateRange(exp.work_start_date, exp.work_end_date),
          summary: safeText(exp.responsibilities),
          url: { href: '', label: '' },
          visible: true
        })),
        visible: data.moduleSelection.workExperience && data.workExperience.length > 0,
        columns: 1,
        separateLinks: true
      },
      education: {
        id: 'education',
        name: 'Education',
        items: data.education.map((edu, index) => ({
          id: `edu-${index}`,
          institution: safeText(edu.school_name),
          area: safeText(edu.degree),
          studyType: '', // You don't distinguish study type
          score: safeText(edu.gpa_or_rank),
          date: buildDateRange(edu.edu_start_date, edu.edu_end_date),
          summary: safeText(((edu as unknown) as Record<string, unknown>).awards_or_honors),
          location: buildLocation(edu.edu_city, edu.edu_country),
          courses: normalizeRelevantCoursework(safeText(edu.relevant_courses)),
          url: { href: '', label: '' },
          visible: true
        })),
        visible: data.moduleSelection.education && data.education.length > 0,
        columns: 1,
        separateLinks: true
      },
      skills: {
        id: 'skills',
        name: 'Skills',
        items: data.moduleSelection.skillsLanguage && data.skillsLanguage.skills ? [{
          id: 'skills-0',
          name: 'Professional',
          description: safeText(data.skillsLanguage.skills),
          level: 0,
          keywords: safeText(data.skillsLanguage.skills)
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
          visible: true
        }] : [],
        visible: data.moduleSelection.skillsLanguage,
        columns: 1
      },
      projects: {
        id: 'projects',
        name: 'Research Projects',
        items: data.research.map((proj, index) => ({
          id: `proj-${index}`,
          name: safeText(proj.project_title),
          description: safeText(proj.lab_or_unit),
          location: buildLocation(
            ((proj as unknown) as Record<string, unknown>).res_city,
            ((proj as unknown) as Record<string, unknown>).res_country
          ),
          date: buildDateRange(proj.res_start_date, proj.res_end_date),
          summary: safeText(proj.your_contributions),
          keywords: safeText(proj.tools_used)
            ? safeText(proj.tools_used).split(',').map(t => t.trim()).filter(t => t.length > 0)
            : [],
          url: { href: '', label: '' },
          visible: true
        })),
        visible: data.moduleSelection.research && data.research.length > 0,
        columns: 1,
        separateLinks: true
      },
      activities: {
        id: 'activities',
        name: 'Activities',
        items: data.activities.map((activity, index) => ({
          id: `activity-${index}`,
          name: safeText(activity.activity_name),
          role: safeText(activity.role),
          location: buildLocation(activity.act_city, activity.act_country),
          date: buildDateRange(activity.act_start_date, activity.act_end_date),
          summary: safeText(activity.description),
          url: { href: '', label: '' },
          visible: true
        })),
        visible: data.moduleSelection.activities && data.activities.length > 0,
        columns: 1,
        separateLinks: true
      },
      awards: {
        id: 'awards',
        name: 'Awards',
        items: data.awards.flatMap((award, index) => {
          const items = [];

          if (award.award_name) {
            items.push({
              id: `award-${index}-a`,
              title: award.award_name,
              awarder: award.award_issuer || '',
              date: formatDateToMMYYYY(award.award_year) || '',
              summary: award.award_rank || '',
              url: { href: '', label: '' },
              visible: true
            });
          }

          if (award.certificate_name) {
            items.push({
              id: `award-${index}-c`,
              title: award.certificate_name,
              awarder: award.certificate_issuer || '',
              date: formatDateToMMYYYY(award.award_year) || '',
              summary: '',
              url: { href: '', label: '' },
              visible: true
            });
          }

          if (items.length === 0 && (award.award_year || award.award_rank)) {
            items.push({
              id: `award-${index}`,
              title: '',
              awarder: '',
              date: formatDateToMMYYYY(award.award_year) || '',
              summary: award.award_rank || '',
              url: { href: '', label: '' },
              visible: true
            });
          }

          return items;
        }),
        visible: data.moduleSelection.awards && data.awards.length > 0,
        columns: 1,
        separateLinks: true
      },
      languages: {
        id: 'languages',
        name: 'Languages',
        items: languageItems,
        visible: data.moduleSelection.skillsLanguage && languageItems.length > 0,
        columns: 1
      },
      certifications: {
        id: 'certifications',
        name: 'Certifications',
        items: [], // No certifications data in current form
        visible: false,
        columns: 1,
        separateLinks: true
      },
      references: {
        id: 'references',
        name: 'References',
        items: [], // No references data in current form
        visible: false,
        columns: 1,
        separateLinks: true
      }
    },
    metadata: {
      template: selectedTemplate,
      layout: [
        [
          ['experience', 'education', 'projects', 'awards'],
          ['skills']
        ]
      ],
      theme: {
        background: '#ffffff',
        text: '#000000',
        primary: '#2563eb'
      },
      typography: {
        font: {
          family: 'Inter',
          size: 14
        },
        lineHeight: 1.5,
        hideIcons: false,
        underlineLinks: true
      }
    }
  };
}

