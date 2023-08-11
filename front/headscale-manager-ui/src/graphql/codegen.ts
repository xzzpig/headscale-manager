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

/** Headscale Machine */
export type HMachine = {
  __typename?: 'HMachine';
  forcedTags: Array<Scalars['String']>;
  givenName: Scalars['String'];
  id: Scalars['Int'];
  ipAddresses: Array<Scalars['String']>;
  lastSeen?: Maybe<Timestamp>;
  name: Scalars['String'];
  online: Scalars['Boolean'];
  routes: Array<HRoute>;
  user?: Maybe<HUser>;
};

export type HMachineMutation = {
  __typename?: 'HMachineMutation';
  deleteMachine: Scalars['Boolean'];
  moveMachine: HMachine;
  renameMachine: HMachine;
  setMachineTags: HMachine;
};


export type HMachineMutationDeleteMachineArgs = {
  machineId: Scalars['Int'];
};


export type HMachineMutationMoveMachineArgs = {
  machineId: Scalars['Int'];
  userName: Scalars['String'];
};


export type HMachineMutationRenameMachineArgs = {
  machineId: Scalars['Int'];
  name: Scalars['String'];
};


export type HMachineMutationSetMachineTagsArgs = {
  machineId: Scalars['Int'];
  tags: Array<Scalars['String']>;
};

export type HRoute = {
  __typename?: 'HRoute';
  advertised: Scalars['Boolean'];
  createdAt?: Maybe<Timestamp>;
  deletedAt?: Maybe<Timestamp>;
  enabled: Scalars['Boolean'];
  id: Scalars['Int'];
  isPrimary: Scalars['Boolean'];
  machine?: Maybe<HMachine>;
  prefix: Scalars['String'];
  updatedAt?: Maybe<Timestamp>;
};

export type HRouteMutation = {
  __typename?: 'HRouteMutation';
  deleteRoute: Scalars['Boolean'];
  enableRoute: Scalars['Boolean'];
};


export type HRouteMutationDeleteRouteArgs = {
  routeId: Scalars['Int'];
};


export type HRouteMutationEnableRouteArgs = {
  enable: Scalars['Boolean'];
  routeId: Scalars['Int'];
};

/** Headscale User */
export type HUser = {
  __typename?: 'HUser';
  createdAt?: Maybe<Timestamp>;
  id: Scalars['String'];
  name: Scalars['String'];
};

export type HUserMutation = {
  __typename?: 'HUserMutation';
  createUser: HUser;
  deleteUser: Scalars['Boolean'];
  renameUser: HUser;
};


export type HUserMutationCreateUserArgs = {
  name: Scalars['String'];
};


export type HUserMutationDeleteUserArgs = {
  name: Scalars['String'];
};


export type HUserMutationRenameUserArgs = {
  newName: Scalars['String'];
  oldName: Scalars['String'];
};

export type HasId = {
  id?: Maybe<Scalars['ID']>;
};

export type HeadscaleMutation = {
  __typename?: 'HeadscaleMutation';
  machine?: Maybe<HMachineMutation>;
  route?: Maybe<HRouteMutation>;
  user?: Maybe<HUserMutation>;
};

export type HeadscaleQuery = {
  __typename?: 'HeadscaleQuery';
  machine?: Maybe<HMachine>;
  machines: Array<HMachine>;
  users: Array<HUser>;
};


export type HeadscaleQueryMachineArgs = {
  machineId: Scalars['Int'];
};

/** 机器 */
export type Machine = HasId & {
  __typename?: 'Machine';
  id?: Maybe<Scalars['ID']>;
  /** 名称 */
  name?: Maybe<Scalars['String']>;
};

export type MachineInput = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type MachineMutation = {
  __typename?: 'MachineMutation';
  deleteMachine: Scalars['Int'];
  saveMachine?: Maybe<Machine>;
};


export type MachineMutationDeleteMachineArgs = {
  id: Scalars['ID'];
};


export type MachineMutationSaveMachineArgs = {
  machineInput?: InputMaybe<MachineInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  headscale?: Maybe<HeadscaleMutation>;
  machine?: Maybe<MachineMutation>;
  project?: Maybe<ProjectMutation>;
  route?: Maybe<RouteMutation>;
};

/** 项目 */
export type Project = HasId & {
  __typename?: 'Project';
  /** 项目编码 */
  code?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  /** 当前机器 */
  machine?: Maybe<Machine>;
  /** 当前机器ID */
  machineID?: Maybe<Scalars['ID']>;
  /** 可用机器ID */
  machineIDs?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** 可用机器 */
  machines?: Maybe<Array<Maybe<Machine>>>;
  /** 项目名称 */
  name?: Maybe<Scalars['String']>;
  routes?: Maybe<Array<Maybe<Route>>>;
};

export type ProjectInput = {
  code?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  machineID?: InputMaybe<Scalars['ID']>;
  machineIDs?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
};

export type ProjectMutation = {
  __typename?: 'ProjectMutation';
  deleteProject: Scalars['Int'];
  saveProject?: Maybe<Project>;
  syncProjectRoute?: Maybe<Array<SyncResult>>;
};


export type ProjectMutationDeleteProjectArgs = {
  id: Scalars['ID'];
};


export type ProjectMutationSaveProjectArgs = {
  projectInput?: InputMaybe<ProjectInput>;
};


export type ProjectMutationSyncProjectRouteArgs = {
  projectID?: InputMaybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  headscale?: Maybe<HeadscaleQuery>;
  machines?: Maybe<Array<Maybe<Machine>>>;
  projects?: Maybe<Array<Maybe<Project>>>;
  routes?: Maybe<Array<Maybe<Route>>>;
};

/** 路由 */
export type Route = HasId & {
  __typename?: 'Route';
  /** 描述 */
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  /** 地址 */
  name?: Maybe<Scalars['String']>;
  /** 项目 */
  project?: Maybe<Project>;
  projectID?: Maybe<Scalars['ID']>;
};

export type RouteInput = {
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  projectID?: InputMaybe<Scalars['ID']>;
};

export type RouteMutation = {
  __typename?: 'RouteMutation';
  deleteRoute: Scalars['Int'];
  saveRoute?: Maybe<Route>;
};


export type RouteMutationDeleteRouteArgs = {
  id: Scalars['ID'];
};


export type RouteMutationSaveRouteArgs = {
  routeInput?: InputMaybe<RouteInput>;
};

/** 项目路由同步结果 */
export type SyncResult = {
  __typename?: 'SyncResult';
  machine?: Maybe<Machine>;
  machineID: Scalars['ID'];
  project?: Maybe<Project>;
  projectID: Scalars['ID'];
  route?: Maybe<Route>;
  /** 路由是否启用 */
  routeEnable: Scalars['Boolean'];
  routeID: Scalars['ID'];
};

export type Timestamp = {
  __typename?: 'Timestamp';
  nanos: Scalars['Int'];
  seconds: Scalars['Int'];
};

export type EnableHRouteMutationVariables = Exact<{
  routeId: Scalars['Int'];
  enable: Scalars['Boolean'];
}>;


export type EnableHRouteMutation = { __typename?: 'Mutation', headscale?: { __typename?: 'HeadscaleMutation', route?: { __typename?: 'HRouteMutation', enableRoute: boolean } | null } | null };

export type DeleteHRouteMutationVariables = Exact<{
  routeId: Scalars['Int'];
}>;


export type DeleteHRouteMutation = { __typename?: 'Mutation', headscale?: { __typename?: 'HeadscaleMutation', route?: { __typename?: 'HRouteMutation', deleteRoute: boolean } | null } | null };

export type RenameHMachineMutationVariables = Exact<{
  machineId: Scalars['Int'];
  newName: Scalars['String'];
}>;


export type RenameHMachineMutation = { __typename?: 'Mutation', headscale?: { __typename?: 'HeadscaleMutation', machine?: { __typename?: 'HMachineMutation', renameMachine: { __typename?: 'HMachine', id: number, name: string, ipAddresses: Array<string>, forcedTags: Array<string>, givenName: string, online: boolean, lastSeen?: { __typename?: 'Timestamp', seconds: number, nanos: number } | null, user?: { __typename?: 'HUser', id: string, name: string } | null, routes: Array<{ __typename?: 'HRoute', id: number, prefix: string, enabled: boolean }> } } | null } | null };

export type DeleteHMachineMutationVariables = Exact<{
  machineID: Scalars['Int'];
}>;


export type DeleteHMachineMutation = { __typename?: 'Mutation', headscale?: { __typename?: 'HeadscaleMutation', machine?: { __typename?: 'HMachineMutation', deleteMachine: boolean } | null } | null };

export type MoveHMachineMutationVariables = Exact<{
  machineID: Scalars['Int'];
  userName: Scalars['String'];
}>;


export type MoveHMachineMutation = { __typename?: 'Mutation', headscale?: { __typename?: 'HeadscaleMutation', machine?: { __typename?: 'HMachineMutation', moveMachine: { __typename?: 'HMachine', id: number } } | null } | null };

export type SetHMachineTagsMutationVariables = Exact<{
  machineId: Scalars['Int'];
  tags: Array<Scalars['String']> | Scalars['String'];
}>;


export type SetHMachineTagsMutation = { __typename?: 'Mutation', headscale?: { __typename?: 'HeadscaleMutation', machine?: { __typename?: 'HMachineMutation', setMachineTags: { __typename?: 'HMachine', id: number, name: string, ipAddresses: Array<string>, forcedTags: Array<string>, givenName: string, online: boolean, lastSeen?: { __typename?: 'Timestamp', seconds: number, nanos: number } | null, user?: { __typename?: 'HUser', id: string, name: string } | null, routes: Array<{ __typename?: 'HRoute', id: number, prefix: string, enabled: boolean }> } } | null } | null };

export type CreateUserMutationVariables = Exact<{
  userName: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', headscale?: { __typename?: 'HeadscaleMutation', user?: { __typename?: 'HUserMutation', createUser: { __typename?: 'HUser', id: string } } | null } | null };

export type DeleteUserMutationVariables = Exact<{
  userName: Scalars['String'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', headscale?: { __typename?: 'HeadscaleMutation', user?: { __typename?: 'HUserMutation', deleteUser: boolean } | null } | null };

export type RenameUserMutationVariables = Exact<{
  userName: Scalars['String'];
  newName: Scalars['String'];
}>;


export type RenameUserMutation = { __typename?: 'Mutation', headscale?: { __typename?: 'HeadscaleMutation', user?: { __typename?: 'HUserMutation', renameUser: { __typename?: 'HUser', id: string } } | null } | null };

export type HMachineResultFragment = { __typename?: 'HMachine', id: number, name: string, ipAddresses: Array<string>, forcedTags: Array<string>, givenName: string, online: boolean, lastSeen?: { __typename?: 'Timestamp', seconds: number, nanos: number } | null, user?: { __typename?: 'HUser', id: string, name: string } | null, routes: Array<{ __typename?: 'HRoute', id: number, prefix: string, enabled: boolean }> };

export type HmachinesQueryVariables = Exact<{ [key: string]: never; }>;


export type HmachinesQuery = { __typename?: 'Query', headscale?: { __typename?: 'HeadscaleQuery', machines: Array<{ __typename?: 'HMachine', id: number, name: string, ipAddresses: Array<string>, forcedTags: Array<string>, givenName: string, online: boolean, lastSeen?: { __typename?: 'Timestamp', seconds: number, nanos: number } | null, user?: { __typename?: 'HUser', id: string, name: string } | null, routes: Array<{ __typename?: 'HRoute', id: number, prefix: string, enabled: boolean }> }> } | null };

export type HmachineQueryVariables = Exact<{
  machineId: Scalars['Int'];
}>;


export type HmachineQuery = { __typename?: 'Query', headscale?: { __typename?: 'HeadscaleQuery', machine?: { __typename?: 'HMachine', id: number, name: string, ipAddresses: Array<string>, forcedTags: Array<string>, givenName: string, online: boolean, lastSeen?: { __typename?: 'Timestamp', seconds: number, nanos: number } | null, user?: { __typename?: 'HUser', id: string, name: string } | null, routes: Array<{ __typename?: 'HRoute', id: number, prefix: string, enabled: boolean }> } | null } | null };

export type HusersQueryVariables = Exact<{ [key: string]: never; }>;


export type HusersQuery = { __typename?: 'Query', headscale?: { __typename?: 'HeadscaleQuery', users: Array<{ __typename?: 'HUser', id: string, name: string, oldName: string, createdAt?: { __typename?: 'Timestamp', seconds: number, nanos: number } | null }> } | null };

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

export const HMachineResultFragmentDoc = gql`
    fragment HMachineResult on HMachine {
  id
  name
  ipAddresses
  lastSeen {
    seconds
    nanos
  }
  forcedTags
  givenName
  online
  user {
    id
    name
  }
  routes {
    id
    prefix
    enabled
  }
}
    `;
export const EnableHRouteDocument = gql`
    mutation enableHRoute($routeId: Int!, $enable: Boolean!) {
  headscale {
    route {
      enableRoute(routeId: $routeId, enable: $enable)
    }
  }
}
    `;
export type EnableHRouteMutationFn = Apollo.MutationFunction<EnableHRouteMutation, EnableHRouteMutationVariables>;

/**
 * __useEnableHRouteMutation__
 *
 * To run a mutation, you first call `useEnableHRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnableHRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enableHRouteMutation, { data, loading, error }] = useEnableHRouteMutation({
 *   variables: {
 *      routeId: // value for 'routeId'
 *      enable: // value for 'enable'
 *   },
 * });
 */
export function useEnableHRouteMutation(baseOptions?: Apollo.MutationHookOptions<EnableHRouteMutation, EnableHRouteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnableHRouteMutation, EnableHRouteMutationVariables>(EnableHRouteDocument, options);
      }
export type EnableHRouteMutationHookResult = ReturnType<typeof useEnableHRouteMutation>;
export type EnableHRouteMutationResult = Apollo.MutationResult<EnableHRouteMutation>;
export type EnableHRouteMutationOptions = Apollo.BaseMutationOptions<EnableHRouteMutation, EnableHRouteMutationVariables>;
export const DeleteHRouteDocument = gql`
    mutation deleteHRoute($routeId: Int!) {
  headscale {
    route {
      deleteRoute(routeId: $routeId)
    }
  }
}
    `;
export type DeleteHRouteMutationFn = Apollo.MutationFunction<DeleteHRouteMutation, DeleteHRouteMutationVariables>;

/**
 * __useDeleteHRouteMutation__
 *
 * To run a mutation, you first call `useDeleteHRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteHRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteHRouteMutation, { data, loading, error }] = useDeleteHRouteMutation({
 *   variables: {
 *      routeId: // value for 'routeId'
 *   },
 * });
 */
export function useDeleteHRouteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteHRouteMutation, DeleteHRouteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteHRouteMutation, DeleteHRouteMutationVariables>(DeleteHRouteDocument, options);
      }
export type DeleteHRouteMutationHookResult = ReturnType<typeof useDeleteHRouteMutation>;
export type DeleteHRouteMutationResult = Apollo.MutationResult<DeleteHRouteMutation>;
export type DeleteHRouteMutationOptions = Apollo.BaseMutationOptions<DeleteHRouteMutation, DeleteHRouteMutationVariables>;
export const RenameHMachineDocument = gql`
    mutation renameHMachine($machineId: Int!, $newName: String!) {
  headscale {
    machine {
      renameMachine(machineId: $machineId, name: $newName) {
        ...HMachineResult
      }
    }
  }
}
    ${HMachineResultFragmentDoc}`;
export type RenameHMachineMutationFn = Apollo.MutationFunction<RenameHMachineMutation, RenameHMachineMutationVariables>;

/**
 * __useRenameHMachineMutation__
 *
 * To run a mutation, you first call `useRenameHMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameHMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameHMachineMutation, { data, loading, error }] = useRenameHMachineMutation({
 *   variables: {
 *      machineId: // value for 'machineId'
 *      newName: // value for 'newName'
 *   },
 * });
 */
export function useRenameHMachineMutation(baseOptions?: Apollo.MutationHookOptions<RenameHMachineMutation, RenameHMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RenameHMachineMutation, RenameHMachineMutationVariables>(RenameHMachineDocument, options);
      }
export type RenameHMachineMutationHookResult = ReturnType<typeof useRenameHMachineMutation>;
export type RenameHMachineMutationResult = Apollo.MutationResult<RenameHMachineMutation>;
export type RenameHMachineMutationOptions = Apollo.BaseMutationOptions<RenameHMachineMutation, RenameHMachineMutationVariables>;
export const DeleteHMachineDocument = gql`
    mutation deleteHMachine($machineID: Int!) {
  headscale {
    machine {
      deleteMachine(machineId: $machineID)
    }
  }
}
    `;
export type DeleteHMachineMutationFn = Apollo.MutationFunction<DeleteHMachineMutation, DeleteHMachineMutationVariables>;

/**
 * __useDeleteHMachineMutation__
 *
 * To run a mutation, you first call `useDeleteHMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteHMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteHMachineMutation, { data, loading, error }] = useDeleteHMachineMutation({
 *   variables: {
 *      machineID: // value for 'machineID'
 *   },
 * });
 */
export function useDeleteHMachineMutation(baseOptions?: Apollo.MutationHookOptions<DeleteHMachineMutation, DeleteHMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteHMachineMutation, DeleteHMachineMutationVariables>(DeleteHMachineDocument, options);
      }
export type DeleteHMachineMutationHookResult = ReturnType<typeof useDeleteHMachineMutation>;
export type DeleteHMachineMutationResult = Apollo.MutationResult<DeleteHMachineMutation>;
export type DeleteHMachineMutationOptions = Apollo.BaseMutationOptions<DeleteHMachineMutation, DeleteHMachineMutationVariables>;
export const MoveHMachineDocument = gql`
    mutation moveHMachine($machineID: Int!, $userName: String!) {
  headscale {
    machine {
      moveMachine(machineId: $machineID, userName: $userName) {
        id
      }
    }
  }
}
    `;
export type MoveHMachineMutationFn = Apollo.MutationFunction<MoveHMachineMutation, MoveHMachineMutationVariables>;

/**
 * __useMoveHMachineMutation__
 *
 * To run a mutation, you first call `useMoveHMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveHMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveHMachineMutation, { data, loading, error }] = useMoveHMachineMutation({
 *   variables: {
 *      machineID: // value for 'machineID'
 *      userName: // value for 'userName'
 *   },
 * });
 */
export function useMoveHMachineMutation(baseOptions?: Apollo.MutationHookOptions<MoveHMachineMutation, MoveHMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveHMachineMutation, MoveHMachineMutationVariables>(MoveHMachineDocument, options);
      }
export type MoveHMachineMutationHookResult = ReturnType<typeof useMoveHMachineMutation>;
export type MoveHMachineMutationResult = Apollo.MutationResult<MoveHMachineMutation>;
export type MoveHMachineMutationOptions = Apollo.BaseMutationOptions<MoveHMachineMutation, MoveHMachineMutationVariables>;
export const SetHMachineTagsDocument = gql`
    mutation setHMachineTags($machineId: Int!, $tags: [String!]!) {
  headscale {
    machine {
      setMachineTags(machineId: $machineId, tags: $tags) {
        ...HMachineResult
      }
    }
  }
}
    ${HMachineResultFragmentDoc}`;
export type SetHMachineTagsMutationFn = Apollo.MutationFunction<SetHMachineTagsMutation, SetHMachineTagsMutationVariables>;

/**
 * __useSetHMachineTagsMutation__
 *
 * To run a mutation, you first call `useSetHMachineTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetHMachineTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setHMachineTagsMutation, { data, loading, error }] = useSetHMachineTagsMutation({
 *   variables: {
 *      machineId: // value for 'machineId'
 *      tags: // value for 'tags'
 *   },
 * });
 */
export function useSetHMachineTagsMutation(baseOptions?: Apollo.MutationHookOptions<SetHMachineTagsMutation, SetHMachineTagsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetHMachineTagsMutation, SetHMachineTagsMutationVariables>(SetHMachineTagsDocument, options);
      }
export type SetHMachineTagsMutationHookResult = ReturnType<typeof useSetHMachineTagsMutation>;
export type SetHMachineTagsMutationResult = Apollo.MutationResult<SetHMachineTagsMutation>;
export type SetHMachineTagsMutationOptions = Apollo.BaseMutationOptions<SetHMachineTagsMutation, SetHMachineTagsMutationVariables>;
export const CreateUserDocument = gql`
    mutation createUser($userName: String!) {
  headscale {
    user {
      createUser(name: $userName) {
        id
      }
    }
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      userName: // value for 'userName'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation deleteUser($userName: String!) {
  headscale {
    user {
      deleteUser(name: $userName)
    }
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      userName: // value for 'userName'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const RenameUserDocument = gql`
    mutation renameUser($userName: String!, $newName: String!) {
  headscale {
    user {
      renameUser(oldName: $userName, newName: $newName) {
        id
      }
    }
  }
}
    `;
export type RenameUserMutationFn = Apollo.MutationFunction<RenameUserMutation, RenameUserMutationVariables>;

/**
 * __useRenameUserMutation__
 *
 * To run a mutation, you first call `useRenameUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameUserMutation, { data, loading, error }] = useRenameUserMutation({
 *   variables: {
 *      userName: // value for 'userName'
 *      newName: // value for 'newName'
 *   },
 * });
 */
export function useRenameUserMutation(baseOptions?: Apollo.MutationHookOptions<RenameUserMutation, RenameUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RenameUserMutation, RenameUserMutationVariables>(RenameUserDocument, options);
      }
export type RenameUserMutationHookResult = ReturnType<typeof useRenameUserMutation>;
export type RenameUserMutationResult = Apollo.MutationResult<RenameUserMutation>;
export type RenameUserMutationOptions = Apollo.BaseMutationOptions<RenameUserMutation, RenameUserMutationVariables>;
export const HmachinesDocument = gql`
    query hmachines {
  headscale {
    machines {
      ...HMachineResult
    }
  }
}
    ${HMachineResultFragmentDoc}`;

/**
 * __useHmachinesQuery__
 *
 * To run a query within a React component, call `useHmachinesQuery` and pass it any options that fit your needs.
 * When your component renders, `useHmachinesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHmachinesQuery({
 *   variables: {
 *   },
 * });
 */
export function useHmachinesQuery(baseOptions?: Apollo.QueryHookOptions<HmachinesQuery, HmachinesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HmachinesQuery, HmachinesQueryVariables>(HmachinesDocument, options);
      }
export function useHmachinesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HmachinesQuery, HmachinesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HmachinesQuery, HmachinesQueryVariables>(HmachinesDocument, options);
        }
export type HmachinesQueryHookResult = ReturnType<typeof useHmachinesQuery>;
export type HmachinesLazyQueryHookResult = ReturnType<typeof useHmachinesLazyQuery>;
export type HmachinesQueryResult = Apollo.QueryResult<HmachinesQuery, HmachinesQueryVariables>;
export const HmachineDocument = gql`
    query hmachine($machineId: Int!) {
  headscale {
    machine(machineId: $machineId) {
      ...HMachineResult
    }
  }
}
    ${HMachineResultFragmentDoc}`;

/**
 * __useHmachineQuery__
 *
 * To run a query within a React component, call `useHmachineQuery` and pass it any options that fit your needs.
 * When your component renders, `useHmachineQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHmachineQuery({
 *   variables: {
 *      machineId: // value for 'machineId'
 *   },
 * });
 */
export function useHmachineQuery(baseOptions: Apollo.QueryHookOptions<HmachineQuery, HmachineQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HmachineQuery, HmachineQueryVariables>(HmachineDocument, options);
      }
export function useHmachineLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HmachineQuery, HmachineQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HmachineQuery, HmachineQueryVariables>(HmachineDocument, options);
        }
export type HmachineQueryHookResult = ReturnType<typeof useHmachineQuery>;
export type HmachineLazyQueryHookResult = ReturnType<typeof useHmachineLazyQuery>;
export type HmachineQueryResult = Apollo.QueryResult<HmachineQuery, HmachineQueryVariables>;
export const HusersDocument = gql`
    query husers {
  headscale {
    users {
      id
      name
      oldName: name
      createdAt {
        seconds
        nanos
      }
    }
  }
}
    `;

/**
 * __useHusersQuery__
 *
 * To run a query within a React component, call `useHusersQuery` and pass it any options that fit your needs.
 * When your component renders, `useHusersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHusersQuery({
 *   variables: {
 *   },
 * });
 */
export function useHusersQuery(baseOptions?: Apollo.QueryHookOptions<HusersQuery, HusersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HusersQuery, HusersQueryVariables>(HusersDocument, options);
      }
export function useHusersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HusersQuery, HusersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HusersQuery, HusersQueryVariables>(HusersDocument, options);
        }
export type HusersQueryHookResult = ReturnType<typeof useHusersQuery>;
export type HusersLazyQueryHookResult = ReturnType<typeof useHusersLazyQuery>;
export type HusersQueryResult = Apollo.QueryResult<HusersQuery, HusersQueryVariables>;
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