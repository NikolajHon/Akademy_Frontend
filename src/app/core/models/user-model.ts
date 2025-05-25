import { UserRole } from './user-role-enum';


export interface UserModel {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface UserDto {
  id: number;
  givingName: string;
  familyName: string;
  email: string;
  role: string;
  rating: number;
  courses: CourseDto[];
}


export interface CourseDto {
  id: number;
  name: string;
  description: string;
}


export interface UsersResponseDto {
  users: UserDto[];
}

export interface CreateUserRequestDto {
  givingName: string;
  familyName: string;
  email: string;
  role: UserRole;
  keycloakId: string;
}

export interface RatingDto {
  rating: number;
}

export interface CourseProgressIdDto {
  courseId: number;
  keycloakId: string;
}

export interface CourseProgressWithUserDto {
  courseProgressId: CourseProgressIdDto;
  user: UserDto;
  lessonIds: number[];
  rating: number;
}
