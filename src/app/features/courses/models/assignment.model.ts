export interface Assignment {
  id: number;
  description: string;
  templateCode: string;
  expectedOutput: string;
  outputType: 'STRING' | 'INT' | 'JSON'; // Типы вывода
}

export interface CreateAssignmentRequestDto {
  description: string;
  templateCode: string;
  expectedOutput: string;
  outputType: 'STRING' | 'INT' | 'JSON';
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
