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
