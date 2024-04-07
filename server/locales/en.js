// @ts-check

export default {
  translation: {
    appName: 'Task Manager',
    buttons: {
      edit: 'Edit',
      delete: 'Delete',
      createStatus: 'New status',
      createTask: 'New task',
      createLabel: 'New label',
    },
    flash: {
      labels: {
        create: {
          error: 'Failed to create a label',
          success: 'Label has been created successfully',
        },
        delete: {
          error: 'Failed to delete a label',
          hasTasks: 'Label has associated tasks',
          success: 'Label has been deleted successfully',
        },
        edit: {
          error: 'Failed to edit a Label',
          success: 'Label has been edited successfully',
        },
      },
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
          hasTasks: 'Status has associated tasks',
          success: 'Status has been deleted successfully',
        },
        edit: {
          error: 'Failed to edit a status',
          success: 'Status has been edited successfully',
        },
      },
      tasks: {
        create: {
          error: 'Failed to create a task',
          success: 'Task has been created successfully',
        },
        delete: {
          error: 'Failed to delete a task',
          success: 'Task has been deleted successfully',
        },
        edit: {
          error: 'Failed to edit a task',
          success: 'Task has been edited successfully',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User has been registered successfully',
        },
        delete: {
          error: 'Failed to delete',
          hasTasks: 'User has associated tasks',
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
        tasks: 'Tasks',
        labels: 'Labels',
      },
    },
    views: {
      labels: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        actions: 'Actions',
        edit: {
          title: 'Label editing',
          submit: 'Edit label',
        },
        new: {
          title: 'Label creation',
          submit: 'Create label',
        },
      },
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
      tasks: {
        id: 'ID',
        name: 'Name',
        description: 'Description',
        label: 'Label',
        labels: 'Labels',
        statusId: 'Status',
        executorId: 'Executor',
        creatorId: 'Creator',
        myTasks: 'My tasks only',
        createdAt: 'Created at',
        actions: 'Actions',
        edit: {
          title: 'Task editing',
          submit: 'Edit task',
        },
        new: {
          title: 'Task creation',
          submit: 'Create task',
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
          submit: 'Save',
          signUp: 'Register',
        },
      },
      welcome: {
        index: {
          hello: 'Hello!',
          description: 'Description',
          more: 'Learn more',
        },
      },
    },
  },
};

