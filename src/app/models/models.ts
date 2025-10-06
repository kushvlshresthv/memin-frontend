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
    createdDate: Date = new Date();
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
    heldDate: Date = new Date();
    heldTime: string = ""; //HH:mm:ss
    heldPlace: string = "";
    createdDate: Date = new Date();
}
