// @ts-check

export default {
  translation: {
    appName: 'Task Manager',
    buttons: {
      edit: 'Edit',
      delete: 'Delete',
      createStatus: 'Create status',
    },
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      statuses: {
        create: {
          error: 'Failed to create a status',
          success: 'Status has been created successfully',
        },
        delete: {
          error: 'Failed to delete a status',
          success: 'Status has been deleted successfully',
        },
        edit: {
          error: 'Failed to edit a status',
          success: 'Status has been edited successfully',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User has been registered successfully',
        },
        delete: {
          error: 'Failed to delete',
          success: 'User has been deleted successfully',
        },
        edit: {
          error: 'Failed to edit',
          success: 'User has been edited successfully',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        statuses: 'Statuses',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        actions: 'Actions',
        edit: {
          title: 'Status editing',
          submit: 'Edit status',
        },
        new: {
          title: 'Status creation',
          submit: 'Create status',
        },
      },
      users: {
        id: 'ID',
        firstName: 'First Name',
        lastName: 'Last Name',
        fullName: 'Full name',
        email: 'Email',
        password: 'Password',
        createdAt: 'Created at',
        actions: 'Actions',
        edit: {
          title: 'User editing',
        },
        new: {
          submit: 'Register',
          signUp: 'Register',
        },
      },
      welcome: {
        index: {
          hello: 'Hello from me!',
          description: 'Description',
          more: 'Learn more',
        },
      },
    },
  },
};
