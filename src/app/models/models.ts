export interface MemberSearchResult {
  memberId: number; firstName: string;
  lastName: string;
  post: string;
  institution: string;
}

export class CommitteeCreationDto {
  name: string = "";
  description: string = "";
  status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';
  maximumNumberOfMeetings?: number = undefined;
  members: Map<number, string> = new Map<number, string>();
  coordinatorId: number = 0;
  minuteLanguage: string = "";
}

export class CommitteeDetailsDto{
    id: number = 0;
    name: string = "";
    description: string = "";
    createdDate: string = "";
    status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';
    maxNoOfMeetings?: number = undefined;
    meetings: MeetingSummaryDto[] = [];
    members: MemberSummaryDto[] = [];
}

export class MemberSummaryDto {
    memberId: number = 0;
    firstName: string = "";
    lastName: string = "";
    institution: string = "";
    post: string = "";
    role: string = "";
}


export class MeetingSummaryDto {
    id: number = 0;
    title: string = "";
    heldDate: string = "";
    heldTime: number[] =[] ; //HH:mm:ss
    heldPlace: string = "";
    createdDate: string = "";
}

export class CommitteeOverviewDto {
    name: string = "";
    description: string = "";
    createdDate: string = "";
    memberCount: number = 0;
    meetingCount: number = 0;
    decisionCount: number = 0;
    coordinatorName: string = "";
    firstMeetingDate: string = "";
    lastMeetingDate: string = "";
    meetingDates: string[] = [];
}

export class MemberOfCommitteeDto {
    id: number =0;
    name: string = "";
    role: string = "";
}

export class MinuteDataDto {
  minuteLanguage: string = "";
  meetingHeldDateNepali: string = "";
  meetingHeldDate: string = "";
  meetingHeldDay: string = "";
  partOfDay: string = "";
  meetingHeldTime: string = "";
  meetingHeldPlace: string = "";
  committeeName: string = "";
  committeeDescription: string = "";
  coordinatorFullName: string = "";
  decisions: DecisionDto[] = [];
  agendas: AgendaDto[] = [];
  committeeMemberships: CommitteeMembershipDto[] = [];
}

export class DecisionDto {
  decisionId: number = 0;
  decision: string = "";
}
export class AgendaDto {
  agendaId: number = 0;
  agenda: string = ""
}

export class CommitteeMembershipDto {
    fullName: string = "";
    role: string = "";
}


export class MemberDetailsDto {
  firstName: string = "";
  lastName: string = ""
  username: string = "";
  institution: string = "";
  title: string = "";
  post: string = ""
  email: string = "";
}

export class MemberCreationDto {
    firstName: string = "";
    lastName: string = "";
    title: string = "";
    post: string = "";
}

export class MeetingCreationDto {
    title: string = "";
    heldDate: string = "";
    heldTime: string = ""
    heldPlace: string = "";
    inviteeIds: number[] = []
    decisions: string[] = [];
    agendas: string[] = [];
}
