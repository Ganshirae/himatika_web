export type AppRole = "admin" | "bendahara" | "medkraf";

export type ProkerStatus = "upcoming" | "ongoing" | "completed";
export type FinanceType = "income" | "expense";

export interface UserProfile {
  id: string;
  full_name: string;
  role: AppRole;
  division_code: string | null;
  is_active: boolean;
  created_at: string;
}

export interface FinanceCategoryRow {
  id: string;
  name: string;
  type: FinanceType;
}

export interface FinanceRecordRow {
  id: string;
  title: string;
  amount: number;
  type: FinanceType;
  category_id: string | null;
  transaction_date: string;
  recorded_by: string | null;
  receipt_url: string | null;
  notes: string | null;
  created_at: string;
  finance_categories?: { name: string } | null;
}

export interface PublicFinanceRecordRow {
  id: string;
  title: string;
  amount: number;
  type: FinanceType;
  category_id: string | null;
  category_name: string | null;
  transaction_date: string;
  created_at: string;
}

export interface FinancialSummary {
  total_income: number;
  total_expense: number;
  current_balance: number;
}

export interface DivisionLeaderJson {
  name: string;
  role: string;
  image: string;
}

export interface DivisionMemberGroupJson {
  role: string;
  count: number;
}

export interface DivisionProkerRefJson {
  title: string;
  slug: string;
  status: ProkerStatus;
}

export interface DivisionRow {
  id: string;
  code: string;
  name: string;
  short_title: string | null;
  level: number;
  level_name: string;
  short_desc: string | null;
  leader_title: string | null;
  leader_name: string;
  leader_image: string | null;
  leaders: DivisionLeaderJson[];
  tupoksi: string[];
  member_groups: DivisionMemberGroupJson[];
  active_prokers: DivisionProkerRefJson[];
  focus_areas: string[];
  members: string[] | null;
  order_index: number;
}

export interface ProkerRundownJson {
  time: string;
  activity: string;
}

export interface ProkerContactJson {
  name: string;
  role: string;
  contact: string;
}

export interface WorkProgramRow {
  id: string;
  title: string;
  slug: string;
  division_id: string | null;
  division_code: string | null;
  division_name: string | null;
  status: ProkerStatus;
  highlight_number: string | null;
  short_desc: string;
  full_content: string | null;
  execution_date: string | null;
  execution_label: string | null;
  location: string | null;
  target_audience: string | null;
  objectives: string[];
  rundown: ProkerRundownJson[];
  cover_video_url: string | null;
  cover_image_url: string | null;
  gallery_images: string[];
  registration_link: string | null;
  contact_person: ProkerContactJson | null;
  is_white_background: boolean;
  is_featured: boolean;
  created_at: string;
}

export type ContactMessageStatus = "unread" | "read" | "archived";

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  created_at: string;
}

export interface AboutMissionJson {
  num: string;
  tag: string;
  title: string;
  desc: string;
}

export interface SiteAboutRow {
  id: string;
  intro_primary: string;
  intro_secondary: string;
  vision_text: string;
  period_label: string;
  logo_image_url: string;
  missions: AboutMissionJson[];
  updated_at: string;
}
