export interface Assignment {
  id: number;
  description: string;
  title: string;
  templateCode: string;
  expectedOutput: string;
  outputType: 'STRING' | 'INT' | 'JSON';
}

export interface CreateAssignmentRequestDto {
  title: string;
  description: string;
  teacherCode: string;
  templateCode: string;
  language: string;
  outputType: 'STRING' | 'INT' | 'JSON';
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
}
export interface SubmissionRequestDto {
  code: string;
}

export interface TestCaseResultDto {
  input: string | null;
  expectedOutput: string | null;
  actualOutput: string | null;
  passed: boolean;
}

export interface SubmissionResponseDto {
  results: TestCaseResultDto[];
  allPassed?: boolean;
}
