export interface MemberSearchResult {
  memberId: number;
  firstName: string;
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
