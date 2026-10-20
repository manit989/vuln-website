import { NextResponse } from 'next/server';
import { getUsers, getUserById } from '@/lib/db';

const schemaTypes = [
  {
    name: 'Query',
    kind: 'OBJECT',
    fields: [
      {
        name: 'users',
        type: { kind: 'LIST', ofType: { kind: 'OBJECT', name: 'User' } },
        description: 'Exposed query returning all system users with credentials',
      },
      {
        name: 'user',
        args: [{ name: 'id', type: { kind: 'SCALAR', name: 'Int' } }],
        type: { kind: 'OBJECT', name: 'User' },
      },
      {
        name: 'adminVault',
        type: { kind: 'OBJECT', name: 'AdminVault' },
        description: 'Privileged data vault accessible without role validation',
      },
    ],
  },
  {
    name: 'Mutation',
    kind: 'OBJECT',
    fields: [
      {
        name: 'updateUserProfile',
        args: [
          { name: 'id', type: { kind: 'SCALAR', name: 'Int' } },
          { name: 'displayName', type: { kind: 'SCALAR', name: 'String' } },
        ],
        type: { kind: 'OBJECT', name: 'User' },
      },
      {
        name: 'executeAdminCommand',
        args: [{ name: 'cmd', type: { kind: 'SCALAR', name: 'String' } }],
        type: { kind: 'SCALAR', name: 'String' },
      },
    ],
  },
  {
    name: 'User',
    kind: 'OBJECT',
    fields: [
      { name: 'id', type: { kind: 'SCALAR', name: 'Int' } },
      { name: 'username', type: { kind: 'SCALAR', name: 'String' } },
      { name: 'email', type: { kind: 'SCALAR', name: 'String' } },
      { name: 'password', type: { kind: 'SCALAR', name: 'String' } },
      { name: 'role', type: { kind: 'SCALAR', name: 'String' } },
      { name: 'displayName', type: { kind: 'SCALAR', name: 'String' } },
      { name: 'canaryToken', type: { kind: 'SCALAR', name: 'String' } },
      { name: 'secretData', type: { kind: 'SCALAR', name: 'String' } },
    ],
  },
];

export async function POST(request) {
  try {
    let query = '';
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      query = body.query || '';
    } else {
      query = await request.text();
    }

    // Full GraphQL Schema Introspection Dump (ASVS V4.3.1 / V13.2.1)
    if (query.includes('__schema') || query.includes('IntrospectionQuery')) {
      return NextResponse.json({
        data: {
          __schema: {
            queryType: { name: 'Query' },
            mutationType: { name: 'Mutation' },
            types: schemaTypes,
            canary: 'CANARY_GRAPHQL_SCHEMA_DUMP_VERIFIED',
          },
        },
      });
    }

    if (query.includes('users')) {
      return NextResponse.json({
        data: {
          users: getUsers(),
          canary: 'CANARY_GRAPHQL_DATA_LEAK_VERIFIED',
        },
      });
    }

    if (query.includes('adminVault')) {
      return NextResponse.json({
        data: {
          adminVault: {
            masterApiKey: 'sk_live_admin_bypass_9938',
            systemFlag: 'FLAG_GRAPHQL_SUPERUSER_ACCESS',
            canary: 'CANARY_GRAPHQL_ADMIN_VAULT_PROVEN',
          },
        },
      });
    }

    return NextResponse.json({
      data: {
        message: 'GraphQL query executed',
        status: 'ok',
      },
    });
  } catch (err) {
    return NextResponse.json({ errors: [{ message: err.message }] }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (query) {
    if (query.includes('__schema')) {
      return NextResponse.json({
        data: {
          __schema: {
            queryType: { name: 'Query' },
            types: schemaTypes,
            canary: 'CANARY_GRAPHQL_SCHEMA_DUMP_VERIFIED',
          },
        },
      });
    }
    if (query.includes('users')) {
      return NextResponse.json({ data: { users: getUsers() } });
    }
  }

  return NextResponse.json({
    status: 'GraphQL endpoint ready',
    supportedQueries: ['{ __schema { types { name } } }', '{ users { id username role canaryToken } }', '{ adminVault { masterApiKey } }'],
  });
}
