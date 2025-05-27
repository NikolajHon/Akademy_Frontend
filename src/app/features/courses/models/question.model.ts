export interface AnswerOptionPublic {
  id: number
  text: string
}

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'OPEN'

export interface QuestionPublic {
  id: number
  text: string
  type: QuestionType
  options: AnswerOptionPublic[]
}

export interface QuestionsPublicResponse {
  questions: QuestionPublic[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface AnswerOption {
  id: number
  text: string
  isCorrect: boolean
}

export interface Question {
  id: number
  text: string
  type: QuestionType
  options: AnswerOption[]
}

export interface QuestionsResponse {
  questions: Question[]
  page: number
  size: number
}

export interface CreateQuestionRequestDto {
  text: string
  type: QuestionType
  options?: { text: string; correct: boolean }[]
}

export interface UpdateQuestionRequestDto extends CreateQuestionRequestDto {
  id: number
}

export interface UserAnswerDto {
  questionId: number
  selectedOptionId: number
}

export interface AnswerResultDto {
  questionId: number
  correct: boolean
}

export interface CheckAnswersRequestDto {
  answers: UserAnswerDto[]
}

export interface CheckAnswersResponseDto {
  results: AnswerResultDto[]
}

export interface RatingDto {
  rating: number
}
