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
