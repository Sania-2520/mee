import { Meeting, Task, Decision, User, TranscriptLine, ChatMessage } from './types';

// Mock Data
export const mockUsers: User[] = [
  { id: 'u1', name: 'Alex Johnson', role: 'Product Manager', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 'u2', name: 'Sarah Miller', role: 'Lead Developer', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'u3', name: 'James Wilson', role: 'UI/UX Designer', avatarUrl: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
  { id: 'u4', name: 'Emily Davis', role: 'QA Engineer', avatarUrl: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
];

export const mockMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Q3 Product Roadmap Planning',
    date: '2026-03-12T10:00:00Z',
    duration: 60,
    participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
    summary: [
      'Agreed to prioritize the new Mobile App redesign for Q3.',
      'Decided to delay the legacy API deprecation to Q4.',
      'Assigned initial design wireframes to James.',
    ],
    tasksCount: 3,
    decisionsCount: 2,
    productivityScore: 92,
    project: 'Core Platform',
  },
  {
    id: 'm2',
    title: 'Weekly Engineering Sync',
    date: '2026-03-11T14:30:00Z',
    duration: 45,
    participants: mockUsers,
    summary: [
      'Reviewed current sprint progress; mostly on track.',
      'Identified a bottleneck in the CI/CD pipeline deployment times.',
      'Agreed Sarah will investigate pipeline fixes.',
    ],
    tasksCount: 1,
    decisionsCount: 1,
    productivityScore: 85,
    project: 'Infrastructure',
  },
  {
    id: 'm3',
    title: 'Design System Review',
    date: '2026-03-10T11:00:00Z',
    duration: 30,
    participants: [mockUsers[2], mockUsers[0]],
    summary: [
      'Approved the new color contrast updates.',
      'Pending review on the new button variants.',
    ],
    tasksCount: 2,
    decisionsCount: 1,
    productivityScore: 78,
    project: 'Design',
  },
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Create mobile app wireframes',
    assignee: mockUsers[2],
    priority: 'High',
    category: 'Development',
    deadline: '2026-03-20T00:00:00Z',
    status: 'In Progress',
    meetingId: 'm1',
  },
  {
    id: 't2',
    title: 'Investigate CI/CD pipeline delays',
    assignee: mockUsers[1],
    priority: 'High',
    category: 'Development',
    deadline: '2026-03-15T00:00:00Z',
    status: 'Pending',
    meetingId: 'm2',
  },
  {
    id: 't3',
    title: 'Update Button variants in Figma',
    assignee: mockUsers[2],
    priority: 'Medium',
    category: 'Development',
    deadline: '2026-03-18T00:00:00Z',
    status: 'Completed',
    meetingId: 'm3',
  },
  {
    id: 't4',
    title: 'Draft Q3 marketing copy',
    assignee: mockUsers[0],
    priority: 'Low',
    category: 'Media',
    deadline: '2026-03-25T00:00:00Z',
    status: 'Pending',
  },
];

export const mockDecisions: Decision[] = [
  {
    id: 'd1',
    title: 'Prioritize Mobile Redesign',
    description: 'Mobile app redesign will be the primary focus for the entire team in Q3.',
    date: '2026-03-12T10:30:00Z',
    status: 'Confirmed',
    meetingId: 'm1',
  },
  {
    id: 'd2',
    title: 'Delay API Deprecation',
    description: 'Legacy v1 API deprecation moved to Q4 to accommodate enterprise clients.',
    date: '2026-03-12T10:45:00Z',
    status: 'Updated',
    meetingId: 'm1',
  },
  {
    id: 'd3',
    title: 'Switch to new CI Runner',
    description: 'Migrate to GitHub Actions from Jenkins to solve delay issues.',
    date: '2026-03-11T15:00:00Z',
    status: 'Conflict detected',
    meetingId: 'm2',
  },
];

export const mockTranscript: TranscriptLine[] = [
  { id: 'tr1', speaker: mockUsers[0], text: 'Alright, let\'s get started. First on the agenda is the Q3 roadmap.', timestamp: '00:00' },
  { id: 'tr2', speaker: mockUsers[1], text: 'I think we really need to prioritize the mobile redesign. Our current app is lagging behind competitors.', timestamp: '00:15' },
  { id: 'tr3', speaker: mockUsers[2], text: 'I agree. I can start working on the new wireframes this week.', timestamp: '00:30' },
  { id: 'tr4', speaker: mockUsers[0], text: 'Great. Let\'s make that our P1. What about the legacy API deprecation?', timestamp: '00:45' },
  { id: 'tr5', speaker: mockUsers[1], text: 'It\'s risky to do both simultaneously. Some enterprise clients asked for an extension anyway.', timestamp: '01:10' },
  { id: 'tr6', speaker: mockUsers[0], text: 'Good point. Let\'s delay the API deprecation to Q4 then.', timestamp: '01:25' },
];

export const mockChatHistory: ChatMessage[] = [
  { id: 'c1', role: 'user', content: "What decisions were made in yesterday's engineering sync?", timestamp: '10:00 AM' },
  { id: 'c2', role: 'assistant', content: "In yesterday's Weekly Engineering Sync, the main decision discussed was \"Switch to new CI Runner\" (migrating to GitHub Actions). However, this currently has a \"Conflict detected\" status that needs resolution.", timestamp: '10:00 AM' },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'API request failed');
  }
  return response.json();
}

// API Functions
export const api = {
  getMeetings: async (): Promise<Meeting[]> => {
    const response = await fetch(`${API_BASE_URL}/meetings/`);
    return handleResponse(response);
  },
  getMeeting: async (id: string): Promise<Meeting | undefined> => {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`);
    return handleResponse(response);
  },
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks/`);
    return handleResponse(response);
  },
  getDecisions: async (): Promise<Decision[]> => {
    // Backend uses /timeline for decisions/events
    const response = await fetch(`${API_BASE_URL}/timeline/`);
    return handleResponse(response);
  },
  getTranscript: async (meetingId: string): Promise<TranscriptLine[]> => {
    // In this backend, transcript is a property of the meeting or returned by meetings endpoints
    // However, keeping the specific fetch if needed, though usually it's in getMeeting
    const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}`);
    const data = await handleResponse(response);
    // Transform string transcript to TranscriptLine[] if necessary, or just return as is if types match
    return data.transcript_lines || []; 
  },
  sendChatMessage: async (message: string, meetingId: string = "all"): Promise<ChatMessage> => {
    const response = await fetch(`${API_BASE_URL}/chat/${meetingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: message }),
    });
    const data = await handleResponse(response);
    return {
      id: Math.random().toString(36).substring(7),
      role: 'assistant',
      content: data.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
};
