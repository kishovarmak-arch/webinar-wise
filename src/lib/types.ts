export type UserRole = 'admin' | 'hod' | 'student';

export interface UserAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  department?: string;
}

export interface Webinar {
  id: string;
  title: string;
  topic: string;
  description: string;
  mentorName: string;
  mentorPhoto: string;
  department: string;
  domain: string;
  date: string;
  time: string;
  registrationFee: number;
  status: 'draft' | 'upcoming' | 'live' | 'completed';
  createdAt: string;
  registrationUrl: string;
  platform: string;
  teamsLink: string;
}

export interface Participant {
  id: string;
  webinarId: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  registeredAt: string;
  paymentVerified: boolean;
  paymentScreenshot: string;
  teamsLinkSent: boolean;
}

export interface AttendanceRecord {
  id: string;
  webinarId: string;
  studentId: string;
  participantId: string;
  markedAt: string;
  present: boolean;
  email: string;
}

export interface Certificate {
  id: string;
  webinarId: string;
  participantId: string;
  studentId: string;
  participantName: string;
  webinarTitle: string;
  webinarDate: string;
  webinarDomain: string;
  webinarTopic: string;
  issuedAt: string;
}

export interface EmailLog {
  id: string;
  webinarId: string;
  subject: string;
  type: 'invitation' | 'reminder' | 'followup';
  recipientCount: number;
  status: 'sent' | 'pending' | 'failed';
  sentAt: string;
}

export interface FeedbackEntry {
  id: string;
  webinarId: string;
  participantName: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

export type PosterTheme =
  | 'professional-blue' | 'elegant-dark' | 'tech-gradient' | 'minimal-white'
  | 'vibrant-orange' | 'academic-green' | 'creative-purple' | 'bold-red'
  | 'soft-pastel' | 'neon-glow' | 'classic-gold' | 'modern-teal'
  | 'geometric' | 'abstract-wave';
