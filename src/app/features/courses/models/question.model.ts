import { AnswerOption } from './answer-option.model';

export interface Question {
  id: number;
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'OPEN';
  options: AnswerOption[];
}

export interface QuestionsResponse {
  questions: Question[];
  page: number;
  size: number;
}

export interface CreateQuestionRequestDto {
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'OPEN';
  options: { text: string; isCorrect: boolean }[];
}

export interface UpdateQuestionRequestDto extends CreateQuestionRequestDto {}

