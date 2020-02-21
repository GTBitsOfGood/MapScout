// TODO: Move options outside of codebase
const options = {
  serviceType: [
    { label: 'Outpatient Services', value: 'Outpatient Services' },
    { label: 'Residential Programs', value: 'Residential Programs' },
    { label: 'Parent/Caregiver Services', value: 'Parent/Caregiver Services' },
    { label: 'School-Based Services', value: 'School-Based Services' },
    { label: 'Foster & Kinship Care', value: 'Foster & Kinship Care' },
    { label: 'In-Home Services', value: 'In-Home Services' },
  ],
  specializations: [
    { label: 'Autism Spectrum Disorder', value: 'Autism Spectrum Disorder' },
    // {label: 'Medication Assisted Treatment Substance Use Disorders', value: 'Medication Assisted Treatment Substance Use Disorders'},
    { label: 'Anxiety Disorders', value: 'Anxiety Disorders' },
    // {label: 'Tamaa Program', value: 'Tamaa Program'},
    { label: 'Sexual Trauma Treatment', value: 'Sexual Trauma Treatment' },
    { label: 'ADHD', value: 'ADHD' }, // New filter
    { label: 'Drugs and Alcohol', value: 'Drugs and Alocohol' }, // New filter
    // {label: 'Domestic Violence Therapy', value: 'Domestic Violence Therapy'},
    // {label: 'Intentional Injuries', value: 'Intentional Injuries'},
    { label: 'Depressive Disorders', value: 'Depressive Disorders' },
    // {label: 'Family Therapy', value: 'Family Therapy'},
    // {label: 'Young Children', value: 'Young Children'},
    // {label: 'LGBTQ+ Competent', value: 'LGBTQ+ Competent'},
    // {label: 'Experience working with immigrant and refugees', value: 'Experience working with immigrant and refugees'},
  ],
  ages: [
    { label: 'Toddler/preschoolers (0-6)', value: 'Toddler' },
    { label: 'Children (6-10)', value: 'Children' },
    { label: 'Preteens (11-13)', value: 'Preteens' },
    { label: 'Adolescents (14-21)', value: 'Adolescents' },
    { label: 'Adults (21-65)', value: 'Adults' },
    { label: 'Seniors (65+)', value: 'Seniors' },
  ],
  insurance: [
    { label: 'Medicaid', value: 'Medicaid' },
    { label: 'Private', value: 'Private' },
    { label: 'Uninsured/Underinsured', value: 'Uninsured/Underinsured' },
    { label: 'Sliding Scale', value: 'Sliding Scale' },
  ],
  languages: [
    { label: 'English', value: 'English' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'Portuguese', value: 'Portuguese' },
    // {label: 'Kurdish', value: 'Kurdish'},
    { label: 'Mandarin', value: 'Mandarin' },
    { label: 'Russian', value: 'Russian' },
    // {label: 'ASL', value: 'ASL'},
    { label: 'Creole', value: 'Creole' },
    { label: 'Others', value: 'Others' },
  ],
  therapyTypes: [
    { label: 'TF-CBT (Trauma-Focused Cognitive Behavioral Therapy)', value: 'TF-CBT' },
    { label: 'Pri-CARE (Child Adult Relationship Enhancement)', value: 'Pri-CARE' },
    { label: 'CFTSI (Child Family Traumatic Stress Intervention)', value: 'CFTSI' },
    { label: 'Adolescent Dialectical Behavioral Therapy (DBT)', value: 'DBT' },
    { label: 'Family Therapy', value: 'Family Therapy' },
    { label: 'EMDR', value: 'EMDR' },
    { label: 'Other Evidence-Based Practices (EBPs)', value: 'EBPs' },
    { label: 'Support Groups', value: 'Support Groups' },
  ],
};

export default options;
