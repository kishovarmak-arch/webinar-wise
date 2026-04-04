import { Webinar, Participant, AttendanceRecord, Certificate, EmailLog, FeedbackEntry } from './types';

const KEYS = {
  webinars: 'nscet_webinars',
  participants: 'nscet_participants',
  attendance: 'nscet_attendance',
  certificates: 'nscet_certificates',
  emails: 'nscet_emails',
  feedback: 'nscet_feedback',
  auth: 'nscet_auth',
};

function get<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch { return []; }
}

function set<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const store = {
  // Auth
  isLoggedIn: () => localStorage.getItem(KEYS.auth) === 'true',
  login: (email: string, password: string) => {
    if (email === 'admin@nscet.edu' && password === 'admin123') {
      localStorage.setItem(KEYS.auth, 'true');
      return true;
    }
    return false;
  },
  logout: () => localStorage.removeItem(KEYS.auth),

  // Webinars
  getWebinars: (): Webinar[] => get(KEYS.webinars),
  getWebinar: (id: string) => get<Webinar>(KEYS.webinars).find(w => w.id === id),
  saveWebinar: (webinar: Webinar) => {
    const list = get<Webinar>(KEYS.webinars);
    const idx = list.findIndex(w => w.id === webinar.id);
    if (idx >= 0) list[idx] = webinar; else list.push(webinar);
    set(KEYS.webinars, list);
  },
  deleteWebinar: (id: string) => {
    set(KEYS.webinars, get<Webinar>(KEYS.webinars).filter(w => w.id !== id));
  },

  // Participants
  getParticipants: (webinarId?: string): Participant[] => {
    const all = get<Participant>(KEYS.participants);
    return webinarId ? all.filter(p => p.webinarId === webinarId) : all;
  },
  addParticipant: (p: Participant) => {
    const list = get<Participant>(KEYS.participants);
    list.push(p);
    set(KEYS.participants, list);
  },
  getAllPreviousAttendeeEmails: (): string[] => {
    const attendance = get<AttendanceRecord>(KEYS.attendance).filter(a => a.present);
    const participants = get<Participant>(KEYS.participants);
    const attendedIds = new Set(attendance.map(a => a.participantId));
    return [...new Set(participants.filter(p => attendedIds.has(p.id)).map(p => p.email))];
  },

  // Attendance
  getAttendance: (webinarId: string): AttendanceRecord[] =>
    get<AttendanceRecord>(KEYS.attendance).filter(a => a.webinarId === webinarId),
  markAttendance: (record: AttendanceRecord) => {
    const list = get<AttendanceRecord>(KEYS.attendance);
    const idx = list.findIndex(a => a.webinarId === record.webinarId && a.studentId === record.studentId);
    if (idx >= 0) list[idx] = record; else list.push(record);
    set(KEYS.attendance, list);
  },

  // Certificates
  getCertificates: (webinarId?: string): Certificate[] => {
    const all = get<Certificate>(KEYS.certificates);
    return webinarId ? all.filter(c => c.webinarId === webinarId) : all;
  },
  generateCertificates: (webinarId: string): Certificate[] => {
    const participants = get<Participant>(KEYS.participants).filter(p => p.webinarId === webinarId);
    const attendance = get<AttendanceRecord>(KEYS.attendance).filter(a => a.webinarId === webinarId && a.present);
    const webinar = get<Webinar>(KEYS.webinars).find(w => w.id === webinarId);
    if (!webinar) return [];

    const attendedStudentIds = new Set(attendance.map(a => a.studentId));
    const eligible = participants.filter(p => attendedStudentIds.has(p.studentId));

    const existing = get<Certificate>(KEYS.certificates);
    const existingIds = new Set(existing.filter(c => c.webinarId === webinarId).map(c => c.participantId));

    const newCerts: Certificate[] = eligible
      .filter(p => !existingIds.has(p.id))
      .map(p => ({
        id: crypto.randomUUID(),
        webinarId,
        participantId: p.id,
        studentId: p.studentId,
        participantName: p.name,
        webinarTitle: webinar.title,
        webinarDate: webinar.date,
        issuedAt: new Date().toISOString(),
      }));

    set(KEYS.certificates, [...existing, ...newCerts]);
    return newCerts;
  },

  // Emails
  getEmailLogs: (webinarId?: string): EmailLog[] => {
    const all = get<EmailLog>(KEYS.emails);
    return webinarId ? all.filter(e => e.webinarId === webinarId) : all;
  },
  addEmailLog: (log: EmailLog) => {
    const list = get<EmailLog>(KEYS.emails);
    list.push(log);
    set(KEYS.emails, list);
  },

  // Feedback
  getFeedback: (webinarId?: string): FeedbackEntry[] => {
    const all = get<FeedbackEntry>(KEYS.feedback);
    return webinarId ? all.filter(f => f.webinarId === webinarId) : all;
  },
  addFeedback: (entry: FeedbackEntry) => {
    const list = get<FeedbackEntry>(KEYS.feedback);
    list.push(entry);
    set(KEYS.feedback, list);
  },

  // Seed mock data
  seedIfEmpty: () => {
    if (get<Webinar>(KEYS.webinars).length > 0) return;

    const webinars: Webinar[] = [
      {
        id: 'w1', title: 'Introduction to AI & Machine Learning', topic: 'Artificial Intelligence',
        description: 'A comprehensive webinar covering the basics of AI and ML with hands-on examples.',
        mentorName: 'Dr. Ramesh Kumar', mentorPhoto: '', department: 'Computer Science',
        date: '2026-04-15', time: '10:00', registrationFee: 99, status: 'upcoming',
        createdAt: '2026-04-01T10:00:00Z', registrationUrl: '/register/w1',
      },
      {
        id: 'w2', title: 'Web Development with React', topic: 'Frontend Development',
        description: 'Learn modern web development techniques using React and TypeScript.',
        mentorName: 'Prof. Anitha Devi', mentorPhoto: '', department: 'Information Technology',
        date: '2026-03-20', time: '14:00', registrationFee: 99, status: 'completed',
        createdAt: '2026-03-10T08:00:00Z', registrationUrl: '/register/w2',
      },
      {
        id: 'w3', title: 'Cloud Computing Essentials', topic: 'Cloud Architecture',
        description: 'Understand cloud platforms, deployment strategies, and scalability patterns.',
        mentorName: 'Dr. Suresh Babu', mentorPhoto: '', department: 'Computer Science',
        date: '2026-04-25', time: '11:00', registrationFee: 99, status: 'upcoming',
        createdAt: '2026-04-03T09:00:00Z', registrationUrl: '/register/w3',
      },
    ];

    const participants: Participant[] = [
      { id: 'p1', webinarId: 'w2', name: 'Arun Kumar', studentId: 'STU001', email: 'arun@nscet.edu', phone: '9876543210', department: 'CSE', year: 'III', registeredAt: '2026-03-12T10:00:00Z' },
      { id: 'p2', webinarId: 'w2', name: 'Priya Lakshmi', studentId: 'STU002', email: 'priya@nscet.edu', phone: '9876543211', department: 'IT', year: 'II', registeredAt: '2026-03-13T11:00:00Z' },
      { id: 'p3', webinarId: 'w2', name: 'Karthik Raja', studentId: 'STU003', email: 'karthik@nscet.edu', phone: '9876543212', department: 'CSE', year: 'IV', registeredAt: '2026-03-14T09:00:00Z' },
      { id: 'p4', webinarId: 'w1', name: 'Divya Shree', studentId: 'STU004', email: 'divya@nscet.edu', phone: '9876543213', department: 'ECE', year: 'III', registeredAt: '2026-04-05T10:00:00Z' },
      { id: 'p5', webinarId: 'w1', name: 'Vikram Singh', studentId: 'STU005', email: 'vikram@nscet.edu', phone: '9876543214', department: 'CSE', year: 'II', registeredAt: '2026-04-06T11:00:00Z' },
    ];

    const attendance: AttendanceRecord[] = [
      { id: 'a1', webinarId: 'w2', studentId: 'STU001', participantId: 'p1', markedAt: '2026-03-20T14:05:00Z', present: true },
      { id: 'a2', webinarId: 'w2', studentId: 'STU002', participantId: 'p2', markedAt: '2026-03-20T14:03:00Z', present: true },
      { id: 'a3', webinarId: 'w2', studentId: 'STU003', participantId: 'p3', markedAt: '2026-03-20T14:10:00Z', present: false },
    ];

    const certificates: Certificate[] = [
      { id: 'c1', webinarId: 'w2', participantId: 'p1', studentId: 'STU001', participantName: 'Arun Kumar', webinarTitle: 'Web Development with React', webinarDate: '2026-03-20', issuedAt: '2026-03-21T10:00:00Z' },
      { id: 'c2', webinarId: 'w2', participantId: 'p2', studentId: 'STU002', participantName: 'Priya Lakshmi', webinarTitle: 'Web Development with React', webinarDate: '2026-03-20', issuedAt: '2026-03-21T10:00:00Z' },
    ];

    const emails: EmailLog[] = [
      { id: 'e1', webinarId: 'w2', subject: 'You\'re Invited: Web Development with React', type: 'invitation', recipientCount: 150, status: 'sent', sentAt: '2026-03-11T09:00:00Z' },
      { id: 'e2', webinarId: 'w2', subject: 'Reminder: Webinar Tomorrow!', type: 'reminder', recipientCount: 45, status: 'sent', sentAt: '2026-03-19T08:00:00Z' },
      { id: 'e3', webinarId: 'w1', subject: 'Join Us: AI & Machine Learning Webinar', type: 'invitation', recipientCount: 200, status: 'sent', sentAt: '2026-04-04T10:00:00Z' },
    ];

    const feedback: FeedbackEntry[] = [
      { id: 'f1', webinarId: 'w2', participantName: 'Arun Kumar', rating: 5, comment: 'Excellent session! Very informative and well-structured.', submittedAt: '2026-03-20T16:00:00Z' },
      { id: 'f2', webinarId: 'w2', participantName: 'Priya Lakshmi', rating: 4, comment: 'Great content. Would love more hands-on exercises.', submittedAt: '2026-03-20T16:30:00Z' },
    ];

    set(KEYS.webinars, webinars);
    set(KEYS.participants, participants);
    set(KEYS.attendance, attendance);
    set(KEYS.certificates, certificates);
    set(KEYS.emails, emails);
    set(KEYS.feedback, feedback);
  },
};
