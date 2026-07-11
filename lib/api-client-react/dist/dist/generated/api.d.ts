import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AIAnalysis, AcademicSummary, AcademicsUpdate, AdminDashboard, AuthResponse, Certification, CertificationInput, ChangePasswordBody, ChangePasswordResponse, CodingProfiles, CodingProfilesUpdate, Company, CompanyEligibility, CompanyInput, CompanyUpdate, Department, DepartmentInput, DepartmentUpdate, GeneratedResume, HealthStatus, Internship, InternshipInput, InternshipUpdate, Interview, InterviewInput, InterviewUpdate, JobApplication, JobPosting, JobPostingInput, JobPostingUpdate, LoginCredentials, Notification, OfficerDashboard, PlacementStats, Project, ProjectInput, ProjectUpdate, RegisterInput, Skill, SkillGapItem, SkillInput, StudentDashboard, StudentDetail, StudentProfile, StudentProfileUpdate, StudentSummary, UpdateAccountBody, User, UserUpdate } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getLoginUserUrl: () => string;
/**
 * @summary Login
 */
export declare const loginUser: (loginCredentials: LoginCredentials, options?: RequestInit) => Promise<AuthResponse>;
export declare const getLoginUserMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof loginUser>>, TError, {
        data: BodyType<LoginCredentials>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof loginUser>>, TError, {
    data: BodyType<LoginCredentials>;
}, TContext>;
export type LoginUserMutationResult = NonNullable<Awaited<ReturnType<typeof loginUser>>>;
export type LoginUserMutationBody = BodyType<LoginCredentials>;
export type LoginUserMutationError = ErrorType<void>;
/**
* @summary Login
*/
export declare const useLoginUser: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof loginUser>>, TError, {
        data: BodyType<LoginCredentials>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof loginUser>>, TError, {
    data: BodyType<LoginCredentials>;
}, TContext>;
export declare const getRegisterUserUrl: () => string;
/**
 * @summary Register new user
 */
export declare const registerUser: (registerInput: RegisterInput, options?: RequestInit) => Promise<AuthResponse>;
export declare const getRegisterUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerUser>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof registerUser>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
export type RegisterUserMutationResult = NonNullable<Awaited<ReturnType<typeof registerUser>>>;
export type RegisterUserMutationBody = BodyType<RegisterInput>;
export type RegisterUserMutationError = ErrorType<unknown>;
/**
* @summary Register new user
*/
export declare const useRegisterUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerUser>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof registerUser>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
export declare const getGetMeUrl: () => string;
/**
 * @summary Get current user
 */
export declare const getMe: (options?: RequestInit) => Promise<User>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<unknown>;
/**
 * @summary Get current user
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateMyAccountUrl: () => string;
/**
 * @summary Update account name/email
 */
export declare const updateMyAccount: (updateAccountBody: UpdateAccountBody, options?: RequestInit) => Promise<AuthResponse>;
export declare const getUpdateMyAccountMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMyAccount>>, TError, {
        data: BodyType<UpdateAccountBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMyAccount>>, TError, {
    data: BodyType<UpdateAccountBody>;
}, TContext>;
export type UpdateMyAccountMutationResult = NonNullable<Awaited<ReturnType<typeof updateMyAccount>>>;
export type UpdateMyAccountMutationBody = BodyType<UpdateAccountBody>;
export type UpdateMyAccountMutationError = ErrorType<unknown>;
/**
* @summary Update account name/email
*/
export declare const useUpdateMyAccount: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMyAccount>>, TError, {
        data: BodyType<UpdateAccountBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMyAccount>>, TError, {
    data: BodyType<UpdateAccountBody>;
}, TContext>;
export declare const getChangeMyPasswordUrl: () => string;
/**
 * @summary Change account password
 */
export declare const changeMyPassword: (changePasswordBody: ChangePasswordBody, options?: RequestInit) => Promise<ChangePasswordResponse>;
export declare const getChangeMyPasswordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof changeMyPassword>>, TError, {
        data: BodyType<ChangePasswordBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof changeMyPassword>>, TError, {
    data: BodyType<ChangePasswordBody>;
}, TContext>;
export type ChangeMyPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof changeMyPassword>>>;
export type ChangeMyPasswordMutationBody = BodyType<ChangePasswordBody>;
export type ChangeMyPasswordMutationError = ErrorType<unknown>;
/**
* @summary Change account password
*/
export declare const useChangeMyPassword: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof changeMyPassword>>, TError, {
        data: BodyType<ChangePasswordBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof changeMyPassword>>, TError, {
    data: BodyType<ChangePasswordBody>;
}, TContext>;
export declare const getGetMyProfileUrl: () => string;
/**
 * @summary Get my student profile
 */
export declare const getMyProfile: (options?: RequestInit) => Promise<StudentProfile>;
export declare const getGetMyProfileQueryKey: () => readonly ["/api/students/profile"];
export declare const getGetMyProfileQueryOptions: <TData = Awaited<ReturnType<typeof getMyProfile>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMyProfile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMyProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getMyProfile>>>;
export type GetMyProfileQueryError = ErrorType<unknown>;
/**
 * @summary Get my student profile
 */
export declare function useGetMyProfile<TData = Awaited<ReturnType<typeof getMyProfile>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateMyProfileUrl: () => string;
/**
 * @summary Update my student profile
 */
export declare const updateMyProfile: (studentProfileUpdate: StudentProfileUpdate, options?: RequestInit) => Promise<StudentProfile>;
export declare const getUpdateMyProfileMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
        data: BodyType<StudentProfileUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
    data: BodyType<StudentProfileUpdate>;
}, TContext>;
export type UpdateMyProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateMyProfile>>>;
export type UpdateMyProfileMutationBody = BodyType<StudentProfileUpdate>;
export type UpdateMyProfileMutationError = ErrorType<unknown>;
/**
* @summary Update my student profile
*/
export declare const useUpdateMyProfile: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
        data: BodyType<StudentProfileUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
    data: BodyType<StudentProfileUpdate>;
}, TContext>;
export declare const getGetMyAcademicsUrl: () => string;
/**
 * @summary Get my academic records
 */
export declare const getMyAcademics: (options?: RequestInit) => Promise<AcademicSummary>;
export declare const getGetMyAcademicsQueryKey: () => readonly ["/api/students/academics"];
export declare const getGetMyAcademicsQueryOptions: <TData = Awaited<ReturnType<typeof getMyAcademics>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyAcademics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMyAcademics>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMyAcademicsQueryResult = NonNullable<Awaited<ReturnType<typeof getMyAcademics>>>;
export type GetMyAcademicsQueryError = ErrorType<unknown>;
/**
 * @summary Get my academic records
 */
export declare function useGetMyAcademics<TData = Awaited<ReturnType<typeof getMyAcademics>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyAcademics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateMyAcademicsUrl: () => string;
/**
 * @summary Update my academic records
 */
export declare const updateMyAcademics: (academicsUpdate: AcademicsUpdate, options?: RequestInit) => Promise<AcademicSummary>;
export declare const getUpdateMyAcademicsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMyAcademics>>, TError, {
        data: BodyType<AcademicsUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMyAcademics>>, TError, {
    data: BodyType<AcademicsUpdate>;
}, TContext>;
export type UpdateMyAcademicsMutationResult = NonNullable<Awaited<ReturnType<typeof updateMyAcademics>>>;
export type UpdateMyAcademicsMutationBody = BodyType<AcademicsUpdate>;
export type UpdateMyAcademicsMutationError = ErrorType<unknown>;
/**
* @summary Update my academic records
*/
export declare const useUpdateMyAcademics: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMyAcademics>>, TError, {
        data: BodyType<AcademicsUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMyAcademics>>, TError, {
    data: BodyType<AcademicsUpdate>;
}, TContext>;
export declare const getGetStudentDashboardUrl: () => string;
/**
 * @summary Get student dashboard summary
 */
export declare const getStudentDashboard: (options?: RequestInit) => Promise<StudentDashboard>;
export declare const getGetStudentDashboardQueryKey: () => readonly ["/api/students/dashboard"];
export declare const getGetStudentDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getStudentDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudentDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStudentDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStudentDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getStudentDashboard>>>;
export type GetStudentDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get student dashboard summary
 */
export declare function useGetStudentDashboard<TData = Awaited<ReturnType<typeof getStudentDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudentDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListMySkillsUrl: () => string;
/**
 * @summary List my skills
 */
export declare const listMySkills: (options?: RequestInit) => Promise<Skill[]>;
export declare const getListMySkillsQueryKey: () => readonly ["/api/students/skills"];
export declare const getListMySkillsQueryOptions: <TData = Awaited<ReturnType<typeof listMySkills>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMySkills>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMySkills>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMySkillsQueryResult = NonNullable<Awaited<ReturnType<typeof listMySkills>>>;
export type ListMySkillsQueryError = ErrorType<unknown>;
/**
 * @summary List my skills
 */
export declare function useListMySkills<TData = Awaited<ReturnType<typeof listMySkills>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMySkills>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAddSkillUrl: () => string;
/**
 * @summary Add a skill
 */
export declare const addSkill: (skillInput: SkillInput, options?: RequestInit) => Promise<Skill>;
export declare const getAddSkillMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addSkill>>, TError, {
        data: BodyType<SkillInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addSkill>>, TError, {
    data: BodyType<SkillInput>;
}, TContext>;
export type AddSkillMutationResult = NonNullable<Awaited<ReturnType<typeof addSkill>>>;
export type AddSkillMutationBody = BodyType<SkillInput>;
export type AddSkillMutationError = ErrorType<unknown>;
/**
* @summary Add a skill
*/
export declare const useAddSkill: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addSkill>>, TError, {
        data: BodyType<SkillInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addSkill>>, TError, {
    data: BodyType<SkillInput>;
}, TContext>;
export declare const getRemoveSkillUrl: (id: number) => string;
/**
 * @summary Remove a skill
 */
export declare const removeSkill: (id: number, options?: RequestInit) => Promise<void>;
export declare const getRemoveSkillMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSkill>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeSkill>>, TError, {
    id: number;
}, TContext>;
export type RemoveSkillMutationResult = NonNullable<Awaited<ReturnType<typeof removeSkill>>>;
export type RemoveSkillMutationError = ErrorType<unknown>;
/**
* @summary Remove a skill
*/
export declare const useRemoveSkill: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSkill>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof removeSkill>>, TError, {
    id: number;
}, TContext>;
export declare const getListMyProjectsUrl: () => string;
/**
 * @summary List my projects
 */
export declare const listMyProjects: (options?: RequestInit) => Promise<Project[]>;
export declare const getListMyProjectsQueryKey: () => readonly ["/api/students/projects"];
export declare const getListMyProjectsQueryOptions: <TData = Awaited<ReturnType<typeof listMyProjects>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyProjects>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMyProjects>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMyProjectsQueryResult = NonNullable<Awaited<ReturnType<typeof listMyProjects>>>;
export type ListMyProjectsQueryError = ErrorType<unknown>;
/**
 * @summary List my projects
 */
export declare function useListMyProjects<TData = Awaited<ReturnType<typeof listMyProjects>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyProjects>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAddProjectUrl: () => string;
/**
 * @summary Add a project
 */
export declare const addProject: (projectInput: ProjectInput, options?: RequestInit) => Promise<Project>;
export declare const getAddProjectMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addProject>>, TError, {
        data: BodyType<ProjectInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addProject>>, TError, {
    data: BodyType<ProjectInput>;
}, TContext>;
export type AddProjectMutationResult = NonNullable<Awaited<ReturnType<typeof addProject>>>;
export type AddProjectMutationBody = BodyType<ProjectInput>;
export type AddProjectMutationError = ErrorType<unknown>;
/**
* @summary Add a project
*/
export declare const useAddProject: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addProject>>, TError, {
        data: BodyType<ProjectInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addProject>>, TError, {
    data: BodyType<ProjectInput>;
}, TContext>;
export declare const getUpdateProjectUrl: (id: number) => string;
/**
 * @summary Update a project
 */
export declare const updateProject: (id: number, projectUpdate: ProjectUpdate, options?: RequestInit) => Promise<Project>;
export declare const getUpdateProjectMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProject>>, TError, {
        id: number;
        data: BodyType<ProjectUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProject>>, TError, {
    id: number;
    data: BodyType<ProjectUpdate>;
}, TContext>;
export type UpdateProjectMutationResult = NonNullable<Awaited<ReturnType<typeof updateProject>>>;
export type UpdateProjectMutationBody = BodyType<ProjectUpdate>;
export type UpdateProjectMutationError = ErrorType<unknown>;
/**
* @summary Update a project
*/
export declare const useUpdateProject: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProject>>, TError, {
        id: number;
        data: BodyType<ProjectUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProject>>, TError, {
    id: number;
    data: BodyType<ProjectUpdate>;
}, TContext>;
export declare const getDeleteProjectUrl: (id: number) => string;
/**
 * @summary Delete a project
 */
export declare const deleteProject: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteProjectMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProject>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteProject>>, TError, {
    id: number;
}, TContext>;
export type DeleteProjectMutationResult = NonNullable<Awaited<ReturnType<typeof deleteProject>>>;
export type DeleteProjectMutationError = ErrorType<unknown>;
/**
* @summary Delete a project
*/
export declare const useDeleteProject: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProject>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteProject>>, TError, {
    id: number;
}, TContext>;
export declare const getListMyInternshipsUrl: () => string;
/**
 * @summary List my internships
 */
export declare const listMyInternships: (options?: RequestInit) => Promise<Internship[]>;
export declare const getListMyInternshipsQueryKey: () => readonly ["/api/students/internships"];
export declare const getListMyInternshipsQueryOptions: <TData = Awaited<ReturnType<typeof listMyInternships>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyInternships>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMyInternships>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMyInternshipsQueryResult = NonNullable<Awaited<ReturnType<typeof listMyInternships>>>;
export type ListMyInternshipsQueryError = ErrorType<unknown>;
/**
 * @summary List my internships
 */
export declare function useListMyInternships<TData = Awaited<ReturnType<typeof listMyInternships>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyInternships>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAddInternshipUrl: () => string;
/**
 * @summary Add an internship
 */
export declare const addInternship: (internshipInput: InternshipInput, options?: RequestInit) => Promise<Internship>;
export declare const getAddInternshipMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addInternship>>, TError, {
        data: BodyType<InternshipInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addInternship>>, TError, {
    data: BodyType<InternshipInput>;
}, TContext>;
export type AddInternshipMutationResult = NonNullable<Awaited<ReturnType<typeof addInternship>>>;
export type AddInternshipMutationBody = BodyType<InternshipInput>;
export type AddInternshipMutationError = ErrorType<unknown>;
/**
* @summary Add an internship
*/
export declare const useAddInternship: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addInternship>>, TError, {
        data: BodyType<InternshipInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addInternship>>, TError, {
    data: BodyType<InternshipInput>;
}, TContext>;
export declare const getUpdateInternshipUrl: (id: number) => string;
/**
 * @summary Update an internship
 */
export declare const updateInternship: (id: number, internshipUpdate: InternshipUpdate, options?: RequestInit) => Promise<Internship>;
export declare const getUpdateInternshipMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInternship>>, TError, {
        id: number;
        data: BodyType<InternshipUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateInternship>>, TError, {
    id: number;
    data: BodyType<InternshipUpdate>;
}, TContext>;
export type UpdateInternshipMutationResult = NonNullable<Awaited<ReturnType<typeof updateInternship>>>;
export type UpdateInternshipMutationBody = BodyType<InternshipUpdate>;
export type UpdateInternshipMutationError = ErrorType<unknown>;
/**
* @summary Update an internship
*/
export declare const useUpdateInternship: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInternship>>, TError, {
        id: number;
        data: BodyType<InternshipUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateInternship>>, TError, {
    id: number;
    data: BodyType<InternshipUpdate>;
}, TContext>;
export declare const getDeleteInternshipUrl: (id: number) => string;
/**
 * @summary Delete an internship
 */
export declare const deleteInternship: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteInternshipMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteInternship>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteInternship>>, TError, {
    id: number;
}, TContext>;
export type DeleteInternshipMutationResult = NonNullable<Awaited<ReturnType<typeof deleteInternship>>>;
export type DeleteInternshipMutationError = ErrorType<unknown>;
/**
* @summary Delete an internship
*/
export declare const useDeleteInternship: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteInternship>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteInternship>>, TError, {
    id: number;
}, TContext>;
export declare const getListMyCertificationsUrl: () => string;
/**
 * @summary List my certifications
 */
export declare const listMyCertifications: (options?: RequestInit) => Promise<Certification[]>;
export declare const getListMyCertificationsQueryKey: () => readonly ["/api/students/certifications"];
export declare const getListMyCertificationsQueryOptions: <TData = Awaited<ReturnType<typeof listMyCertifications>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyCertifications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMyCertifications>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMyCertificationsQueryResult = NonNullable<Awaited<ReturnType<typeof listMyCertifications>>>;
export type ListMyCertificationsQueryError = ErrorType<unknown>;
/**
 * @summary List my certifications
 */
export declare function useListMyCertifications<TData = Awaited<ReturnType<typeof listMyCertifications>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyCertifications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAddCertificationUrl: () => string;
/**
 * @summary Add a certification
 */
export declare const addCertification: (certificationInput: CertificationInput, options?: RequestInit) => Promise<Certification>;
export declare const getAddCertificationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addCertification>>, TError, {
        data: BodyType<CertificationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addCertification>>, TError, {
    data: BodyType<CertificationInput>;
}, TContext>;
export type AddCertificationMutationResult = NonNullable<Awaited<ReturnType<typeof addCertification>>>;
export type AddCertificationMutationBody = BodyType<CertificationInput>;
export type AddCertificationMutationError = ErrorType<unknown>;
/**
* @summary Add a certification
*/
export declare const useAddCertification: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addCertification>>, TError, {
        data: BodyType<CertificationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addCertification>>, TError, {
    data: BodyType<CertificationInput>;
}, TContext>;
export declare const getDeleteCertificationUrl: (id: number) => string;
/**
 * @summary Delete a certification
 */
export declare const deleteCertification: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteCertificationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCertification>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCertification>>, TError, {
    id: number;
}, TContext>;
export type DeleteCertificationMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCertification>>>;
export type DeleteCertificationMutationError = ErrorType<unknown>;
/**
* @summary Delete a certification
*/
export declare const useDeleteCertification: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCertification>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCertification>>, TError, {
    id: number;
}, TContext>;
export declare const getGetMyCodingProfilesUrl: () => string;
/**
 * @summary Get my coding profiles
 */
export declare const getMyCodingProfiles: (options?: RequestInit) => Promise<CodingProfiles>;
export declare const getGetMyCodingProfilesQueryKey: () => readonly ["/api/students/coding-profiles"];
export declare const getGetMyCodingProfilesQueryOptions: <TData = Awaited<ReturnType<typeof getMyCodingProfiles>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyCodingProfiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMyCodingProfiles>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMyCodingProfilesQueryResult = NonNullable<Awaited<ReturnType<typeof getMyCodingProfiles>>>;
export type GetMyCodingProfilesQueryError = ErrorType<unknown>;
/**
 * @summary Get my coding profiles
 */
export declare function useGetMyCodingProfiles<TData = Awaited<ReturnType<typeof getMyCodingProfiles>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyCodingProfiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateCodingProfilesUrl: () => string;
/**
 * @summary Update coding profiles
 */
export declare const updateCodingProfiles: (codingProfilesUpdate: CodingProfilesUpdate, options?: RequestInit) => Promise<CodingProfiles>;
export declare const getUpdateCodingProfilesMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCodingProfiles>>, TError, {
        data: BodyType<CodingProfilesUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCodingProfiles>>, TError, {
    data: BodyType<CodingProfilesUpdate>;
}, TContext>;
export type UpdateCodingProfilesMutationResult = NonNullable<Awaited<ReturnType<typeof updateCodingProfiles>>>;
export type UpdateCodingProfilesMutationBody = BodyType<CodingProfilesUpdate>;
export type UpdateCodingProfilesMutationError = ErrorType<unknown>;
/**
* @summary Update coding profiles
*/
export declare const useUpdateCodingProfiles: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCodingProfiles>>, TError, {
        data: BodyType<CodingProfilesUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCodingProfiles>>, TError, {
    data: BodyType<CodingProfilesUpdate>;
}, TContext>;
export declare const getGetAIAnalysisUrl: () => string;
/**
 * @summary Get latest AI analysis for current student
 */
export declare const getAIAnalysis: (options?: RequestInit) => Promise<AIAnalysis>;
export declare const getGetAIAnalysisQueryKey: () => readonly ["/api/students/ai-analysis"];
export declare const getGetAIAnalysisQueryOptions: <TData = Awaited<ReturnType<typeof getAIAnalysis>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAIAnalysis>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAIAnalysis>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAIAnalysisQueryResult = NonNullable<Awaited<ReturnType<typeof getAIAnalysis>>>;
export type GetAIAnalysisQueryError = ErrorType<unknown>;
/**
 * @summary Get latest AI analysis for current student
 */
export declare function useGetAIAnalysis<TData = Awaited<ReturnType<typeof getAIAnalysis>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAIAnalysis>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getTriggerAIAnalysisUrl: () => string;
/**
 * @summary Trigger fresh AI analysis
 */
export declare const triggerAIAnalysis: (options?: RequestInit) => Promise<AIAnalysis>;
export declare const getTriggerAIAnalysisMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof triggerAIAnalysis>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof triggerAIAnalysis>>, TError, void, TContext>;
export type TriggerAIAnalysisMutationResult = NonNullable<Awaited<ReturnType<typeof triggerAIAnalysis>>>;
export type TriggerAIAnalysisMutationError = ErrorType<unknown>;
/**
* @summary Trigger fresh AI analysis
*/
export declare const useTriggerAIAnalysis: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof triggerAIAnalysis>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof triggerAIAnalysis>>, TError, void, TContext>;
export declare const getGetCompanyEligibilityUrl: () => string;
/**
 * @summary Get eligible companies for current student
 */
export declare const getCompanyEligibility: (options?: RequestInit) => Promise<CompanyEligibility[]>;
export declare const getGetCompanyEligibilityQueryKey: () => readonly ["/api/students/eligibility"];
export declare const getGetCompanyEligibilityQueryOptions: <TData = Awaited<ReturnType<typeof getCompanyEligibility>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCompanyEligibility>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCompanyEligibility>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCompanyEligibilityQueryResult = NonNullable<Awaited<ReturnType<typeof getCompanyEligibility>>>;
export type GetCompanyEligibilityQueryError = ErrorType<unknown>;
/**
 * @summary Get eligible companies for current student
 */
export declare function useGetCompanyEligibility<TData = Awaited<ReturnType<typeof getCompanyEligibility>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCompanyEligibility>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getBuildAIResumeUrl: () => string;
/**
 * @summary Generate an ATS-friendly resume from the student's profile data
 */
export declare const buildAIResume: (options?: RequestInit) => Promise<GeneratedResume>;
export declare const getBuildAIResumeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof buildAIResume>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof buildAIResume>>, TError, void, TContext>;
export type BuildAIResumeMutationResult = NonNullable<Awaited<ReturnType<typeof buildAIResume>>>;
export type BuildAIResumeMutationError = ErrorType<unknown>;
/**
* @summary Generate an ATS-friendly resume from the student's profile data
*/
export declare const useBuildAIResume: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof buildAIResume>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof buildAIResume>>, TError, void, TContext>;
export declare const getListCompaniesUrl: () => string;
/**
 * @summary List all companies
 */
export declare const listCompanies: (options?: RequestInit) => Promise<Company[]>;
export declare const getListCompaniesQueryKey: () => readonly ["/api/companies"];
export declare const getListCompaniesQueryOptions: <TData = Awaited<ReturnType<typeof listCompanies>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCompanies>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCompanies>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCompaniesQueryResult = NonNullable<Awaited<ReturnType<typeof listCompanies>>>;
export type ListCompaniesQueryError = ErrorType<unknown>;
/**
 * @summary List all companies
 */
export declare function useListCompanies<TData = Awaited<ReturnType<typeof listCompanies>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCompanies>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCompanyUrl: () => string;
/**
 * @summary Create a company
 */
export declare const createCompany: (companyInput: CompanyInput, options?: RequestInit) => Promise<Company>;
export declare const getCreateCompanyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCompany>>, TError, {
        data: BodyType<CompanyInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCompany>>, TError, {
    data: BodyType<CompanyInput>;
}, TContext>;
export type CreateCompanyMutationResult = NonNullable<Awaited<ReturnType<typeof createCompany>>>;
export type CreateCompanyMutationBody = BodyType<CompanyInput>;
export type CreateCompanyMutationError = ErrorType<unknown>;
/**
* @summary Create a company
*/
export declare const useCreateCompany: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCompany>>, TError, {
        data: BodyType<CompanyInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCompany>>, TError, {
    data: BodyType<CompanyInput>;
}, TContext>;
export declare const getGetCompanyUrl: (id: number) => string;
/**
 * @summary Get a company
 */
export declare const getCompany: (id: number, options?: RequestInit) => Promise<Company>;
export declare const getGetCompanyQueryKey: (id: number) => readonly [`/api/companies/${number}`];
export declare const getGetCompanyQueryOptions: <TData = Awaited<ReturnType<typeof getCompany>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCompany>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCompany>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCompanyQueryResult = NonNullable<Awaited<ReturnType<typeof getCompany>>>;
export type GetCompanyQueryError = ErrorType<unknown>;
/**
 * @summary Get a company
 */
export declare function useGetCompany<TData = Awaited<ReturnType<typeof getCompany>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCompany>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateCompanyUrl: (id: number) => string;
/**
 * @summary Update a company
 */
export declare const updateCompany: (id: number, companyUpdate: CompanyUpdate, options?: RequestInit) => Promise<Company>;
export declare const getUpdateCompanyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCompany>>, TError, {
        id: number;
        data: BodyType<CompanyUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCompany>>, TError, {
    id: number;
    data: BodyType<CompanyUpdate>;
}, TContext>;
export type UpdateCompanyMutationResult = NonNullable<Awaited<ReturnType<typeof updateCompany>>>;
export type UpdateCompanyMutationBody = BodyType<CompanyUpdate>;
export type UpdateCompanyMutationError = ErrorType<unknown>;
/**
* @summary Update a company
*/
export declare const useUpdateCompany: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCompany>>, TError, {
        id: number;
        data: BodyType<CompanyUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCompany>>, TError, {
    id: number;
    data: BodyType<CompanyUpdate>;
}, TContext>;
export declare const getDeleteCompanyUrl: (id: number) => string;
/**
 * @summary Delete a company
 */
export declare const deleteCompany: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteCompanyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCompany>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCompany>>, TError, {
    id: number;
}, TContext>;
export type DeleteCompanyMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCompany>>>;
export type DeleteCompanyMutationError = ErrorType<unknown>;
/**
* @summary Delete a company
*/
export declare const useDeleteCompany: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCompany>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCompany>>, TError, {
    id: number;
}, TContext>;
export declare const getListJobsUrl: () => string;
/**
 * @summary List all job postings
 */
export declare const listJobs: (options?: RequestInit) => Promise<JobPosting[]>;
export declare const getListJobsQueryKey: () => readonly ["/api/jobs"];
export declare const getListJobsQueryOptions: <TData = Awaited<ReturnType<typeof listJobs>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listJobs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listJobs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListJobsQueryResult = NonNullable<Awaited<ReturnType<typeof listJobs>>>;
export type ListJobsQueryError = ErrorType<unknown>;
/**
 * @summary List all job postings
 */
export declare function useListJobs<TData = Awaited<ReturnType<typeof listJobs>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listJobs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateJobUrl: () => string;
/**
 * @summary Create a job posting
 */
export declare const createJob: (jobPostingInput: JobPostingInput, options?: RequestInit) => Promise<JobPosting>;
export declare const getCreateJobMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createJob>>, TError, {
        data: BodyType<JobPostingInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createJob>>, TError, {
    data: BodyType<JobPostingInput>;
}, TContext>;
export type CreateJobMutationResult = NonNullable<Awaited<ReturnType<typeof createJob>>>;
export type CreateJobMutationBody = BodyType<JobPostingInput>;
export type CreateJobMutationError = ErrorType<unknown>;
/**
* @summary Create a job posting
*/
export declare const useCreateJob: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createJob>>, TError, {
        data: BodyType<JobPostingInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createJob>>, TError, {
    data: BodyType<JobPostingInput>;
}, TContext>;
export declare const getUpdateJobUrl: (id: number) => string;
/**
 * @summary Update a job posting
 */
export declare const updateJob: (id: number, jobPostingUpdate: JobPostingUpdate, options?: RequestInit) => Promise<JobPosting>;
export declare const getUpdateJobMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateJob>>, TError, {
        id: number;
        data: BodyType<JobPostingUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateJob>>, TError, {
    id: number;
    data: BodyType<JobPostingUpdate>;
}, TContext>;
export type UpdateJobMutationResult = NonNullable<Awaited<ReturnType<typeof updateJob>>>;
export type UpdateJobMutationBody = BodyType<JobPostingUpdate>;
export type UpdateJobMutationError = ErrorType<unknown>;
/**
* @summary Update a job posting
*/
export declare const useUpdateJob: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateJob>>, TError, {
        id: number;
        data: BodyType<JobPostingUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateJob>>, TError, {
    id: number;
    data: BodyType<JobPostingUpdate>;
}, TContext>;
export declare const getDeleteJobUrl: (id: number) => string;
/**
 * @summary Delete a job posting
 */
export declare const deleteJob: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteJobMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteJob>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteJob>>, TError, {
    id: number;
}, TContext>;
export type DeleteJobMutationResult = NonNullable<Awaited<ReturnType<typeof deleteJob>>>;
export type DeleteJobMutationError = ErrorType<unknown>;
/**
* @summary Delete a job posting
*/
export declare const useDeleteJob: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteJob>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteJob>>, TError, {
    id: number;
}, TContext>;
export declare const getApplyToJobUrl: (id: number) => string;
/**
 * @summary Apply to a job
 */
export declare const applyToJob: (id: number, options?: RequestInit) => Promise<JobApplication>;
export declare const getApplyToJobMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof applyToJob>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof applyToJob>>, TError, {
    id: number;
}, TContext>;
export type ApplyToJobMutationResult = NonNullable<Awaited<ReturnType<typeof applyToJob>>>;
export type ApplyToJobMutationError = ErrorType<unknown>;
/**
* @summary Apply to a job
*/
export declare const useApplyToJob: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof applyToJob>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof applyToJob>>, TError, {
    id: number;
}, TContext>;
export declare const getListInterviewsUrl: () => string;
/**
 * @summary List interviews
 */
export declare const listInterviews: (options?: RequestInit) => Promise<Interview[]>;
export declare const getListInterviewsQueryKey: () => readonly ["/api/interviews"];
export declare const getListInterviewsQueryOptions: <TData = Awaited<ReturnType<typeof listInterviews>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInterviews>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listInterviews>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListInterviewsQueryResult = NonNullable<Awaited<ReturnType<typeof listInterviews>>>;
export type ListInterviewsQueryError = ErrorType<unknown>;
/**
 * @summary List interviews
 */
export declare function useListInterviews<TData = Awaited<ReturnType<typeof listInterviews>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listInterviews>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getScheduleInterviewUrl: () => string;
/**
 * @summary Schedule an interview
 */
export declare const scheduleInterview: (interviewInput: InterviewInput, options?: RequestInit) => Promise<Interview>;
export declare const getScheduleInterviewMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof scheduleInterview>>, TError, {
        data: BodyType<InterviewInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof scheduleInterview>>, TError, {
    data: BodyType<InterviewInput>;
}, TContext>;
export type ScheduleInterviewMutationResult = NonNullable<Awaited<ReturnType<typeof scheduleInterview>>>;
export type ScheduleInterviewMutationBody = BodyType<InterviewInput>;
export type ScheduleInterviewMutationError = ErrorType<unknown>;
/**
* @summary Schedule an interview
*/
export declare const useScheduleInterview: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof scheduleInterview>>, TError, {
        data: BodyType<InterviewInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof scheduleInterview>>, TError, {
    data: BodyType<InterviewInput>;
}, TContext>;
export declare const getUpdateInterviewUrl: (id: number) => string;
/**
 * @summary Update interview status
 */
export declare const updateInterview: (id: number, interviewUpdate: InterviewUpdate, options?: RequestInit) => Promise<Interview>;
export declare const getUpdateInterviewMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInterview>>, TError, {
        id: number;
        data: BodyType<InterviewUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateInterview>>, TError, {
    id: number;
    data: BodyType<InterviewUpdate>;
}, TContext>;
export type UpdateInterviewMutationResult = NonNullable<Awaited<ReturnType<typeof updateInterview>>>;
export type UpdateInterviewMutationBody = BodyType<InterviewUpdate>;
export type UpdateInterviewMutationError = ErrorType<unknown>;
/**
* @summary Update interview status
*/
export declare const useUpdateInterview: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateInterview>>, TError, {
        id: number;
        data: BodyType<InterviewUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateInterview>>, TError, {
    id: number;
    data: BodyType<InterviewUpdate>;
}, TContext>;
export declare const getListNotificationsUrl: () => string;
/**
 * @summary List my notifications
 */
export declare const listNotifications: (options?: RequestInit) => Promise<Notification[]>;
export declare const getListNotificationsQueryKey: () => readonly ["/api/notifications"];
export declare const getListNotificationsQueryOptions: <TData = Awaited<ReturnType<typeof listNotifications>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listNotifications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listNotifications>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListNotificationsQueryResult = NonNullable<Awaited<ReturnType<typeof listNotifications>>>;
export type ListNotificationsQueryError = ErrorType<unknown>;
/**
 * @summary List my notifications
 */
export declare function useListNotifications<TData = Awaited<ReturnType<typeof listNotifications>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listNotifications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getMarkNotificationReadUrl: (id: number) => string;
/**
 * @summary Mark notification as read
 */
export declare const markNotificationRead: (id: number, options?: RequestInit) => Promise<Notification>;
export declare const getMarkNotificationReadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
    id: number;
}, TContext>;
export type MarkNotificationReadMutationResult = NonNullable<Awaited<ReturnType<typeof markNotificationRead>>>;
export type MarkNotificationReadMutationError = ErrorType<unknown>;
/**
* @summary Mark notification as read
*/
export declare const useMarkNotificationRead: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
    id: number;
}, TContext>;
export declare const getMarkAllNotificationsReadUrl: () => string;
/**
 * @summary Mark all notifications as read
 */
export declare const markAllNotificationsRead: (options?: RequestInit) => Promise<void>;
export declare const getMarkAllNotificationsReadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markAllNotificationsRead>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof markAllNotificationsRead>>, TError, void, TContext>;
export type MarkAllNotificationsReadMutationResult = NonNullable<Awaited<ReturnType<typeof markAllNotificationsRead>>>;
export type MarkAllNotificationsReadMutationError = ErrorType<unknown>;
/**
* @summary Mark all notifications as read
*/
export declare const useMarkAllNotificationsRead: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markAllNotificationsRead>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof markAllNotificationsRead>>, TError, void, TContext>;
export declare const getGetOfficerDashboardUrl: () => string;
/**
 * @summary Placement officer dashboard stats
 */
export declare const getOfficerDashboard: (options?: RequestInit) => Promise<OfficerDashboard>;
export declare const getGetOfficerDashboardQueryKey: () => readonly ["/api/analytics/dashboard"];
export declare const getGetOfficerDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getOfficerDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOfficerDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOfficerDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOfficerDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getOfficerDashboard>>>;
export type GetOfficerDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Placement officer dashboard stats
 */
export declare function useGetOfficerDashboard<TData = Awaited<ReturnType<typeof getOfficerDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOfficerDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetPlacementStatsUrl: () => string;
/**
 * @summary Placement statistics (batch-wise, dept-wise)
 */
export declare const getPlacementStats: (options?: RequestInit) => Promise<PlacementStats>;
export declare const getGetPlacementStatsQueryKey: () => readonly ["/api/analytics/placement-stats"];
export declare const getGetPlacementStatsQueryOptions: <TData = Awaited<ReturnType<typeof getPlacementStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlacementStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPlacementStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPlacementStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getPlacementStats>>>;
export type GetPlacementStatsQueryError = ErrorType<unknown>;
/**
 * @summary Placement statistics (batch-wise, dept-wise)
 */
export declare function useGetPlacementStats<TData = Awaited<ReturnType<typeof getPlacementStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlacementStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetSkillGapSummaryUrl: () => string;
/**
 * @summary Aggregated skill gap across all students
 */
export declare const getSkillGapSummary: (options?: RequestInit) => Promise<SkillGapItem[]>;
export declare const getGetSkillGapSummaryQueryKey: () => readonly ["/api/analytics/skill-gaps"];
export declare const getGetSkillGapSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getSkillGapSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSkillGapSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSkillGapSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSkillGapSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getSkillGapSummary>>>;
export type GetSkillGapSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Aggregated skill gap across all students
 */
export declare function useGetSkillGapSummary<TData = Awaited<ReturnType<typeof getSkillGapSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSkillGapSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListAllStudentsUrl: () => string;
/**
 * @summary List all students (officer view)
 */
export declare const listAllStudents: (options?: RequestInit) => Promise<StudentSummary[]>;
export declare const getListAllStudentsQueryKey: () => readonly ["/api/officer/students"];
export declare const getListAllStudentsQueryOptions: <TData = Awaited<ReturnType<typeof listAllStudents>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAllStudents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAllStudents>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAllStudentsQueryResult = NonNullable<Awaited<ReturnType<typeof listAllStudents>>>;
export type ListAllStudentsQueryError = ErrorType<unknown>;
/**
 * @summary List all students (officer view)
 */
export declare function useListAllStudents<TData = Awaited<ReturnType<typeof listAllStudents>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAllStudents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetStudentByIdUrl: (id: number) => string;
/**
 * @summary Get full student detail (officer view)
 */
export declare const getStudentById: (id: number, options?: RequestInit) => Promise<StudentDetail>;
export declare const getGetStudentByIdQueryKey: (id: number) => readonly [`/api/officer/students/${number}`];
export declare const getGetStudentByIdQueryOptions: <TData = Awaited<ReturnType<typeof getStudentById>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudentById>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStudentById>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStudentByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getStudentById>>>;
export type GetStudentByIdQueryError = ErrorType<unknown>;
/**
 * @summary Get full student detail (officer view)
 */
export declare function useGetStudentById<TData = Awaited<ReturnType<typeof getStudentById>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudentById>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAdminListUsersUrl: () => string;
/**
 * @summary List all users
 */
export declare const adminListUsers: (options?: RequestInit) => Promise<User[]>;
export declare const getAdminListUsersQueryKey: () => readonly ["/api/admin/users"];
export declare const getAdminListUsersQueryOptions: <TData = Awaited<ReturnType<typeof adminListUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminListUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof adminListUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type AdminListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof adminListUsers>>>;
export type AdminListUsersQueryError = ErrorType<unknown>;
/**
 * @summary List all users
 */
export declare function useAdminListUsers<TData = Awaited<ReturnType<typeof adminListUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminListUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAdminCreateUserUrl: () => string;
/**
 * @summary Create user
 */
export declare const adminCreateUser: (registerInput: RegisterInput, options?: RequestInit) => Promise<User>;
export declare const getAdminCreateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminCreateUser>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminCreateUser>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
export type AdminCreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof adminCreateUser>>>;
export type AdminCreateUserMutationBody = BodyType<RegisterInput>;
export type AdminCreateUserMutationError = ErrorType<unknown>;
/**
* @summary Create user
*/
export declare const useAdminCreateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminCreateUser>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminCreateUser>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
export declare const getAdminUpdateUserUrl: (id: number) => string;
/**
 * @summary Update user role / status
 */
export declare const adminUpdateUser: (id: number, userUpdate: UserUpdate, options?: RequestInit) => Promise<User>;
export declare const getAdminUpdateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminUpdateUser>>, TError, {
        id: number;
        data: BodyType<UserUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminUpdateUser>>, TError, {
    id: number;
    data: BodyType<UserUpdate>;
}, TContext>;
export type AdminUpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof adminUpdateUser>>>;
export type AdminUpdateUserMutationBody = BodyType<UserUpdate>;
export type AdminUpdateUserMutationError = ErrorType<unknown>;
/**
* @summary Update user role / status
*/
export declare const useAdminUpdateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminUpdateUser>>, TError, {
        id: number;
        data: BodyType<UserUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminUpdateUser>>, TError, {
    id: number;
    data: BodyType<UserUpdate>;
}, TContext>;
export declare const getAdminDeleteUserUrl: (id: number) => string;
/**
 * @summary Delete user
 */
export declare const adminDeleteUser: (id: number, options?: RequestInit) => Promise<void>;
export declare const getAdminDeleteUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminDeleteUser>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminDeleteUser>>, TError, {
    id: number;
}, TContext>;
export type AdminDeleteUserMutationResult = NonNullable<Awaited<ReturnType<typeof adminDeleteUser>>>;
export type AdminDeleteUserMutationError = ErrorType<unknown>;
/**
* @summary Delete user
*/
export declare const useAdminDeleteUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminDeleteUser>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminDeleteUser>>, TError, {
    id: number;
}, TContext>;
export declare const getListDepartmentsUrl: () => string;
/**
 * @summary List departments
 */
export declare const listDepartments: (options?: RequestInit) => Promise<Department[]>;
export declare const getListDepartmentsQueryKey: () => readonly ["/api/admin/departments"];
export declare const getListDepartmentsQueryOptions: <TData = Awaited<ReturnType<typeof listDepartments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listDepartments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listDepartments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListDepartmentsQueryResult = NonNullable<Awaited<ReturnType<typeof listDepartments>>>;
export type ListDepartmentsQueryError = ErrorType<unknown>;
/**
 * @summary List departments
 */
export declare function useListDepartments<TData = Awaited<ReturnType<typeof listDepartments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listDepartments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateDepartmentUrl: () => string;
/**
 * @summary Create department
 */
export declare const createDepartment: (departmentInput: DepartmentInput, options?: RequestInit) => Promise<Department>;
export declare const getCreateDepartmentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDepartment>>, TError, {
        data: BodyType<DepartmentInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createDepartment>>, TError, {
    data: BodyType<DepartmentInput>;
}, TContext>;
export type CreateDepartmentMutationResult = NonNullable<Awaited<ReturnType<typeof createDepartment>>>;
export type CreateDepartmentMutationBody = BodyType<DepartmentInput>;
export type CreateDepartmentMutationError = ErrorType<unknown>;
/**
* @summary Create department
*/
export declare const useCreateDepartment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDepartment>>, TError, {
        data: BodyType<DepartmentInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createDepartment>>, TError, {
    data: BodyType<DepartmentInput>;
}, TContext>;
export declare const getUpdateDepartmentUrl: (id: number) => string;
/**
 * @summary Update department
 */
export declare const updateDepartment: (id: number, departmentUpdate: DepartmentUpdate, options?: RequestInit) => Promise<Department>;
export declare const getUpdateDepartmentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateDepartment>>, TError, {
        id: number;
        data: BodyType<DepartmentUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateDepartment>>, TError, {
    id: number;
    data: BodyType<DepartmentUpdate>;
}, TContext>;
export type UpdateDepartmentMutationResult = NonNullable<Awaited<ReturnType<typeof updateDepartment>>>;
export type UpdateDepartmentMutationBody = BodyType<DepartmentUpdate>;
export type UpdateDepartmentMutationError = ErrorType<unknown>;
/**
* @summary Update department
*/
export declare const useUpdateDepartment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateDepartment>>, TError, {
        id: number;
        data: BodyType<DepartmentUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateDepartment>>, TError, {
    id: number;
    data: BodyType<DepartmentUpdate>;
}, TContext>;
export declare const getAdminDeleteDepartmentUrl: (id: number) => string;
/**
 * @summary Delete department
 */
export declare const adminDeleteDepartment: (id: number, options?: RequestInit) => Promise<void>;
export declare const getAdminDeleteDepartmentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminDeleteDepartment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminDeleteDepartment>>, TError, {
    id: number;
}, TContext>;
export type AdminDeleteDepartmentMutationResult = NonNullable<Awaited<ReturnType<typeof adminDeleteDepartment>>>;
export type AdminDeleteDepartmentMutationError = ErrorType<unknown>;
/**
* @summary Delete department
*/
export declare const useAdminDeleteDepartment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminDeleteDepartment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminDeleteDepartment>>, TError, {
    id: number;
}, TContext>;
export declare const getGetAdminDashboardUrl: () => string;
/**
 * @summary Admin system overview
 */
export declare const getAdminDashboard: (options?: RequestInit) => Promise<AdminDashboard>;
export declare const getGetAdminDashboardQueryKey: () => readonly ["/api/admin/dashboard"];
export declare const getGetAdminDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminDashboard>>>;
export type GetAdminDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Admin system overview
 */
export declare function useGetAdminDashboard<TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map