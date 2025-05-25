import { AnswerOption } from './answer-option.model';

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
  options?: Array<{
    text: string;
    correct: boolean;
  }>;
}

export interface UpdateQuestionRequestDto extends CreateQuestionRequestDto {
  /** Согласно OpenAPI-схеме, в теле PUT-запроса надо передавать и id */
  id: number;
}
