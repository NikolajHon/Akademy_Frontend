export interface AnswerOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'OPEN';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options: AnswerOption[];
}

export interface QuestionsResponse {
  questions: Question[];
  page: number;
  size: number;
}

export interface CreateQuestionRequestDto {
  text: string;
  type: QuestionType;
  options?: { text: string; correct: boolean }[];
}

export interface UpdateQuestionRequestDto extends CreateQuestionRequestDto {
  id: number;
}

export interface RatingDto {
  rating: number;
}
