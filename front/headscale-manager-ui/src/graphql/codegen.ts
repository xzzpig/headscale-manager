import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** 路由 */
export type Route = HasId & {
  __typename?: 'Route';
  id?: Maybe<Scalars['ID']>;
  /** 地址 */
  name?: Maybe<Scalars['String']>;
  /** 描述 */
  description?: Maybe<Scalars['String']>;
  /** 项目 */
  project?: Maybe<Project>;
  projectID?: Maybe<Scalars['ID']>;
};

/** 项目 */
export type Project = HasId & {
  __typename?: 'Project';
  id?: Maybe<Scalars['ID']>;
  /** 项目编码 */
  code?: Maybe<Scalars['String']>;
  /** 项目名称 */
  name?: Maybe<Scalars['String']>;
  /** 当前机器 */
  machine?: Maybe<Machine>;
  /** 可用机器 */
  machines?: Maybe<Array<Maybe<Machine>>>;
  /** 当前机器ID */
  machineID?: Maybe<Scalars['ID']>;
  /** 可用机器ID */
  machineIDs?: Maybe<Array<Maybe<Scalars['ID']>>>;
  routes?: Maybe<Array<Maybe<Route>>>;
};

/** 机器 */
export type Machine = HasId & {
  __typename?: 'Machine';
  id?: Maybe<Scalars['ID']>;
  /** 名称 */
  name?: Maybe<Scalars['String']>;
};

/** 项目路由同步结果 */
export type SyncResult = {
  __typename?: 'SyncResult';
  projectID: Scalars['ID'];
  project?: Maybe<Project>;
  routeID: Scalars['ID'];
  route?: Maybe<Route>;
  machineID: Scalars['ID'];
  machine?: Maybe<Machine>;
  /** 路由是否启用 */
  routeEnable: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  projects?: Maybe<Array<Maybe<Project>>>;
  machines?: Maybe<Array<Maybe<Machine>>>;
  routes?: Maybe<Array<Maybe<Route>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  project?: Maybe<ProjectMutation>;
  route?: Maybe<RouteMutation>;
  machine?: Maybe<MachineMutation>;
};

export type ProjectMutation = {
  __typename?: 'ProjectMutation';
  saveProject?: Maybe<Project>;
  deleteProject: Scalars['Int'];
  syncProjectRoute?: Maybe<Array<SyncResult>>;
};


export type ProjectMutationSaveProjectArgs = {
  projectInput?: InputMaybe<ProjectInput>;
};


export type ProjectMutationDeleteProjectArgs = {
  id: Scalars['ID'];
};


export type ProjectMutationSyncProjectRouteArgs = {
  projectID?: InputMaybe<Scalars['ID']>;
};

export type RouteMutation = {
  __typename?: 'RouteMutation';
  saveRoute?: Maybe<Route>;
  deleteRoute: Scalars['Int'];
};


export type RouteMutationSaveRouteArgs = {
  routeInput?: InputMaybe<RouteInput>;
};


export type RouteMutationDeleteRouteArgs = {
  id: Scalars['ID'];
};

export type MachineMutation = {
  __typename?: 'MachineMutation';
  saveMachine?: Maybe<Machine>;
  deleteMachine: Scalars['Int'];
};


export type MachineMutationSaveMachineArgs = {
  machineInput?: InputMaybe<MachineInput>;
};


export type MachineMutationDeleteMachineArgs = {
  id: Scalars['ID'];
};

export type ProjectInput = {
  id?: InputMaybe<Scalars['ID']>;
  code?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  machineID?: InputMaybe<Scalars['ID']>;
  machineIDs?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type RouteInput = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  projectID?: InputMaybe<Scalars['ID']>;
};

export type MachineInput = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type HasId = {
  id?: Maybe<Scalars['ID']>;
};

export type SaveProjectMutationVariables = Exact<{
  projectInput?: InputMaybe<ProjectInput>;
}>;


export type SaveProjectMutation = { __typename?: 'Mutation', project?: { __typename?: 'ProjectMutation', saveProject?: { __typename?: 'Project', id?: string | null } | null } | null };

export type DeleteProjectMutationVariables = Exact<{
  projectID: Scalars['ID'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', project?: { __typename?: 'ProjectMutation', deleteProject: number } | null };

export type SyncProjectRouteMutationVariables = Exact<{
  syncProjectID?: InputMaybe<Scalars['ID']>;
}>;


export type SyncProjectRouteMutation = { __typename?: 'Mutation', project?: { __typename?: 'ProjectMutation', syncProjectRoute?: Array<{ __typename?: 'SyncResult', routeEnable: boolean, project?: { __typename?: 'Project', name?: string | null } | null, machine?: { __typename?: 'Machine', name?: string | null } | null, route?: { __typename?: 'Route', name?: string | null } | null }> | null } | null };

export type ProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProjectsQuery = { __typename?: 'Query', projects?: Array<{ __typename?: 'Project', id?: string | null, name?: string | null, code?: string | null, machineID?: string | null, machineIDs?: Array<string | null> | null, routes?: Array<{ __typename?: 'Route', id?: string | null, name?: string | null } | null> | null, machine?: { __typename?: 'Machine', id?: string | null, name?: string | null } | null, machines?: Array<{ __typename?: 'Machine', id?: string | null, name?: string | null } | null> | null } | null> | null };

export type SaveRouteMutationVariables = Exact<{
  routeInput?: InputMaybe<RouteInput>;
}>;


export type SaveRouteMutation = { __typename?: 'Mutation', route?: { __typename?: 'RouteMutation', saveRoute?: { __typename?: 'Route', id?: string | null, name?: string | null, description?: string | null, projectID?: string | null, project?: { __typename?: 'Project', id?: string | null, name?: string | null } | null } | null } | null };

export type DeleteRouteMutationVariables = Exact<{
  routeID: Scalars['ID'];
}>;


export type DeleteRouteMutation = { __typename?: 'Mutation', route?: { __typename?: 'RouteMutation', deleteRoute: number } | null };

export type RoutesQueryVariables = Exact<{ [key: string]: never; }>;


export type RoutesQuery = { __typename?: 'Query', routes?: Array<{ __typename?: 'Route', id?: string | null, name?: string | null, description?: string | null, projectID?: string | null, project?: { __typename?: 'Project', id?: string | null, name?: string | null } | null } | null> | null };

export type SaveMachineMutationVariables = Exact<{
  machineInput?: InputMaybe<MachineInput>;
}>;


export type SaveMachineMutation = { __typename?: 'Mutation', machine?: { __typename?: 'MachineMutation', saveMachine?: { __typename?: 'Machine', id?: string | null, name?: string | null } | null } | null };

export type DeleteMachineMutationVariables = Exact<{
  machineID: Scalars['ID'];
}>;


export type DeleteMachineMutation = { __typename?: 'Mutation', machine?: { __typename?: 'MachineMutation', deleteMachine: number } | null };

export type MachinesQueryVariables = Exact<{ [key: string]: never; }>;


export type MachinesQuery = { __typename?: 'Query', machines?: Array<{ __typename?: 'Machine', id?: string | null, name?: string | null } | null> | null };


export const SaveProjectDocument = gql`
    mutation saveProject($projectInput: ProjectInput) {
  project {
    saveProject(projectInput: $projectInput) {
      id
    }
  }
}
    `;
export type SaveProjectMutationFn = Apollo.MutationFunction<SaveProjectMutation, SaveProjectMutationVariables>;

/**
 * __useSaveProjectMutation__
 *
 * To run a mutation, you first call `useSaveProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveProjectMutation, { data, loading, error }] = useSaveProjectMutation({
 *   variables: {
 *      projectInput: // value for 'projectInput'
 *   },
 * });
 */
export function useSaveProjectMutation(baseOptions?: Apollo.MutationHookOptions<SaveProjectMutation, SaveProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveProjectMutation, SaveProjectMutationVariables>(SaveProjectDocument, options);
      }
export type SaveProjectMutationHookResult = ReturnType<typeof useSaveProjectMutation>;
export type SaveProjectMutationResult = Apollo.MutationResult<SaveProjectMutation>;
export type SaveProjectMutationOptions = Apollo.BaseMutationOptions<SaveProjectMutation, SaveProjectMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation deleteProject($projectID: ID!) {
  project {
    deleteProject(id: $projectID)
  }
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      projectID: // value for 'projectID'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const SyncProjectRouteDocument = gql`
    mutation syncProjectRoute($syncProjectID: ID) {
  project {
    syncProjectRoute(projectID: $syncProjectID) {
      project {
        name
      }
      machine {
        name
      }
      route {
        name
      }
      routeEnable
    }
  }
}
    `;
export type SyncProjectRouteMutationFn = Apollo.MutationFunction<SyncProjectRouteMutation, SyncProjectRouteMutationVariables>;

/**
 * __useSyncProjectRouteMutation__
 *
 * To run a mutation, you first call `useSyncProjectRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncProjectRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncProjectRouteMutation, { data, loading, error }] = useSyncProjectRouteMutation({
 *   variables: {
 *      syncProjectID: // value for 'syncProjectID'
 *   },
 * });
 */
export function useSyncProjectRouteMutation(baseOptions?: Apollo.MutationHookOptions<SyncProjectRouteMutation, SyncProjectRouteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SyncProjectRouteMutation, SyncProjectRouteMutationVariables>(SyncProjectRouteDocument, options);
      }
export type SyncProjectRouteMutationHookResult = ReturnType<typeof useSyncProjectRouteMutation>;
export type SyncProjectRouteMutationResult = Apollo.MutationResult<SyncProjectRouteMutation>;
export type SyncProjectRouteMutationOptions = Apollo.BaseMutationOptions<SyncProjectRouteMutation, SyncProjectRouteMutationVariables>;
export const ProjectsDocument = gql`
    query projects {
  projects {
    id
    name
    code
    routes {
      id
      name
    }
    machineID
    machine {
      id
      name
    }
    machineIDs
    machines {
      id
      name
    }
  }
}
    `;

/**
 * __useProjectsQuery__
 *
 * To run a query within a React component, call `useProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useProjectsQuery(baseOptions?: Apollo.QueryHookOptions<ProjectsQuery, ProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, options);
      }
export function useProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectsQuery, ProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, options);
        }
export type ProjectsQueryHookResult = ReturnType<typeof useProjectsQuery>;
export type ProjectsLazyQueryHookResult = ReturnType<typeof useProjectsLazyQuery>;
export type ProjectsQueryResult = Apollo.QueryResult<ProjectsQuery, ProjectsQueryVariables>;
export const SaveRouteDocument = gql`
    mutation saveRoute($routeInput: RouteInput) {
  route {
    saveRoute(routeInput: $routeInput) {
      id
      name
      description
      projectID
      project {
        id
        name
      }
    }
  }
}
    `;
export type SaveRouteMutationFn = Apollo.MutationFunction<SaveRouteMutation, SaveRouteMutationVariables>;

/**
 * __useSaveRouteMutation__
 *
 * To run a mutation, you first call `useSaveRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveRouteMutation, { data, loading, error }] = useSaveRouteMutation({
 *   variables: {
 *      routeInput: // value for 'routeInput'
 *   },
 * });
 */
export function useSaveRouteMutation(baseOptions?: Apollo.MutationHookOptions<SaveRouteMutation, SaveRouteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveRouteMutation, SaveRouteMutationVariables>(SaveRouteDocument, options);
      }
export type SaveRouteMutationHookResult = ReturnType<typeof useSaveRouteMutation>;
export type SaveRouteMutationResult = Apollo.MutationResult<SaveRouteMutation>;
export type SaveRouteMutationOptions = Apollo.BaseMutationOptions<SaveRouteMutation, SaveRouteMutationVariables>;
export const DeleteRouteDocument = gql`
    mutation deleteRoute($routeID: ID!) {
  route {
    deleteRoute(id: $routeID)
  }
}
    `;
export type DeleteRouteMutationFn = Apollo.MutationFunction<DeleteRouteMutation, DeleteRouteMutationVariables>;

/**
 * __useDeleteRouteMutation__
 *
 * To run a mutation, you first call `useDeleteRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRouteMutation, { data, loading, error }] = useDeleteRouteMutation({
 *   variables: {
 *      routeID: // value for 'routeID'
 *   },
 * });
 */
export function useDeleteRouteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRouteMutation, DeleteRouteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRouteMutation, DeleteRouteMutationVariables>(DeleteRouteDocument, options);
      }
export type DeleteRouteMutationHookResult = ReturnType<typeof useDeleteRouteMutation>;
export type DeleteRouteMutationResult = Apollo.MutationResult<DeleteRouteMutation>;
export type DeleteRouteMutationOptions = Apollo.BaseMutationOptions<DeleteRouteMutation, DeleteRouteMutationVariables>;
export const RoutesDocument = gql`
    query routes {
  routes {
    id
    name
    description
    projectID
    project {
      id
      name
    }
  }
}
    `;

/**
 * __useRoutesQuery__
 *
 * To run a query within a React component, call `useRoutesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoutesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoutesQuery({
 *   variables: {
 *   },
 * });
 */
export function useRoutesQuery(baseOptions?: Apollo.QueryHookOptions<RoutesQuery, RoutesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RoutesQuery, RoutesQueryVariables>(RoutesDocument, options);
      }
export function useRoutesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RoutesQuery, RoutesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RoutesQuery, RoutesQueryVariables>(RoutesDocument, options);
        }
export type RoutesQueryHookResult = ReturnType<typeof useRoutesQuery>;
export type RoutesLazyQueryHookResult = ReturnType<typeof useRoutesLazyQuery>;
export type RoutesQueryResult = Apollo.QueryResult<RoutesQuery, RoutesQueryVariables>;
export const SaveMachineDocument = gql`
    mutation saveMachine($machineInput: MachineInput) {
  machine {
    saveMachine(machineInput: $machineInput) {
      id
      name
    }
  }
}
    `;
export type SaveMachineMutationFn = Apollo.MutationFunction<SaveMachineMutation, SaveMachineMutationVariables>;

/**
 * __useSaveMachineMutation__
 *
 * To run a mutation, you first call `useSaveMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveMachineMutation, { data, loading, error }] = useSaveMachineMutation({
 *   variables: {
 *      machineInput: // value for 'machineInput'
 *   },
 * });
 */
export function useSaveMachineMutation(baseOptions?: Apollo.MutationHookOptions<SaveMachineMutation, SaveMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveMachineMutation, SaveMachineMutationVariables>(SaveMachineDocument, options);
      }
export type SaveMachineMutationHookResult = ReturnType<typeof useSaveMachineMutation>;
export type SaveMachineMutationResult = Apollo.MutationResult<SaveMachineMutation>;
export type SaveMachineMutationOptions = Apollo.BaseMutationOptions<SaveMachineMutation, SaveMachineMutationVariables>;
export const DeleteMachineDocument = gql`
    mutation deleteMachine($machineID: ID!) {
  machine {
    deleteMachine(id: $machineID)
  }
}
    `;
export type DeleteMachineMutationFn = Apollo.MutationFunction<DeleteMachineMutation, DeleteMachineMutationVariables>;

/**
 * __useDeleteMachineMutation__
 *
 * To run a mutation, you first call `useDeleteMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMachineMutation, { data, loading, error }] = useDeleteMachineMutation({
 *   variables: {
 *      machineID: // value for 'machineID'
 *   },
 * });
 */
export function useDeleteMachineMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMachineMutation, DeleteMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMachineMutation, DeleteMachineMutationVariables>(DeleteMachineDocument, options);
      }
export type DeleteMachineMutationHookResult = ReturnType<typeof useDeleteMachineMutation>;
export type DeleteMachineMutationResult = Apollo.MutationResult<DeleteMachineMutation>;
export type DeleteMachineMutationOptions = Apollo.BaseMutationOptions<DeleteMachineMutation, DeleteMachineMutationVariables>;
export const MachinesDocument = gql`
    query machines {
  machines {
    id
    name
  }
}
    `;

/**
 * __useMachinesQuery__
 *
 * To run a query within a React component, call `useMachinesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMachinesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMachinesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMachinesQuery(baseOptions?: Apollo.QueryHookOptions<MachinesQuery, MachinesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MachinesQuery, MachinesQueryVariables>(MachinesDocument, options);
      }
export function useMachinesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MachinesQuery, MachinesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MachinesQuery, MachinesQueryVariables>(MachinesDocument, options);
        }
export type MachinesQueryHookResult = ReturnType<typeof useMachinesQuery>;
export type MachinesLazyQueryHookResult = ReturnType<typeof useMachinesLazyQuery>;
export type MachinesQueryResult = Apollo.QueryResult<MachinesQuery, MachinesQueryVariables>;