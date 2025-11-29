export interface MemberSearchResult {
  memberId: number;
  firstName: string;
  lastName: string;
}

export interface MemberDetails {
  memberId: number;
  firstName: string;
  lastName: string;
  post: string;
  title: string;
}

export class CommitteeCreationDto {
  name: string = '';
  description: string = '';
  status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';
  maximumNumberOfMeetings?: number = undefined;
  members: MemberIdAndRole[] = [];
  coordinatorId: number = 0;
  minuteLanguage: string = '';
}

export class MemberIdAndRole {
  memberId!: number;
  role!: string;
}

export class CommitteeDetailsDto {
  id: number = 0;
  name: string = '';
  description: string = '';
  createdDate: string = '';
  status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';
  maxNoOfMeetings?: number = undefined;
  meetings: MeetingSummaryDto[] = [];
  members: MemberSummaryDto[] = [];
}

export class MemberSummaryDto {
  memberId: number = 0;
  firstName: string = '';
  lastName: string = '';
  institution: string = '';
  post: string = '';
  role: string = '';
}

export class MeetingSummaryDto {
  id: number = 0;
  title: string = '';
  heldDate: string = '';
  heldTime: number[] = []; //HH:mm:ss
  heldPlace: string = '';
  createdDate: string = '';
}

export class CommitteeOverviewDto {
  name: string = '';
  description: string = '';
  createdDate: string = '';
  memberCount: number = 0;
  meetingCount: number = 0;
  decisionCount: number = 0;
  coordinatorName: string = '';
  firstMeetingDate: string = '';
  lastMeetingDate: string = '';
  meetingDates: string[] = [];
  language: string = '';
}

export class MemberOfCommitteeDto {
  id: number = 0;
  name: string = '';
  role: string = '';
}

export class MinuteDataDto {
  minuteLanguage: string = '';
  meetingHeldDateNepali: string = '';
  meetingHeldDate: string = '';
  meetingHeldDay: string = '';
  partOfDay: string = '';
  meetingHeldTime: string = '';
  meetingHeldPlace: string = '';
  committeeName: string = '';
  committeeDescription: string = '';
  coordinatorFullName: string = '';
  decisions: DecisionDto[] = [];
  agendas: AgendaDto[] = [];
  committeeMemberships: CommitteeMembershipDto[] = [];
}

export class DecisionDto {
  decisionId: number = 0;
  decision: string = '';
}
export class AgendaDto {
  agendaId: number = 0;
  agenda: string = '';
}


export class DecisionWithMeetingId {
  meetingId: number = 0;
  decision: string = '';
}
export class AgendaWithMeetingId {
  meetingId: number = 0;
  agenda: string = '';
}


export class CommitteeMembershipDto {
  fullName: string = '';
  role: string = '';
}

export class MemberDetailsDto {
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  institution: string = '';
  title: string = '';
  post: string = '';
  email: string = '';
}

export class MemberCreationDto {
  firstName: string = '';
  lastName: string = '';
  title: string = '';
  post: string = '';
}

export class MeetingCreationDto {
  committeeId: number = 0;
  title: string = '';
  heldDate: string = '';
  heldTime: string = '';
  heldPlace: string = '';
  inviteeIds: number[] = [];
  decisions: string[] = [];
  agendas: string[] = [];
}

export class CommitteeDetailsForEditDto {
  id: number = 0;
  name: string = '';
  description: string = '';
  status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';
  maxNoOfMeetings?: number = undefined;
  minuteLanguage: 'NEPALI' | 'ENGLISH' | null = null;
  coordinator: MemberDetails = {
    memberId: 0,
    firstName: '',
    lastName: '',
    post: '',
    title:'',
  };
  membersWithRoles: MemberDetailsWithRole[] = [];
}

export class MemberDetailsWithRole {
  member: MemberDetails = {
    memberId: 0,
    firstName: '',
    lastName: '',
    post: '',
    title: '',
  };
  role: string = '';
}

export class MinuteUpdateDto {
  committeeName!: string;
  committeeDescription!: string;
  meetingHeldDate!: string;
  meetingHeldTime!: string;
  meetingHeldPlace!: string;
  decisions!: DecisionDto[];
  agendas!: AgendaDto[];
}

export class GlobalSearchResult {
  committees!:CommitteeIdAndName[];
  members!: MemberSearchResult[];
  decisions!: DecisionWithMeetingId[];
  agendas!: AgendaWithMeetingId[];
}

export class CommitteeIdAndName {
  committeeId!: number;
  committeeName!: string;
}

export class CommitteeExtendedSummary {
  committeeId!: number;
  name!: string;
  description!: string
  language!: "NEPALI" | "ENGLISH" | null;
  meetings!: MeetingExtendedSummary[];
}

export class MeetingExtendedSummary {
  meetingId!: number;
  meetingHeldDate!: string
  meetingHeldPlace!: string;
  meetingHeldTime!: string
  decisions!: string[];
  agendas!: string[]
  inviteeNames!: string[];
}

